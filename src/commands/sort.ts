import * as vscode from 'vscode';
import * as nls from 'vscode-nls';

const localize = nls.config({ messageFormat: nls.MessageFormat.file })();

type SortOrder = 'asc' | 'desc' | 'domain' | 'length-asc' | 'length-desc';

interface SortOption {
	readonly label: string;
	readonly value: SortOrder;
}

export function registerSortCommand(context: vscode.ExtensionContext): void {
	const command = vscode.commands.registerCommand(
		'urls-le.postProcess.sort',
		async () => executeSortCommand(),
	);

	context.subscriptions.push(command);
}

async function executeSortCommand(): Promise<void> {
	// Fail fast: Check for active editor
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		showNoEditorWarning();
		return;
	}

	const sortOption = await promptForSortOrder();

	// Fail fast: User cancelled
	if (!sortOption) {
		return;
	}

	try {
		await performSort(editor, sortOption);
	} catch (error) {
		handleSortError(error);
	}
}

async function promptForSortOrder(): Promise<SortOption | undefined> {
	return vscode.window.showQuickPick(createSortOptions(), {
		placeHolder: localize('runtime.sort.pick.placeholder', 'Select sort order'),
	});
}

function createSortOptions(): SortOption[] {
	return [
		{
			label: localize('runtime.sort.pick.alpha-asc', 'Alphabetical (A → Z)'),
			value: 'asc',
		},
		{
			label: localize('runtime.sort.pick.alpha-desc', 'Alphabetical (Z → A)'),
			value: 'desc',
		},
		{
			label: localize('runtime.sort.pick.domain', 'By Domain'),
			value: 'domain',
		},
		{
			label: localize(
				'runtime.sort.pick.length-asc',
				'By Length (Short → Long)',
			),
			value: 'length-asc',
		},
		{
			label: localize(
				'runtime.sort.pick.length-desc',
				'By Length (Long → Short)',
			),
			value: 'length-desc',
		},
	];
}

async function performSort(
	editor: vscode.TextEditor,
	sortOption: SortOption,
): Promise<void> {
	const document = editor.document;
	const lines = extractNonEmptyLines(document);
	const sorted = sortLines(lines, sortOption.value);

	await replaceDocumentContent(document, sorted);
	showSuccessMessage(sorted.length, sortOption.label);
}

function extractNonEmptyLines(document: vscode.TextDocument): string[] {
	return document
		.getText()
		.split('\n')
		.map((line) => line.trim())
		.filter((line) => line.length > 0);
}

function sortLines(lines: string[], order: SortOrder): string[] {
	switch (order) {
		case 'domain':
			return sortByDomain(lines);
		case 'length-asc':
			return sortByLength(lines, 'asc');
		case 'length-desc':
			return sortByLength(lines, 'desc');
		case 'asc':
			return sortAlphabetically(lines, 'asc');
		case 'desc':
			return sortAlphabetically(lines, 'desc');
	}
}

function sortByDomain(lines: string[]): string[] {
	return [...lines].sort((a, b) => {
		const domainA = extractDomain(a);
		const domainB = extractDomain(b);
		return domainA.localeCompare(domainB);
	});
}

function extractDomain(url: string): string {
	try {
		return new URL(url).hostname;
	} catch {
		// If URL parsing fails, use the original string
		return url;
	}
}

function sortByLength(lines: string[], order: 'asc' | 'desc'): string[] {
	return [...lines].sort((a, b) => {
		return order === 'asc' ? a.length - b.length : b.length - a.length;
	});
}

function sortAlphabetically(lines: string[], order: 'asc' | 'desc'): string[] {
	return [...lines].sort((a, b) => {
		return order === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
	});
}

async function replaceDocumentContent(
	document: vscode.TextDocument,
	lines: string[],
): Promise<void> {
	const edit = new vscode.WorkspaceEdit();
	edit.replace(
		document.uri,
		new vscode.Range(0, 0, document.lineCount, 0),
		lines.join('\n'),
	);
	await vscode.workspace.applyEdit(edit);
}

function showNoEditorWarning(): void {
	vscode.window.showWarningMessage(
		localize('runtime.sort.no-editor', 'No active editor found'),
	);
}

function showSuccessMessage(count: number, sortLabel: string): void {
	vscode.window.showInformationMessage(
		localize('runtime.sort.success', 'Sorted {0} URLs ({1})', count, sortLabel),
	);
}

function handleSortError(error: unknown): void {
	const message =
		error instanceof Error
			? error.message
			: localize('runtime.error.unknown-fallback', 'Unknown error occurred');

	vscode.window.showErrorMessage(
		localize('runtime.sort.error', 'Sorting failed: {0}', message),
	);
}

import * as vscode from 'vscode';
import * as nls from 'vscode-nls';
import { getConfiguration } from '../config/config';
import { extractUrls } from '../extraction/extract';
import type { Telemetry } from '../telemetry/telemetry';
import type { Configuration, ExtractionResult } from '../types';
import type { Notifier } from '../ui/notifier';
import type { StatusBar } from '../ui/statusBar';
import { handleSafetyChecks } from '../utils/safety';

const localize = nls.config({ messageFormat: nls.MessageFormat.file })();

const MAX_CLIPBOARD_SIZE = 1_000_000; // 1MB

interface CommandDependencies {
	readonly telemetry: Telemetry;
	readonly notifier: Notifier;
	readonly statusBar: StatusBar;
}

export function registerExtractCommand(
	context: vscode.ExtensionContext,
	deps: Readonly<CommandDependencies>,
): void {
	const command = vscode.commands.registerCommand(
		'urls-le.extractUrls',
		async () => executeExtractCommand(deps),
	);

	context.subscriptions.push(command);
}

async function executeExtractCommand(deps: CommandDependencies): Promise<void> {
	deps.telemetry.event('command-extract-urls');

	// Fail fast: Check for active editor
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		deps.notifier.showWarning(
			localize('runtime.error.no-active-editor', 'No active editor found'),
		);
		return;
	}

	const document = editor.document;
	const config = getConfiguration();

	// Fail fast: Safety checks
	const safetyResult = handleSafetyChecks(document, config);
	if (!safetyResult.proceed) {
		deps.notifier.showWarning(safetyResult.message);
		return;
	}

	const cancellationToken = new vscode.CancellationTokenSource();

	try {
		await performExtraction(document, config, cancellationToken.token, deps);
	} catch (error) {
		handleExtractionError(error, deps);
	} finally {
		deps.statusBar.hideProgress();
		cancellationToken.dispose();
	}
}

async function performExtraction(
	document: vscode.TextDocument,
	config: Configuration,
	token: vscode.CancellationToken,
	deps: CommandDependencies,
): Promise<void> {
	deps.statusBar.showExtracting();

	// Fail fast: Check cancellation
	if (token.isCancellationRequested) {
		return;
	}

	const result = await extractUrls(
		document.getText(),
		document.languageId,
		token,
	);

	// Fail fast: Check cancellation after extraction
	if (token.isCancellationRequested) {
		return;
	}

	// Fail fast: Check extraction success
	if (!result.success) {
		handleExtractionFailure(result, deps);
		return;
	}

	// Fail fast: Check for empty results
	if (!result.urls || result.urls.length === 0) {
		showNoUrlsFound(deps);
		return;
	}

	const formattedUrls = formatUrls(result);
	await displayResults(formattedUrls, document, config, token, deps);
	await handleClipboard(formattedUrls, config, token, deps);

	deps.notifier.showInfo(
		localize(
			'runtime.info.urls-extracted',
			'Extracted {0} URLs',
			result.urls.length,
		),
	);
	deps.telemetry.event('extract-success', { count: result.urls.length });
}

function formatUrls(result: ExtractionResult): string[] {
	return result.urls
		.filter((url) => url?.value && typeof url.value === 'string')
		.map((url) => url.value);
}

function handleExtractionFailure(
	result: ExtractionResult,
	deps: CommandDependencies,
): void {
	const errorMessage = extractErrorMessage(result);
	deps.notifier.showError(
		localize(
			'runtime.error.extraction-failed',
			'Failed to extract URLs: {0}',
			errorMessage,
		),
	);
}

function extractErrorMessage(result: ExtractionResult): string {
	if (result.errors && result.errors.length > 0) {
		return result.errors[0]?.message || 'Unknown error';
	}
	return 'Unknown error';
}

function showNoUrlsFound(deps: CommandDependencies): void {
	deps.notifier.showInfo(
		localize(
			'runtime.info.no-urls-found',
			'No URLs found in the current document',
		),
	);
}

async function displayResults(
	formattedUrls: string[],
	document: vscode.TextDocument,
	config: Configuration,
	token: vscode.CancellationToken,
	deps: CommandDependencies,
): Promise<void> {
	const content = formattedUrls.join('\n');

	if (config.openResultsSideBySide) {
		await openSideBySide(content, token, deps);
		return;
	}

	if (config.postProcessOpenInNewFile) {
		await openInNewFile(content, token, deps);
		return;
	}

	await replaceDocumentContent(document, content, token, deps);
}

async function openSideBySide(
	content: string,
	token: vscode.CancellationToken,
	deps: CommandDependencies,
): Promise<void> {
	// Fail fast: Check cancellation
	if (token.isCancellationRequested) {
		return;
	}

	try {
		const doc = await vscode.workspace.openTextDocument({
			content,
			language: 'plaintext',
		});
		await vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
	} catch (error) {
		deps.notifier.showError(
			localize(
				'runtime.error.open-side-by-side-failed',
				'Failed to open results side by side: {0}',
				error instanceof Error ? error.message : 'Unknown error',
			),
		);
	}
}

async function openInNewFile(
	content: string,
	token: vscode.CancellationToken,
	deps: CommandDependencies,
): Promise<void> {
	// Fail fast: Check cancellation
	if (token.isCancellationRequested) {
		return;
	}

	try {
		const doc = await vscode.workspace.openTextDocument({
			content,
			language: 'plaintext',
		});
		await vscode.window.showTextDocument(doc);
	} catch (error) {
		deps.notifier.showError(
			localize(
				'runtime.error.open-new-file-failed',
				'Failed to open results in new file: {0}',
				error instanceof Error ? error.message : 'Unknown error',
			),
		);
	}
}

async function replaceDocumentContent(
	document: vscode.TextDocument,
	content: string,
	token: vscode.CancellationToken,
	deps: CommandDependencies,
): Promise<void> {
	// Fail fast: Check cancellation
	if (token.isCancellationRequested) {
		return;
	}

	try {
		const edit = new vscode.WorkspaceEdit();
		edit.replace(
			document.uri,
			new vscode.Range(0, 0, document.lineCount, 0),
			content,
		);

		const success = await vscode.workspace.applyEdit(edit);
		if (!success) {
			deps.notifier.showError(
				localize(
					'runtime.error.apply-edits-failed',
					'Failed to apply edits to document',
				),
			);
		}
	} catch (error) {
		deps.notifier.showError(
			localize(
				'runtime.error.replace-content-failed',
				'Failed to replace document content: {0}',
				error instanceof Error ? error.message : 'Unknown error',
			),
		);
	}
}

async function handleClipboard(
	formattedUrls: string[],
	config: Configuration,
	token: vscode.CancellationToken,
	deps: CommandDependencies,
): Promise<void> {
	// Fail fast: Check if clipboard is enabled
	if (!config.copyToClipboardEnabled) {
		return;
	}

	const clipboardText = formattedUrls.join('\n');
	const byteSize = calculateByteSize(clipboardText);

	// Fail fast: Check size limit
	if (byteSize > MAX_CLIPBOARD_SIZE) {
		deps.notifier.showWarning(
			localize(
				'runtime.warning.clipboard-too-large',
				'Results too large for clipboard ({0} bytes), skipping clipboard copy',
				byteSize,
			),
		);
		return;
	}

	// Fail fast: Check cancellation
	if (token.isCancellationRequested) {
		return;
	}

	await copyToClipboard(clipboardText, deps);
}

function calculateByteSize(text: string): number {
	return new TextEncoder().encode(text).length;
}

async function copyToClipboard(
	text: string,
	deps: CommandDependencies,
): Promise<void> {
	try {
		await vscode.env.clipboard.writeText(text);
	} catch (error) {
		handleClipboardError(error, deps);
	}
}

function handleClipboardError(error: unknown, deps: CommandDependencies): void {
	const errorMessage =
		error instanceof Error ? error.message : 'Unknown clipboard error';

	if (isPermissionError(errorMessage)) {
		deps.notifier.showWarning(
			localize(
				'runtime.warning.clipboard-access-denied',
				'Clipboard access denied. Extracted URLs but could not copy to clipboard.',
			),
		);
		return;
	}

	deps.notifier.showWarning(
		localize(
			'runtime.error.clipboard-failed',
			'Failed to copy to clipboard: {0}',
			errorMessage,
		),
	);
}

function isPermissionError(message: string): boolean {
	return message.includes('permission') || message.includes('access');
}

function handleExtractionError(
	error: unknown,
	deps: CommandDependencies,
): void {
	const message =
		error instanceof Error
			? error.message
			: localize('runtime.error.unknown-fallback', 'Unknown error occurred');

	deps.notifier.showError(
		localize(
			'runtime.error.extraction-failed',
			'Failed to extract URLs: {0}',
			message,
		),
	);
	deps.telemetry.event('extract-error', { error: message });
}

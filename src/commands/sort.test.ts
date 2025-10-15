import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { commands, window, workspace } from 'vscode';
import { mockExtensionContext } from '../__mocks__/vscode';
import { registerSortCommand } from './sort';

describe('sort command', () => {
	const mockEditor = {
		document: {
			getText: vi.fn(),
			fileName: 'test.md',
			uri: { fsPath: '/test/test.md' },
		},
		edit: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
		(window as any).activeTextEditor = mockEditor;

		// Mock workspace configuration
		(workspace.getConfiguration as any).mockReturnValue({
			get: (_k: string, d: any) => d,
			update: vi.fn(),
			has: vi.fn(),
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('registers sort command', () => {
		registerSortCommand(mockExtensionContext as any);

		expect(commands.registerCommand).toHaveBeenCalledWith(
			'urls-le.postProcess.sort',
			expect.any(Function),
		);
	});

	it('shows error when no active editor', async () => {
		(window as any).activeTextEditor = undefined;

		registerSortCommand(mockExtensionContext as any);
		const commandHandler = (commands.registerCommand as any).mock.calls[0][1];

		await commandHandler();

		expect(window.showErrorMessage).toHaveBeenCalledWith(
			expect.stringContaining('No active editor'),
		);
	});

	it('shows sort options picker', async () => {
		const urls = `https://zebra.com
https://apple.com
https://beta.com`;

		mockEditor.document.getText.mockReturnValue(urls);
		(window.showQuickPick as any).mockResolvedValue({
			label: 'Alphabetical (A → Z)',
			value: 'alpha-asc',
		});
		mockEditor.edit.mockResolvedValue(true);

		registerSortCommand(mockExtensionContext as any);
		const commandHandler = (commands.registerCommand as any).mock.calls[0][1];

		await commandHandler();

		expect(window.showQuickPick).toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					label: expect.stringContaining('Alphabetical'),
				}),
				expect.objectContaining({ label: expect.stringContaining('Domain') }),
				expect.objectContaining({ label: expect.stringContaining('Length') }),
			]),
			expect.objectContaining({
				placeHolder: expect.stringContaining('Select sort order'),
			}),
		);
	});

	it('sorts URLs alphabetically ascending', async () => {
		const urls = `https://zebra.com
https://apple.com
https://beta.com`;

		mockEditor.document.getText.mockReturnValue(urls);
		(window.showQuickPick as any).mockResolvedValue({
			label: 'Alphabetical (A → Z)',
			value: 'alpha-asc',
		});
		mockEditor.edit.mockResolvedValue(true);

		registerSortCommand(mockExtensionContext as any);
		const commandHandler = (commands.registerCommand as any).mock.calls[0][1];

		await commandHandler();

		const editCall = mockEditor.edit.mock.calls[0][0];
		const mockEditBuilder = {
			replace: vi.fn(),
		};
		editCall(mockEditBuilder);

		const replacedContent = mockEditBuilder.replace.mock.calls[0][1];
		const lines = replacedContent.split('\n');
		expect(lines[0]).toBe('https://apple.com');
		expect(lines[1]).toBe('https://beta.com');
		expect(lines[2]).toBe('https://zebra.com');
	});

	it('sorts URLs alphabetically descending', async () => {
		const urls = `https://apple.com
https://zebra.com
https://beta.com`;

		mockEditor.document.getText.mockReturnValue(urls);
		(window.showQuickPick as any).mockResolvedValue({
			label: 'Alphabetical (Z → A)',
			value: 'alpha-desc',
		});
		mockEditor.edit.mockResolvedValue(true);

		registerSortCommand(mockExtensionContext as any);
		const commandHandler = (commands.registerCommand as any).mock.calls[0][1];

		await commandHandler();

		const editCall = mockEditor.edit.mock.calls[0][0];
		const mockEditBuilder = {
			replace: vi.fn(),
		};
		editCall(mockEditBuilder);

		const replacedContent = mockEditBuilder.replace.mock.calls[0][1];
		const lines = replacedContent.split('\n');
		expect(lines[0]).toBe('https://zebra.com');
		expect(lines[1]).toBe('https://beta.com');
		expect(lines[2]).toBe('https://apple.com');
	});

	it('sorts URLs by domain', async () => {
		const urls = `https://zebra.com/path
https://apple.com/path
https://beta.com/path`;

		mockEditor.document.getText.mockReturnValue(urls);
		(window.showQuickPick as any).mockResolvedValue({
			label: 'By Domain',
			value: 'domain',
		});
		mockEditor.edit.mockResolvedValue(true);

		registerSortCommand(mockExtensionContext as any);
		const commandHandler = (commands.registerCommand as any).mock.calls[0][1];

		await commandHandler();

		const editCall = mockEditor.edit.mock.calls[0][0];
		const mockEditBuilder = {
			replace: vi.fn(),
		};
		editCall(mockEditBuilder);

		const replacedContent = mockEditBuilder.replace.mock.calls[0][1];
		const lines = replacedContent.split('\n');
		expect(lines[0]).toBe('https://apple.com/path');
		expect(lines[1]).toBe('https://beta.com/path');
		expect(lines[2]).toBe('https://zebra.com/path');
	});

	it('sorts URLs by length (short to long)', async () => {
		const urls = `https://verylongdomainname.com/very/long/path
https://short.com
https://medium.com/path`;

		mockEditor.document.getText.mockReturnValue(urls);
		(window.showQuickPick as any).mockResolvedValue({
			label: 'By Length (Short → Long)',
			value: 'length-asc',
		});
		mockEditor.edit.mockResolvedValue(true);

		registerSortCommand(mockExtensionContext as any);
		const commandHandler = (commands.registerCommand as any).mock.calls[0][1];

		await commandHandler();

		const editCall = mockEditor.edit.mock.calls[0][0];
		const mockEditBuilder = {
			replace: vi.fn(),
		};
		editCall(mockEditBuilder);

		const replacedContent = mockEditBuilder.replace.mock.calls[0][1];
		const lines = replacedContent.split('\n');
		expect(lines[0]).toBe('https://short.com');
		expect(lines[1]).toBe('https://medium.com/path');
		expect(lines[2]).toBe('https://verylongdomainname.com/very/long/path');
	});

	it('handles user cancellation', async () => {
		const urls = 'https://example.com';
		mockEditor.document.getText.mockReturnValue(urls);
		(window.showQuickPick as any).mockResolvedValue(undefined);

		registerSortCommand(mockExtensionContext as any);
		const commandHandler = (commands.registerCommand as any).mock.calls[0][1];

		await commandHandler();

		expect(mockEditor.edit).not.toHaveBeenCalled();
	});

	it('handles edit failure', async () => {
		const urls = 'https://example.com';
		mockEditor.document.getText.mockReturnValue(urls);
		(window.showQuickPick as any).mockResolvedValue({
			label: 'Alphabetical (A → Z)',
			value: 'alpha-asc',
		});
		mockEditor.edit.mockResolvedValue(false);

		registerSortCommand(mockExtensionContext as any);
		const commandHandler = (commands.registerCommand as any).mock.calls[0][1];

		await commandHandler();

		expect(window.showErrorMessage).toHaveBeenCalledWith(
			expect.stringContaining('Sorting failed'),
		);
	});

	it('preserves non-URL lines', async () => {
		const mixedContent = `# My URLs
https://zebra.com
Some text here
https://apple.com
More text`;

		mockEditor.document.getText.mockReturnValue(mixedContent);
		(window.showQuickPick as any).mockResolvedValue({
			label: 'Alphabetical (A → Z)',
			value: 'alpha-asc',
		});
		mockEditor.edit.mockResolvedValue(true);

		registerSortCommand(mockExtensionContext as any);
		const commandHandler = (commands.registerCommand as any).mock.calls[0][1];

		await commandHandler();

		const editCall = mockEditor.edit.mock.calls[0][0];
		const mockEditBuilder = {
			replace: vi.fn(),
		};
		editCall(mockEditBuilder);

		const replacedContent = mockEditBuilder.replace.mock.calls[0][1];
		expect(replacedContent).toContain('# My URLs');
		expect(replacedContent).toContain('Some text here');
		expect(replacedContent).toContain('More text');

		// URLs should be sorted
		const lines = replacedContent.split('\n');
		const urlLines = lines.filter((line) => line.startsWith('https://'));
		expect(urlLines[0]).toBe('https://apple.com');
		expect(urlLines[1]).toBe('https://zebra.com');
	});

	it('handles errors gracefully', async () => {
		mockEditor.document.getText.mockImplementation(() => {
			throw new Error('Document read error');
		});

		registerSortCommand(mockExtensionContext as any);
		const commandHandler = (commands.registerCommand as any).mock.calls[0][1];

		await commandHandler();

		expect(window.showErrorMessage).toHaveBeenCalledWith(
			expect.stringContaining('Document read error'),
		);
	});
});

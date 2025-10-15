import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { commands, window, workspace } from 'vscode';
import { mockExtensionContext } from '../__mocks__/vscode';
import { registerDedupeCommand } from './dedupe';

describe('dedupe command', () => {
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

	it('registers dedupe command', () => {
		registerDedupeCommand(mockExtensionContext as any);

		expect(commands.registerCommand).toHaveBeenCalledWith(
			'urls-le.postProcess.dedupe',
			expect.any(Function),
		);
	});

	it('shows error when no active editor', async () => {
		(window as any).activeTextEditor = undefined;

		registerDedupeCommand(mockExtensionContext as any);
		const commandHandler = (commands.registerCommand as any).mock.calls[0][1];

		await commandHandler();

		expect(window.showErrorMessage).toHaveBeenCalledWith(
			expect.stringContaining('No active editor'),
		);
	});

	it('deduplicates URLs in editor', async () => {
		const duplicateUrls = `https://example.com
https://test.com
https://example.com
https://another.com
https://test.com`;

		mockEditor.document.getText.mockReturnValue(duplicateUrls);
		mockEditor.edit.mockResolvedValue(true);

		registerDedupeCommand(mockExtensionContext as any);
		const commandHandler = (commands.registerCommand as any).mock.calls[0][1];

		await commandHandler();

		expect(mockEditor.edit).toHaveBeenCalled();
		expect(window.showInformationMessage).toHaveBeenCalledWith(
			expect.stringContaining('Removed 2 duplicate URLs'),
		);
	});

	it('handles case when no duplicates found', async () => {
		const uniqueUrls = `https://example.com
https://test.com
https://another.com`;

		mockEditor.document.getText.mockReturnValue(uniqueUrls);

		registerDedupeCommand(mockExtensionContext as any);
		const commandHandler = (commands.registerCommand as any).mock.calls[0][1];

		await commandHandler();

		expect(window.showInformationMessage).toHaveBeenCalledWith(
			expect.stringContaining('Removed 0 duplicate URLs'),
		);
	});

	it('handles empty content', async () => {
		mockEditor.document.getText.mockReturnValue('');

		registerDedupeCommand(mockExtensionContext as any);
		const commandHandler = (commands.registerCommand as any).mock.calls[0][1];

		await commandHandler();

		expect(window.showInformationMessage).toHaveBeenCalledWith(
			expect.stringContaining('Removed 0 duplicate URLs'),
		);
	});

	it('handles edit failure', async () => {
		const duplicateUrls = `https://example.com
https://example.com`;

		mockEditor.document.getText.mockReturnValue(duplicateUrls);
		mockEditor.edit.mockResolvedValue(false);

		registerDedupeCommand(mockExtensionContext as any);
		const commandHandler = (commands.registerCommand as any).mock.calls[0][1];

		await commandHandler();

		expect(window.showErrorMessage).toHaveBeenCalledWith(
			expect.stringContaining('Deduplication failed'),
		);
	});

	it('handles errors gracefully', async () => {
		mockEditor.document.getText.mockImplementation(() => {
			throw new Error('Document read error');
		});

		registerDedupeCommand(mockExtensionContext as any);
		const commandHandler = (commands.registerCommand as any).mock.calls[0][1];

		await commandHandler();

		expect(window.showErrorMessage).toHaveBeenCalledWith(
			expect.stringContaining('Document read error'),
		);
	});

	it('preserves non-URL lines', async () => {
		const mixedContent = `# My URLs
https://example.com
Some text here
https://example.com
More text
https://test.com`;

		mockEditor.document.getText.mockReturnValue(mixedContent);
		mockEditor.edit.mockResolvedValue(true);

		registerDedupeCommand(mockExtensionContext as any);
		const commandHandler = (commands.registerCommand as any).mock.calls[0][1];

		await commandHandler();

		const editCall = mockEditor.edit.mock.calls[0][0];
		const mockEditBuilder = {
			replace: vi.fn(),
		};
		editCall(mockEditBuilder);

		// Should preserve non-URL lines and remove duplicate URLs
		const replacedContent = mockEditBuilder.replace.mock.calls[0][1];
		expect(replacedContent).toContain('# My URLs');
		expect(replacedContent).toContain('Some text here');
		expect(replacedContent).toContain('More text');
		expect(replacedContent.split('https://example.com').length).toBe(2); // Only one occurrence
	});
});

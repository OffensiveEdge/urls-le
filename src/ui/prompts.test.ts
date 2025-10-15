import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { window } from 'vscode';
import {
	handleCsvHeaderBasedSelection,
	handleCsvIndexBasedSelection,
	promptCsvOptionsIfNeeded,
	promptForFileType,
} from './prompts';

describe('Prompts', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('handleCsvHeaderBasedSelection', () => {
		it('shows column picker with headers', async () => {
			const headers = ['name', 'email', 'url'];
			(window.showQuickPick as any).mockResolvedValue({
				label: 'All columns',
				description: 'Extract from all columns',
			});

			const result = await handleCsvHeaderBasedSelection(headers);

			expect(window.showQuickPick).toHaveBeenCalledWith(
				expect.arrayContaining([
					expect.objectContaining({
						label: 'All columns',
						description: 'Extract from all columns',
					}),
					expect.objectContaining({
						label: 'name',
						description: 'Index 0',
					}),
					expect.objectContaining({
						label: 'email',
						description: 'Index 1',
					}),
					expect.objectContaining({
						label: 'url',
						description: 'Index 2',
					}),
				]),
				expect.objectContaining({
					placeHolder: expect.stringContaining('Select a CSV column'),
				}),
			);

			expect(result).toEqual({ allColumns: true });
		});

		it('returns specific column selection', async () => {
			const headers = ['name', 'email', 'url'];
			(window.showQuickPick as any).mockResolvedValue({
				label: 'url',
				description: 'Index 2',
			});

			const result = await handleCsvHeaderBasedSelection(headers);

			expect(result).toEqual({ columnIndexes: [2] });
		});

		it('handles user cancellation', async () => {
			const headers = ['name', 'email'];
			(window.showQuickPick as any).mockResolvedValue(undefined);

			const result = await handleCsvHeaderBasedSelection(headers);

			expect(result).toBeUndefined();
		});

		it('handles empty headers', async () => {
			const headers: string[] = [];
			(window.showQuickPick as any).mockResolvedValue({
				label: 'All columns',
			});

			const result = await handleCsvHeaderBasedSelection(headers);

			expect(result).toEqual({ allColumns: true });
		});
	});

	describe('handleCsvIndexBasedSelection', () => {
		it('shows input box for column indexes', async () => {
			(window.showInputBox as any).mockResolvedValue('0,2,4');

			const result = await handleCsvIndexBasedSelection();

			expect(window.showInputBox).toHaveBeenCalledWith(
				expect.objectContaining({
					prompt: expect.stringContaining('Enter column indexes'),
					placeHolder: expect.stringContaining('0,1,2'),
					validateInput: expect.any(Function),
				}),
			);

			expect(result).toEqual({ columnIndexes: [0, 2, 4] });
		});

		it('returns all columns for empty input', async () => {
			(window.showInputBox as any).mockResolvedValue('');

			const result = await handleCsvIndexBasedSelection();

			expect(result).toEqual({ allColumns: true });
		});

		it('handles user cancellation', async () => {
			(window.showInputBox as any).mockResolvedValue(undefined);

			const result = await handleCsvIndexBasedSelection();

			expect(result).toBeUndefined();
		});

		it('validates input correctly', async () => {
			(window.showInputBox as any).mockResolvedValue('1,3,5');

			await handleCsvIndexBasedSelection();

			const validateInput = (window.showInputBox as any).mock.calls[0][0]
				.validateInput;

			expect(validateInput('1,2,3')).toBeUndefined();
			expect(validateInput('0')).toBeUndefined();
			expect(validateInput('')).toBeUndefined();
			expect(validateInput('abc')).toBeDefined();
			expect(validateInput('1,abc,3')).toBeDefined();
			expect(validateInput('-1')).toBeDefined();
		});

		it('handles whitespace in input', async () => {
			(window.showInputBox as any).mockResolvedValue(' 1 , 3 , 5 ');

			const result = await handleCsvIndexBasedSelection();

			expect(result).toEqual({ columnIndexes: [1, 3, 5] });
		});
	});

	describe('promptForFileType', () => {
		it('shows file type picker', async () => {
			(window.showQuickPick as any).mockResolvedValue({
				label: 'Markdown',
				value: 'markdown',
			});

			const result = await promptForFileType();

			expect(window.showQuickPick).toHaveBeenCalledWith(
				expect.arrayContaining([
					expect.objectContaining({ label: 'Markdown' }),
					expect.objectContaining({ label: 'HTML' }),
					expect.objectContaining({ label: 'JSON' }),
					expect.objectContaining({ label: 'JavaScript' }),
				]),
				expect.objectContaining({
					placeHolder: expect.stringContaining('Choose file type'),
				}),
			);

			expect(result).toBe('markdown');
		});

		it('handles user cancellation', async () => {
			(window.showQuickPick as any).mockResolvedValue(undefined);

			const result = await promptForFileType();

			expect(result).toBeUndefined();
		});

		it('includes fallback option', async () => {
			(window.showQuickPick as any).mockResolvedValue({
				label: 'Unknown (regex fallback)',
				value: 'fallback',
			});

			const result = await promptForFileType();

			expect(result).toBe('fallback');
		});
	});

	describe('promptCsvOptionsIfNeeded', () => {
		it('prompts for CSV options when file is CSV', async () => {
			(window.showQuickPick as any).mockResolvedValue({
				label: 'All columns',
			});

			const result = await promptCsvOptionsIfNeeded('test.csv', 'csv');

			expect(window.showQuickPick).toHaveBeenCalled();
			expect(result).toEqual({ allColumns: true });
		});

		it('does not prompt for non-CSV files', async () => {
			const result = await promptCsvOptionsIfNeeded('test.md', 'markdown');

			expect(window.showQuickPick).not.toHaveBeenCalled();
			expect(result).toBeUndefined();
		});

		it('handles CSV files with headers', async () => {
			const csvContent =
				'name,email,url\nJohn,john@example.com,https://example.com';
			(window.showQuickPick as any).mockResolvedValue({
				label: 'url',
				description: 'Index 2',
			});

			const result = await promptCsvOptionsIfNeeded(
				'test.csv',
				'csv',
				csvContent,
			);

			expect(result).toEqual({ columnIndexes: [2] });
		});

		it('falls back to index-based selection for CSV without clear headers', async () => {
			const csvContent = '1,2,3\n4,5,6';
			(window.showInputBox as any).mockResolvedValue('0,2');

			const result = await promptCsvOptionsIfNeeded(
				'test.csv',
				'csv',
				csvContent,
			);

			expect(window.showInputBox).toHaveBeenCalled();
			expect(result).toEqual({ columnIndexes: [0, 2] });
		});

		it('handles empty CSV content', async () => {
			(window.showInputBox as any).mockResolvedValue('');

			const result = await promptCsvOptionsIfNeeded('test.csv', 'csv', '');

			expect(result).toEqual({ allColumns: true });
		});
	});
});

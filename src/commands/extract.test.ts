import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { commands, window, workspace } from 'vscode';
import { mockExtensionContext } from '../__mocks__/vscode';

// Mock the extractUrls function before importing
vi.mock('../extraction/extract', () => ({
	extractUrls: vi.fn(),
}));

import { extractUrls } from '../extraction/extract';
import { registerExtractCommand } from './extract';

// Get reference to the mocked function
const mockExtractUrls = vi.mocked(extractUrls);

describe('extract command', () => {
	const mockTelemetry = {
		event: vi.fn(),
		dispose: vi.fn(),
	};

	const mockNotifier = {
		showInfo: vi.fn(),
		showWarning: vi.fn(),
		showError: vi.fn(),
		error: vi.fn(),
		info: vi.fn(),
		warn: vi.fn(),
		dispose: vi.fn(),
	};

	const mockStatusBar = {
		showIdle: vi.fn(),
		showExtracting: vi.fn(),
		showSuccess: vi.fn(),
		showError: vi.fn(),
		showWarning: vi.fn(),
		showProgress: vi.fn(),
		hideProgress: vi.fn(),
		hide: vi.fn(),
		dispose: vi.fn(),
	};

	const mockDeps = {
		telemetry: mockTelemetry,
		notifier: mockNotifier,
		statusBar: mockStatusBar,
	};

	beforeEach(() => {
		vi.clearAllMocks();

		// Mock workspace configuration
		(workspace.getConfiguration as any).mockReturnValue({
			get: (key: string, defaultValue: any) => {
				// Return safe values for testing
				if (key === 'safetyEnabled') return false;
				if (key === 'copyToClipboardEnabled') return false;
				if (key === 'openResultsSideBySide') return false;
				if (key === 'postProcessOpenInNewFile') return false;
				return defaultValue;
			},
			update: vi.fn(),
			has: vi.fn(),
		});

		// Set up mock return values
		mockExtractUrls.mockResolvedValue({
			success: true,
			urls: [
				{
					value: 'https://example.com',
					type: 'https',
					position: { line: 1, column: 1 },
					context: 'test',
				},
				{
					value: 'https://test.com',
					type: 'https',
					position: { line: 1, column: 1 },
					context: 'test',
				},
			],
			errors: [],
			fileType: 'markdown',
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('registers extract command', () => {
		registerExtractCommand(mockExtensionContext as any, mockDeps);

		expect(commands.registerCommand).toHaveBeenCalledWith(
			'urls-le.extractUrls',
			expect.any(Function),
		);
	});

	it('shows error when no active editor', async () => {
		(window as any).activeTextEditor = undefined;

		registerExtractCommand(mockExtensionContext as any, mockDeps);
		const commandHandler = (commands.registerCommand as any).mock.calls[0][1];

		await commandHandler();

		expect(mockNotifier.showWarning).toHaveBeenCalledWith(
			expect.stringContaining('No active editor'),
		);
	});

	it('extracts URLs from active editor', async () => {
		const mockEditor = {
			document: {
				getText: vi
					.fn()
					.mockReturnValue('Visit https://example.com for more info'),
				fileName: 'test.md',
				languageId: 'markdown',
				uri: { fsPath: '/test/test.md' },
			},
		};
		(window as any).activeTextEditor = mockEditor;

		// Set up the mock for this specific test
		mockExtractUrls.mockResolvedValue({
			success: true,
			urls: [
				{
					value: 'https://example.com',
					type: 'https',
					position: { line: 1, column: 1 },
					context: 'test',
				},
				{
					value: 'https://test.com',
					type: 'https',
					position: { line: 1, column: 1 },
					context: 'test',
				},
			],
			errors: [],
			fileType: 'markdown',
		});

		registerExtractCommand(mockExtensionContext as any, mockDeps);
		const commandHandler = (commands.registerCommand as any).mock.calls[0][1];

		await commandHandler();

		expect(mockStatusBar.showExtracting).toHaveBeenCalled();
		expect(mockExtractUrls).toHaveBeenCalledWith(
			'Visit https://example.com for more info',
			'markdown',
			expect.any(Object),
		);
		expect(mockTelemetry.event).toHaveBeenCalledWith('command-extract-urls');
		expect(mockTelemetry.event).toHaveBeenCalledWith('extract-success', {
			count: 2,
		});
	});

	it('handles extraction errors gracefully', async () => {
		const mockEditor = {
			document: {
				getText: vi.fn().mockReturnValue('Some content'),
				fileName: 'test.md',
				uri: { fsPath: '/test/test.md' },
			},
		};
		(window as any).activeTextEditor = mockEditor;

		mockExtractUrls.mockRejectedValue(new Error('Extraction failed'));

		registerExtractCommand(mockExtensionContext as any, mockDeps);
		const commandHandler = (commands.registerCommand as any).mock.calls[0][1];

		await commandHandler();

		expect(mockStatusBar.showError).toHaveBeenCalledWith(
			expect.stringContaining('Extraction failed'),
		);
		expect(mockNotifier.error).toHaveBeenCalled();
	});

	it('shows info when no URLs found', async () => {
		const mockEditor = {
			document: {
				getText: vi.fn().mockReturnValue('No URLs here'),
				fileName: 'test.md',
				uri: { fsPath: '/test/test.md' },
			},
		};
		(window as any).activeTextEditor = mockEditor;

		mockExtractUrls.mockResolvedValue([]);

		registerExtractCommand(mockExtensionContext as any, mockDeps);
		const commandHandler = (commands.registerCommand as any).mock.calls[0][1];

		await commandHandler();

		expect(mockNotifier.showInfo).toHaveBeenCalledWith(
			expect.stringContaining('No URLs found'),
		);
	});

	it('copies to clipboard when enabled', async () => {
		const mockEditor = {
			document: {
				getText: vi.fn().mockReturnValue('Visit https://example.com'),
				fileName: 'test.md',
				uri: { fsPath: '/test/test.md' },
			},
		};
		(window as any).activeTextEditor = mockEditor;

		// Mock configuration to enable clipboard
		(workspace.getConfiguration as any).mockReturnValue({
			get: (key: string, defaultValue: any) => {
				if (key === 'copyToClipboardEnabled') return true;
				return defaultValue;
			},
			update: vi.fn(),
			has: vi.fn(),
		});

		const { extractUrls } = await import('../extraction/extract');
		(extractUrls as any).mockResolvedValue(['https://example.com']);

		registerExtractCommand(mockExtensionContext as any, mockDeps);
		const commandHandler = (commands.registerCommand as any).mock.calls[0][1];

		await commandHandler();

		expect(mockNotifier.showInfo).toHaveBeenCalledWith(
			expect.stringContaining('copied to clipboard'),
		);
	});
});

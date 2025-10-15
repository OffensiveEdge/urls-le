import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { window, workspace } from 'vscode';
import { mockExtensionContext } from '../__mocks__/vscode';
import { createNotifier } from './notifier';

describe('Notifier', () => {
	let notifier: ReturnType<typeof createNotifier>;

	beforeEach(() => {
		vi.clearAllMocks();

		// Mock workspace configuration
		(workspace.getConfiguration as any).mockReturnValue({
			get: (key: string, defaultValue: any) => {
				if (key === 'notificationsLevel') return 'all';
				return defaultValue;
			},
			update: vi.fn(),
			has: vi.fn(),
		});

		notifier = createNotifier(mockExtensionContext as any);
	});

	afterEach(() => {
		notifier.dispose();
		vi.restoreAllMocks();
	});

	it('shows info message when level is all', () => {
		notifier.info('Test info message');

		expect(window.showInformationMessage).toHaveBeenCalledWith(
			'Test info message',
		);
	});

	it('shows warning message when level is all', () => {
		notifier.warn('Test warning message');

		expect(window.showWarningMessage).toHaveBeenCalledWith(
			'Test warning message',
		);
	});

	it('shows error message when level is all', () => {
		notifier.error('Test error message');

		expect(window.showErrorMessage).toHaveBeenCalledWith('Test error message');
	});

	it('shows important messages when level is important', () => {
		vi.clearAllMocks();

		(workspace.getConfiguration as any).mockReturnValue({
			get: (key: string, defaultValue: any) => {
				if (key === 'notificationsLevel') return 'important';
				return defaultValue;
			},
		});

		const importantNotifier = createNotifier(mockExtensionContext as any);

		importantNotifier.error('Important error');
		importantNotifier.warn('Important warning');
		importantNotifier.info('Regular info');

		expect(window.showErrorMessage).toHaveBeenCalledWith('Important error');
		expect(window.showWarningMessage).toHaveBeenCalledWith('Important warning');
		expect(window.showInformationMessage).not.toHaveBeenCalled();

		importantNotifier.dispose();
	});

	it('suppresses all messages when level is silent', () => {
		vi.clearAllMocks();

		(workspace.getConfiguration as any).mockReturnValue({
			get: (key: string, defaultValue: any) => {
				if (key === 'notificationsLevel') return 'silent';
				return defaultValue;
			},
		});

		const silentNotifier = createNotifier(mockExtensionContext as any);

		silentNotifier.error('Error message');
		silentNotifier.warn('Warning message');
		silentNotifier.info('Info message');

		expect(window.showErrorMessage).not.toHaveBeenCalled();
		expect(window.showWarningMessage).not.toHaveBeenCalled();
		expect(window.showInformationMessage).not.toHaveBeenCalled();

		silentNotifier.dispose();
	});

	it('handles unknown notification level gracefully', () => {
		vi.clearAllMocks();

		(workspace.getConfiguration as any).mockReturnValue({
			get: (key: string, defaultValue: any) => {
				if (key === 'notificationsLevel') return 'unknown';
				return defaultValue;
			},
		});

		const unknownNotifier = createNotifier(mockExtensionContext as any);

		// Should default to showing all messages
		unknownNotifier.info('Test message');

		expect(window.showInformationMessage).toHaveBeenCalledWith('Test message');

		unknownNotifier.dispose();
	});

	it('formats messages with parameters', () => {
		notifier.info('Found {0} URLs in {1}', 5, 'test.md');

		expect(window.showInformationMessage).toHaveBeenCalledWith(
			'Found 5 URLs in test.md',
		);
	});

	it('handles empty messages', () => {
		notifier.info('');

		expect(window.showInformationMessage).toHaveBeenCalledWith('');
	});

	it('handles null and undefined parameters', () => {
		notifier.info('Value: {0}', null);
		notifier.warn('Value: {0}', undefined);

		expect(window.showInformationMessage).toHaveBeenCalledWith('Value: null');
		expect(window.showWarningMessage).toHaveBeenCalledWith('Value: undefined');
	});

	it('handles multiple parameter substitutions', () => {
		notifier.error('Error {0}: {1} failed with {2}', 404, 'Request', 'timeout');

		expect(window.showErrorMessage).toHaveBeenCalledWith(
			'Error 404: Request failed with timeout',
		);
	});

	it('handles configuration changes', () => {
		// Initially set to 'all'
		notifier.info('Initial message');
		expect(window.showInformationMessage).toHaveBeenCalledWith(
			'Initial message',
		);

		vi.clearAllMocks();

		// Change configuration to 'silent'
		(workspace.getConfiguration as any).mockReturnValue({
			get: (key: string, defaultValue: any) => {
				if (key === 'notificationsLevel') return 'silent';
				return defaultValue;
			},
		});

		// Create new notifier with updated config
		const updatedNotifier = createNotifier(mockExtensionContext as any);
		updatedNotifier.info('Silent message');

		expect(window.showInformationMessage).not.toHaveBeenCalled();

		updatedNotifier.dispose();
	});

	it('disposes without errors', () => {
		expect(() => {
			notifier.dispose();
		}).not.toThrow();
	});
});

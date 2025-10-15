import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { window, workspace } from 'vscode';
import { mockExtensionContext } from '../__mocks__/vscode';
import { createStatusBar } from './statusBar';

describe('StatusBar', () => {
	let statusBar: ReturnType<typeof createStatusBar>;

	beforeEach(() => {
		vi.clearAllMocks();

		// Mock workspace configuration
		(workspace.getConfiguration as any).mockReturnValue({
			get: (key: string, defaultValue: any) => {
				if (key === 'statusBarEnabled') return true;
				return defaultValue;
			},
			update: vi.fn(),
			has: vi.fn(),
		});

		statusBar = createStatusBar(mockExtensionContext as any);
	});

	afterEach(() => {
		statusBar.dispose();
		vi.restoreAllMocks();
	});

	it('creates status bar item when enabled', () => {
		expect(window.createStatusBarItem).toHaveBeenCalledWith(
			expect.any(Number), // StatusBarAlignment.Left
			1000,
		);
	});

	it('does not create status bar item when disabled', () => {
		vi.clearAllMocks();

		(workspace.getConfiguration as any).mockReturnValue({
			get: (key: string, defaultValue: any) => {
				if (key === 'statusBarEnabled') return false;
				return defaultValue;
			},
		});

		const disabledStatusBar = createStatusBar(mockExtensionContext as any);

		expect(window.createStatusBarItem).not.toHaveBeenCalled();
		disabledStatusBar.dispose();
	});

	it('shows idle state', () => {
		const mockItem = (window.createStatusBarItem as any).mock.results[0].value;

		statusBar.showIdle();

		expect(mockItem.text).toContain('Ready');
		expect(mockItem.color).toBeUndefined();
		expect(mockItem.backgroundColor).toBeUndefined();
		expect(mockItem.show).toHaveBeenCalled();
	});

	it('shows extracting state', () => {
		const mockItem = (window.createStatusBarItem as any).mock.results[0].value;

		statusBar.showExtracting();

		expect(mockItem.text).toContain('Extracting');
		expect(mockItem.color).toBeDefined();
		expect(mockItem.backgroundColor).toBeDefined();
		expect(mockItem.show).toHaveBeenCalled();
	});

	it('shows success state with count', () => {
		const mockItem = (window.createStatusBarItem as any).mock.results[0].value;

		statusBar.showSuccess(5);

		expect(mockItem.text).toContain('5 URLs found');
		expect(mockItem.color).toBeDefined();
		expect(mockItem.backgroundColor).toBeDefined();
		expect(mockItem.show).toHaveBeenCalled();
	});

	it('shows error state', () => {
		const mockItem = (window.createStatusBarItem as any).mock.results[0].value;

		statusBar.showError('Test error');

		expect(mockItem.text).toContain('Error');
		expect(mockItem.tooltip).toContain('Test error');
		expect(mockItem.color).toBeDefined();
		expect(mockItem.backgroundColor).toBeDefined();
		expect(mockItem.show).toHaveBeenCalled();
	});

	it('shows warning state', () => {
		const mockItem = (window.createStatusBarItem as any).mock.results[0].value;

		statusBar.showWarning('Test warning');

		expect(mockItem.text).toContain('Warning');
		expect(mockItem.tooltip).toContain('Test warning');
		expect(mockItem.color).toBeDefined();
		expect(mockItem.backgroundColor).toBeDefined();
		expect(mockItem.show).toHaveBeenCalled();
	});

	it('shows progress with message', () => {
		const mockProgressItem = (window.createStatusBarItem as any).mock.results[1]
			.value;

		statusBar.showProgress('Processing...');

		expect(mockProgressItem.text).toContain('Processing...');
		expect(mockProgressItem.color).toBeDefined();
		expect(mockProgressItem.backgroundColor).toBeDefined();
		expect(mockProgressItem.show).toHaveBeenCalled();
	});

	it('hides progress', () => {
		const mockProgressItem = (window.createStatusBarItem as any).mock.results[1]
			.value;

		statusBar.hideProgress();

		expect(mockProgressItem.hide).toHaveBeenCalled();
	});

	it('hides all items', () => {
		const mockMainItem = (window.createStatusBarItem as any).mock.results[0]
			.value;
		const mockProgressItem = (window.createStatusBarItem as any).mock.results[1]
			.value;

		statusBar.hide();

		expect(mockMainItem.hide).toHaveBeenCalled();
		expect(mockProgressItem.hide).toHaveBeenCalled();
	});

	it('disposes all items', () => {
		const mockMainItem = (window.createStatusBarItem as any).mock.results[0]
			.value;
		const mockProgressItem = (window.createStatusBarItem as any).mock.results[1]
			.value;

		statusBar.dispose();

		expect(mockMainItem.dispose).toHaveBeenCalled();
		expect(mockProgressItem.dispose).toHaveBeenCalled();
	});

	it('sets command on main item', () => {
		const mockItem = (window.createStatusBarItem as any).mock.results[0].value;

		expect(mockItem.command).toBe('urls-le.extractUrls');
	});

	it('handles disabled status bar gracefully', () => {
		vi.clearAllMocks();

		(workspace.getConfiguration as any).mockReturnValue({
			get: (key: string, defaultValue: any) => {
				if (key === 'statusBarEnabled') return false;
				return defaultValue;
			},
		});

		const disabledStatusBar = createStatusBar(mockExtensionContext as any);

		// Should not throw errors when calling methods
		expect(() => {
			disabledStatusBar.showIdle();
			disabledStatusBar.showExtracting();
			disabledStatusBar.showSuccess(1);
			disabledStatusBar.showError('error');
			disabledStatusBar.showWarning('warning');
			disabledStatusBar.showProgress('progress');
			disabledStatusBar.hideProgress();
			disabledStatusBar.hide();
			disabledStatusBar.dispose();
		}).not.toThrow();

		disabledStatusBar.dispose();
	});
});

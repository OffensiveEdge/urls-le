import * as vscode from 'vscode'
import { getConfiguration } from '../config/config'

export interface StatusBar {
	showProgress(message: string): void
	hideProgress(): void
	dispose(): void
}

export function createStatusBar(_context: vscode.ExtensionContext): StatusBar {
	const config = getConfiguration()
	let statusBarItem: vscode.StatusBarItem | undefined

	if (config.statusBarEnabled) {
		statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100)
		statusBarItem.text = 'URLs-LE'
		statusBarItem.tooltip = 'URLs-LE: URL extraction and validation'
		statusBarItem.command = 'urls-le.extractUrls'
		statusBarItem.show()
	}

	return Object.freeze({
		showProgress(message: string): void {
			if (statusBarItem) {
				statusBarItem.text = `$(loading~spin) ${message}`
			}
		},
		hideProgress(): void {
			if (statusBarItem) {
				statusBarItem.text = 'URLs-LE'
			}
		},
		dispose(): void {
			statusBarItem?.dispose()
		},
	})
}

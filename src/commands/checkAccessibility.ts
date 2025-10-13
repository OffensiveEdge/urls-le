import * as vscode from 'vscode';
import { getConfiguration } from '../config/config';
import type { Telemetry } from '../telemetry/telemetry';
import type { AccessibilityResult } from '../types';
import type { Notifier } from '../ui/notifier';
import type { StatusBar } from '../ui/statusBar';
import { checkUrlAccessibility } from '../utils/accessibility';

export function registerCheckAccessibilityCommand(
	context: vscode.ExtensionContext,
	deps: Readonly<{
		telemetry: Telemetry;
		notifier: Notifier;
		statusBar: StatusBar;
	}>,
): void {
	const command = vscode.commands.registerCommand(
		'urls-le.postProcess.checkAccessibility',
		async () => {
			deps.telemetry.event('command-check-accessibility');

			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				deps.notifier.showWarning('No active editor found');
				return;
			}

			try {
				deps.statusBar.showProgress('Checking URL accessibility...');

				const document = editor.document;
				const text = document.getText();
				const lines = text
					.split('\n')
					.filter((line) => line.trim().length > 0)
					.map((line) => line.trim());
				const config = getConfiguration();

				// Check if this looks like a URLs file (simple heuristic)
				const isUrlFile =
					lines.length > 0 &&
					lines.every((line) => {
						const trimmed = line.trim();
						return trimmed === '' || /^https?:\/\//.test(trimmed);
					});

				let urlsToCheck: string[];
				if (isUrlFile) {
					// Use lines directly as URLs
					urlsToCheck = lines;
				} else {
					// Extract URLs from source file first
					// For simplicity, filter lines that look like URLs
					urlsToCheck = lines.filter((line) => /^https?:\/\//.test(line));
				}

				// Check accessibility
				const accessibilityResults = await checkUrlAccessibility(urlsToCheck);

				// Generate accessibility report
				const report = generateAccessibilityReport(accessibilityResults);

				// Check config for in-place vs new file
				if (config.postProcessOpenInNewFile) {
					// Open accessibility report in new document
					const doc = await vscode.workspace.openTextDocument({
						content: report,
						language: 'markdown',
					});
					const viewColumn = config.openResultsSideBySide
						? vscode.ViewColumn.Beside
						: undefined;
					await vscode.window.showTextDocument(doc, viewColumn);
				} else {
					// Replace content in current editor
					const success = await editor.edit((editBuilder) => {
						const fullRange = new vscode.Range(
							editor.document.positionAt(0),
							editor.document.positionAt(editor.document.getText().length),
						);
						editBuilder.replace(fullRange, report);
					});

					if (!success) {
						deps.notifier.showError('Failed to update editor content');
						return;
					}
				}

				const accessibleCount = accessibilityResults.filter(
					(r) => r.accessible,
				).length;
				const inaccessibleCount = accessibilityResults.length - accessibleCount;

				deps.notifier.showInfo(
					`Accessibility check complete: ${accessibleCount} accessible, ${inaccessibleCount} inaccessible`,
				);
				deps.telemetry.event('accessibility-check-success', {
					accessible: accessibleCount,
					inaccessible: inaccessibleCount,
				});
			} catch (error) {
				const message =
					error instanceof Error ? error.message : 'Unknown error occurred';
				deps.notifier.showError(`Accessibility check failed: ${message}`);
				deps.telemetry.event('accessibility-check-error', { error: message });
			} finally {
				deps.statusBar.hideProgress();
			}
		},
	);

	context.subscriptions.push(command);
}

function generateAccessibilityReport(results: AccessibilityResult[]): string {
	const lines: string[] = [];

	lines.push('# URL Accessibility Report');
	lines.push('');

	const accessibleCount = results.filter((r) => r.accessible).length;
	const inaccessibleCount = results.filter((r) => !r.accessible).length;

	lines.push(`**Total URLs:** ${results.length}`);
	lines.push(`**Accessible:** ${accessibleCount}`);
	lines.push(`**Inaccessible:** ${inaccessibleCount}`);
	lines.push('');

	if (inaccessibleCount > 0) {
		lines.push('## Inaccessible URLs');
		results
			.filter((r) => !r.accessible)
			.forEach((result) => {
				lines.push(
					`- ${result.url}: ${result.issue || 'Accessibility issue detected'}`,
				);
			});
		lines.push('');
	}

	return lines.join('\n');
}

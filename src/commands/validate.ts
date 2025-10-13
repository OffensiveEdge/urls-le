import * as vscode from 'vscode';
import { getConfiguration } from '../config/config';
import type { Telemetry } from '../telemetry/telemetry';
import type { Notifier } from '../ui/notifier';
import type { StatusBar } from '../ui/statusBar';
import { validateUrls } from '../utils/validation';

export function registerValidateCommand(
	context: vscode.ExtensionContext,
	deps: Readonly<{
		telemetry: Telemetry;
		notifier: Notifier;
		statusBar: StatusBar;
	}>,
): void {
	const command = vscode.commands.registerCommand(
		'urls-le.postProcess.validate',
		async () => {
			deps.telemetry.event('command-validate-urls');

			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				deps.notifier.showWarning('No active editor found');
				return;
			}

			try {
				deps.statusBar.showProgress('Validating URLs...');

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

				let urlsToValidate: string[];
				if (isUrlFile) {
					// Use lines directly as URLs
					urlsToValidate = lines;
				} else {
					// Extract URLs from source file first
					// For simplicity, filter lines that look like URLs
					urlsToValidate = lines.filter((line) => /^https?:\/\//.test(line));
				}

				// Validate URLs
				const validationResults = await validateUrls(urlsToValidate, config);

				// Generate validation report
				const report = generateValidationReport(validationResults);

				// Check config for in-place vs new file
				if (config.postProcessOpenInNewFile) {
					// Open validation report in new document
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

				const validCount = validationResults.filter(
					(r) => r.status === 'valid',
				).length;
				const invalidCount = validationResults.length - validCount;

				deps.notifier.showInfo(
					`Validation complete: ${validCount} valid, ${invalidCount} invalid`,
				);
				deps.telemetry.event('validate-success', {
					valid: validCount,
					invalid: invalidCount,
				});
			} catch (error) {
				const message =
					error instanceof Error ? error.message : 'Unknown error occurred';
				deps.notifier.showError(`Validation failed: ${message}`);
				deps.telemetry.event('validate-error', { error: message });
			} finally {
				deps.statusBar.hideProgress();
			}
		},
	);

	context.subscriptions.push(command);
}

function generateValidationReport(results: Record<string, unknown>[]): string {
	const lines: string[] = [];

	lines.push('# URL Validation Report');
	lines.push('');

	const validCount = results.filter((r) => r.status === 'valid').length;
	const invalidCount = results.filter((r) => r.status === 'invalid').length;
	const timeoutCount = results.filter((r) => r.status === 'timeout').length;
	const errorCount = results.filter((r) => r.status === 'error').length;

	lines.push(`**Total URLs:** ${results.length}`);
	lines.push(`**Valid:** ${validCount}`);
	lines.push(`**Invalid:** ${invalidCount}`);
	lines.push(`**Timeout:** ${timeoutCount}`);
	lines.push(`**Error:** ${errorCount}`);
	lines.push('');

	if (invalidCount > 0) {
		lines.push('## Invalid URLs');
		results
			.filter((r) => r.status === 'invalid')
			.forEach((result) => {
				lines.push(`- ${result.url}: ${result.error || 'Invalid URL'}`);
			});
		lines.push('');
	}

	if (timeoutCount > 0) {
		lines.push('## Timeout URLs');
		results
			.filter((r) => r.status === 'timeout')
			.forEach((result) => {
				lines.push(`- ${result.url}`);
			});
		lines.push('');
	}

	return lines.join('\n');
}

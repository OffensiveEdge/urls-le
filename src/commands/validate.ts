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
				const lines = text.split('\n');
				const config = getConfiguration();

				// Extract URLs from lines
				const urls = lines.filter((line) => line.trim().length > 0);

				// Validate URLs
				const validationResults = await validateUrls(urls, config);

				// Generate validation report
				const report = generateValidationReport(validationResults);

				// Open validation report in new document
				const doc = await vscode.workspace.openTextDocument({
					content: report,
					language: 'markdown',
				});
				await vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);

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

function generateValidationReport(results: any[]): string {
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

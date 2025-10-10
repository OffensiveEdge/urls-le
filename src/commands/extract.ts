import * as vscode from 'vscode';
import { getConfiguration } from '../config/config';
import { extractUrls } from '../extraction/extract';
import type { Telemetry } from '../telemetry/telemetry';
import type { Notifier } from '../ui/notifier';
import type { StatusBar } from '../ui/statusBar';
import { handleSafetyChecks } from '../utils/safety';

export function registerExtractCommand(
	context: vscode.ExtensionContext,
	deps: Readonly<{
		telemetry: Telemetry;
		notifier: Notifier;
		statusBar: StatusBar;
	}>,
): void {
	const command = vscode.commands.registerCommand(
		'urls-le.extractUrls',
		async () => {
			deps.telemetry.event('command-extract-urls');

			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				deps.notifier.showWarning('No active editor found');
				return;
			}

			const document = editor.document;
			const config = getConfiguration();

			// Safety checks
			const safetyResult = handleSafetyChecks(document, config);
			if (!safetyResult.proceed) {
				deps.notifier.showWarning(safetyResult.message);
				return;
			}

			try {
				deps.statusBar.showProgress('Extracting URLs...');

				const result = await extractUrls(
					document.getText(),
					document.languageId,
				);

				if (!result.success) {
					deps.notifier.showError(
						`Failed to extract URLs: ${result.errors[0]?.message || 'Unknown error'}`,
					);
					return;
				}

				if (result.urls.length === 0) {
					deps.notifier.showInfo('No URLs found in the current document');
					return;
				}

				// Format URLs
				const formattedUrls = result.urls.map((url) => url.value);

				// Open results
				if (config.openResultsSideBySide) {
					const doc = await vscode.workspace.openTextDocument({
						content: formattedUrls.join('\n'),
						language: 'plaintext',
					});
					await vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
				} else if (config.postProcessOpenInNewFile) {
					const doc = await vscode.workspace.openTextDocument({
						content: formattedUrls.join('\n'),
						language: 'plaintext',
					});
					await vscode.window.showTextDocument(doc);
				} else {
					// Replace current selection or entire document
					const edit = new vscode.WorkspaceEdit();
					edit.replace(
						document.uri,
						new vscode.Range(0, 0, document.lineCount, 0),
						formattedUrls.join('\n'),
					);
					await vscode.workspace.applyEdit(edit);
				}

				// Copy to clipboard if enabled
				if (config.copyToClipboardEnabled) {
					await vscode.env.clipboard.writeText(formattedUrls.join('\n'));
					deps.notifier.showInfo(
						`Extracted ${result.urls.length} URLs and copied to clipboard`,
					);
				} else {
					deps.notifier.showInfo(`Extracted ${result.urls.length} URLs`);
				}

				deps.telemetry.event('extract-success', { count: result.urls.length });
			} catch (error) {
				const message =
					error instanceof Error ? error.message : 'Unknown error occurred';
				deps.notifier.showError(`Extraction failed: ${message}`);
				deps.telemetry.event('extract-error', { error: message });
			} finally {
				deps.statusBar.hideProgress();
			}
		},
	);

	context.subscriptions.push(command);
}

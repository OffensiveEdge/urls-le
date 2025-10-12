import * as vscode from 'vscode';
import { getConfiguration } from '../config/config';
import type { Telemetry } from '../telemetry/telemetry';
import type { AnalysisResult } from '../types';
import type { Notifier } from '../ui/notifier';
import type { StatusBar } from '../ui/statusBar';
import { analyzeUrls } from '../utils/analysis';

export function registerAnalyzeCommand(
	context: vscode.ExtensionContext,
	deps: Readonly<{
		telemetry: Telemetry;
		notifier: Notifier;
		statusBar: StatusBar;
	}>,
): void {
	const command = vscode.commands.registerCommand(
		'urls-le.postProcess.analyze',
		async () => {
			deps.telemetry.event('command-analyze-urls');

			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				deps.notifier.showWarning('No active editor found');
				return;
			}

			try {
				deps.statusBar.showProgress('Analyzing URLs...');

				const document = editor.document;
				const text = document.getText();
				const lines = text.split('\n');
				const config = getConfiguration();

				// Analyze URLs
				const analysis = analyzeUrls(lines, config);

				// Generate analysis report
				const report = generateAnalysisReport(analysis);

				// Open analysis in new document
				const doc = await vscode.workspace.openTextDocument({
					content: report,
					language: 'markdown',
				});
				await vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);

				deps.notifier.showInfo(
					`Analysis complete: ${analysis.count} URLs analyzed`,
				);
				deps.telemetry.event('analyze-success', { count: analysis.count });
			} catch (error) {
				const message =
					error instanceof Error ? error.message : 'Unknown error occurred';
				deps.notifier.showError(`Analysis failed: ${message}`);
				deps.telemetry.event('analyze-error', { error: message });
			} finally {
				deps.statusBar.hideProgress();
			}
		},
	);

	context.subscriptions.push(command);
}

function generateAnalysisReport(analysis: AnalysisResult): string {
	const lines: string[] = [];

	lines.push('# URL Analysis Report');
	lines.push('');
	lines.push(`**Total URLs:** ${analysis.count}`);
	lines.push(`**Unique URLs:** ${analysis.unique}`);
	lines.push(`**Duplicates:** ${analysis.duplicates}`);
	lines.push('');

	if (analysis.protocols) {
		lines.push('## URL Protocols');
		Object.entries(analysis.protocols).forEach(([protocol, count]) => {
			lines.push(`- ${protocol}: ${count}`);
		});
		lines.push('');
	}

	if (analysis.security) {
		lines.push('## Security Analysis');
		lines.push(`- Secure: ${analysis.security.secure}`);
		lines.push(`- Insecure: ${analysis.security.insecure}`);
		lines.push(`- Suspicious: ${analysis.security.suspicious}`);
		lines.push('');
	}

	if (analysis.domains) {
		lines.push('## Domain Analysis');
		lines.push(`- Unique Domains: ${analysis.domains.uniqueDomains}`);
		lines.push('');
	}

	// Handle legacy properties for compatibility
	if (
		analysis.secure !== undefined ||
		analysis.insecure !== undefined ||
		analysis.suspicious !== undefined
	) {
		lines.push('## Security Summary');
		if (analysis.secure !== undefined)
			lines.push(`- Secure: ${analysis.secure}`);
		if (analysis.insecure !== undefined)
			lines.push(`- Insecure: ${analysis.insecure}`);
		if (analysis.suspicious !== undefined)
			lines.push(`- Suspicious: ${analysis.suspicious}`);
		lines.push('');
	}

	if (analysis.uniqueDomains !== undefined) {
		lines.push('## Domain Summary');
		lines.push(`- Unique Domains: ${analysis.uniqueDomains}`);
		lines.push('');
	}

	return lines.join('\n');
}

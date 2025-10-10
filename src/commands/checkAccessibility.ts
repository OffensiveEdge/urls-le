import * as vscode from 'vscode'
import type { Telemetry } from '../telemetry/telemetry'
import type { Notifier } from '../ui/notifier'
import type { StatusBar } from '../ui/statusBar'
import { checkUrlAccessibility } from '../utils/accessibility'

export function registerCheckAccessibilityCommand(
	context: vscode.ExtensionContext,
	deps: Readonly<{
		telemetry: Telemetry
		notifier: Notifier
		statusBar: StatusBar
	}>,
): void {
	const command = vscode.commands.registerCommand('urls-le.postProcess.checkAccessibility', async () => {
		deps.telemetry.event('command-check-accessibility')

		const editor = vscode.window.activeTextEditor
		if (!editor) {
			deps.notifier.showWarning('No active editor found')
			return
		}

		try {
			deps.statusBar.showProgress('Checking URL accessibility...')

			const document = editor.document
			const text = document.getText()
			const lines = text.split('\n')

			// Extract URLs from lines
			const urls = lines.filter((line) => line.trim().length > 0)

			// Check accessibility
			const accessibilityResults = await checkUrlAccessibility(urls)

			// Generate accessibility report
			const report = generateAccessibilityReport(accessibilityResults)

			// Open accessibility report in new document
			const doc = await vscode.workspace.openTextDocument({
				content: report,
				language: 'markdown',
			})
			await vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside)

			const accessibleCount = accessibilityResults.filter((r) => r.accessible).length
			const inaccessibleCount = accessibilityResults.length - accessibleCount

			deps.notifier.showInfo(
				`Accessibility check complete: ${accessibleCount} accessible, ${inaccessibleCount} inaccessible`,
			)
			deps.telemetry.event('accessibility-check-success', {
				accessible: accessibleCount,
				inaccessible: inaccessibleCount,
			})
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Unknown error occurred'
			deps.notifier.showError(`Accessibility check failed: ${message}`)
			deps.telemetry.event('accessibility-check-error', { error: message })
		} finally {
			deps.statusBar.hideProgress()
		}
	})

	context.subscriptions.push(command)
}

function generateAccessibilityReport(results: Record<string, unknown>[]): string {
	const lines: string[] = []

	lines.push('# URL Accessibility Report')
	lines.push('')

	const accessibleCount = results.filter((r) => r.accessible).length
	const inaccessibleCount = results.filter((r) => !r.accessible).length

	lines.push(`**Total URLs:** ${results.length}`)
	lines.push(`**Accessible:** ${accessibleCount}`)
	lines.push(`**Inaccessible:** ${inaccessibleCount}`)
	lines.push('')

	if (inaccessibleCount > 0) {
		lines.push('## Inaccessible URLs')
		results
			.filter((r) => !r.accessible)
			.forEach((result) => {
				lines.push(`- ${result.url}: ${result.issue || 'Accessibility issue detected'}`)
			})
		lines.push('')
	}

	return lines.join('\n')
}

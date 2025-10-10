import * as vscode from 'vscode'
import type { Telemetry } from '../telemetry/telemetry'
import type { Notifier } from '../ui/notifier'
import type { StatusBar } from '../ui/statusBar'

export function registerHelpCommand(
	context: vscode.ExtensionContext,
	deps: Readonly<{
		telemetry: Telemetry
		notifier: Notifier
		statusBar: StatusBar
	}>,
): void {
	const command = vscode.commands.registerCommand('urls-le.help', async () => {
		deps.telemetry.event('command-help')

		const helpText = `
# URLs-LE Help & Troubleshooting

## Commands
- **Extract URLs** (Ctrl+Alt+U / Cmd+Alt+U): Extract URLs from the current document
- **Validate URLs**: Check if URLs are accessible and valid
- **Check URL Accessibility**: Analyze URLs for accessibility issues
- **Analyze URLs**: Generate a detailed analysis report
- **Open Settings**: Configure URLs-LE settings

## Supported Formats
- Markdown, HTML
- CSS, JavaScript, TypeScript
- JSON, YAML
- Documentation and configuration files

## URL Types Supported
- HTTP/HTTPS: https://example.com
- FTP: ftp://example.com
- File: file:///path/to/file
- Mailto: mailto:user@example.com
- Tel: tel:+1234567890
- Relative URLs: /path/to/page

## Features

### URL Extraction
- Detects URLs in various formats
- Supports relative and absolute URLs
- Handles URLs in comments and strings

### URL Validation
- Checks if URLs are accessible
- Follows redirects
- Reports HTTP status codes
- Identifies broken links

### Accessibility Analysis
- Checks for accessibility issues
- Identifies problematic URL patterns
- Reports accessibility violations

### Security Analysis
- Identifies insecure HTTP URLs
- Flags suspicious domains
- Reports security issues

## Troubleshooting

### No URLs found
- Ensure the file contains valid URL patterns
- Check that the file type is supported
- Verify URL format is recognized

### Validation failures
- Check internet connectivity
- Verify URL accessibility
- Consider firewall or proxy settings

### Performance issues
- Large files may take time to process
- Use safety settings to limit processing
- Consider breaking large files into smaller chunks

## Settings
Access settings via Command Palette: "URLs-LE: Open Settings"

Key settings:
- Validation timeout
- Follow redirects
- Security analysis
- Accessibility checks
- Safety thresholds

## Support
- GitHub Issues: https://github.com/nolindnaidoo/urls-le/issues
- Documentation: https://github.com/nolindnaidoo/urls-le#readme
		`.trim()

		const doc = await vscode.workspace.openTextDocument({
			content: helpText,
			language: 'markdown',
		})
		await vscode.window.showTextDocument(doc)
	})

	context.subscriptions.push(command)
}

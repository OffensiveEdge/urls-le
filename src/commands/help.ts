import * as vscode from 'vscode';
import type { Telemetry } from '../telemetry/telemetry';
import type { Notifier } from '../ui/notifier';
import type { StatusBar } from '../ui/statusBar';

export function registerHelpCommand(
	context: vscode.ExtensionContext,
	deps: Readonly<{
		telemetry: Telemetry;
		notifier: Notifier;
		statusBar: StatusBar;
	}>,
): void {
	const command = vscode.commands.registerCommand('urls-le.help', async () => {
		deps.telemetry.event('command-help');

		const helpText = `
# URLs-LE Help & Troubleshooting

## Commands
- **Extract URLs** (Ctrl+Alt+U / Cmd+Alt+U): Extract all URLs from the current document
- **Open Settings**: Configure URLs-LE settings
- **Help**: Open this help documentation

## Supported File Types
- Markdown - Links, reference URLs
- HTML - href attributes, src attributes
- JSON/JSONC - URL values
- YAML - URL values
- XML - URL attributes and values
- JavaScript/TypeScript - String literals with URLs
- CSS - url() functions, @import statements
- Plain text - Any URLs in text content

## URL Formats Supported
- HTTP/HTTPS: https://example.com
- FTP: ftp://files.example.com
- File: file:///path/to/file
- Data URLs: data:image/png;base64,...
- Mailto: mailto:user@example.com
- Tel: tel:+1234567890
- Relative URLs: /path/to/page, ./relative/path
- Absolute paths: /absolute/path/to/resource
- URLs with query parameters: https://example.com?key=value
- URLs with fragments: https://example.com#section
- URLs with authentication: https://user:pass@example.com

## Extraction Features
- Automatically detects all URL formats
- Preserves original URL structure
- Extracts from multiple file types
- Handles encoded URLs
- Supports internationalized domain names (IDN)

## Troubleshooting

### No URLs found
- Ensure the file contains valid URL patterns
- Check that the file type is supported
- Verify URL format is recognized
- Some obfuscated or encoded URLs may not be detected

### Performance issues
- Large files may take time to process
- Use safety settings to limit processing
- Consider breaking large files into smaller chunks

### Incorrect extraction
- Verify URL syntax is valid
- Check for proper protocol (http://, https://, etc.)
- Partial URLs may need protocol prefix

### Relative URLs
- Relative URLs are extracted as-is
- Context base URL is not automatically applied
- Use find/replace to add base URL if needed

## Settings
Access settings via Command Palette: "URLs-LE: Open Settings"

Key settings:
- **Copy to clipboard**: Auto-copy results (default: false)
- **Side-by-side view**: Open results beside source (default: false)
- **Safety checks**: File size warnings (default: 1MB threshold)
- **Notification levels**: silent, important, or all (default: silent)
- **Status bar**: Show/hide status bar item (default: true)
- **Telemetry**: Local logging only (default: false)

## Common Use Cases

### Extract All Links from Markdown
1. Open a Markdown file
2. Run "URLs-LE: Extract URLs"
3. All URLs from links and references are extracted

### Find URLs in Source Code
1. Open JavaScript/TypeScript file
2. Run extraction command
3. All string URLs are found (API endpoints, CDN links, etc.)

### Audit HTML Resources
1. Open HTML file
2. Extract URLs to find all external resources
3. Review for security or optimization

### Convert Relative to Absolute URLs
1. Extract all relative URLs
2. Use find/replace to add base domain
3. Update source file with absolute URLs

## Performance Tips
- Safety warnings help prevent processing very large files
- Adjust file size threshold for your use case
- Use clipboard mode for large outputs
- Process files in smaller chunks if needed

## Planned Features
- **Deduplicate URLs**: Remove duplicate URLs (coming soon)
- **Sort URLs**: Sort by domain, path, or protocol (coming soon)
- **URL validation**: Check if URLs are reachable (coming soon)
- **Format URLs**: Normalize URL formatting (coming soon)

## Support
- GitHub Issues: https://github.com/nolindnaidoo/urls-le/issues
- Documentation: https://github.com/nolindnaidoo/urls-le#readme
		`.trim();

		const doc = await vscode.workspace.openTextDocument({
			content: helpText,
			language: 'markdown',
		});
		await vscode.window.showTextDocument(doc);
	});

	context.subscriptions.push(command);
}

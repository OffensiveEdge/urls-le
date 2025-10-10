import type { Url, UrlProtocol } from '../../types'

// Regex patterns for different URL formats in JavaScript/TypeScript
const URL_PATTERN = /(https?:\/\/[^\s<>"{}|\\^`[\]]+)/g
const FTP_PATTERN = /(ftp:\/\/[^\s<>"{}|\\^`[\]]+)/g
const MAILTO_PATTERN = /(mailto:[^\s<>"{}|\\^`[\]]+)/g
const TEL_PATTERN = /(tel:[^\s<>"{}|\\^`[\]]+)/g
const FILE_PATTERN = /(file:\/\/[^\s<>"{}|\\^`[\]]+)/g

// String patterns for URL values in quotes
const STRING_URL_PATTERN = /['"`]([^'"`]*?)['"`]/g

export function extractFromJavaScript(content: string): Url[] {
	const urls: Url[] = []
	const lines = content.split('\n')

	lines.forEach((line, lineIndex) => {
		// Extract HTTP/HTTPS URLs
		let match
		while ((match = URL_PATTERN.exec(line)) !== null) {
			urls.push({
				value: match[0],
				protocol: 'https' as UrlProtocol,
				position: { line: lineIndex + 1, column: match.index + 1 },
				context: line.trim(),
			})
		}

		// Extract FTP URLs
		while ((match = FTP_PATTERN.exec(line)) !== null) {
			urls.push({
				value: match[0],
				protocol: 'ftp' as UrlProtocol,
				position: { line: lineIndex + 1, column: match.index + 1 },
				context: line.trim(),
			})
		}

		// Extract mailto URLs
		while ((match = MAILTO_PATTERN.exec(line)) !== null) {
			urls.push({
				value: match[0],
				protocol: 'mailto' as UrlProtocol,
				position: { line: lineIndex + 1, column: match.index + 1 },
				context: line.trim(),
			})
		}

		// Extract tel URLs
		while ((match = TEL_PATTERN.exec(line)) !== null) {
			urls.push({
				value: match[0],
				protocol: 'tel' as UrlProtocol,
				position: { line: lineIndex + 1, column: match.index + 1 },
				context: line.trim(),
			})
		}

		// Extract file URLs
		while ((match = FILE_PATTERN.exec(line)) !== null) {
			urls.push({
				value: match[0],
				protocol: 'file' as UrlProtocol,
				position: { line: lineIndex + 1, column: match.index + 1 },
				context: line.trim(),
			})
		}

		// Extract URLs from string literals
		while ((match = STRING_URL_PATTERN.exec(line)) !== null) {
			const stringValue = match[1]
			if (stringValue && isValidUrl(stringValue)) {
				urls.push({
					value: stringValue,
					protocol: detectUrlProtocol(stringValue),
					position: { line: lineIndex + 1, column: (match.index ?? 0) + 1 },
					context: line.trim(),
				})
			}
		}
	})

	return urls
}

function isValidUrl(value: string): boolean {
	// Check if the string looks like a URL
	return (
		/^https?:\/\//.test(value) ||
		/^ftp:\/\//.test(value) ||
		/^mailto:/.test(value) ||
		/^tel:/.test(value) ||
		/^file:\/\//.test(value)
	)
}

function detectUrlProtocol(value: string): UrlProtocol {
	if (value.startsWith('http://')) return 'http'
	if (value.startsWith('https://')) return 'https'
	if (value.startsWith('ftp://')) return 'ftp'
	if (value.startsWith('mailto:')) return 'mailto'
	if (value.startsWith('tel:')) return 'tel'
	if (value.startsWith('file://')) return 'file'
	return 'unknown'
}

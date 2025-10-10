import type { Url } from '../../types'
import { detectUrlProtocol, extractUrlComponents, isValidUrl } from '../../utils/urlValidation'

// Regex patterns for different URL formats in HTML
const URL_PATTERN = /(https?:\/\/[^\s<>"{}|\\^`[\]]+)/g
const FTP_PATTERN = /(ftp:\/\/[^\s<>"{}|\\^`[\]]+)/g
const MAILTO_PATTERN = /(mailto:[^\s<>"{}|\\^`[\]]+)/g
const TEL_PATTERN = /(tel:[^\s<>"{}|\\^`[\]]+)/g
const FILE_PATTERN = /(file:\/\/[^\s<>"{}|\\^`[\]]+)/g

// HTML attribute patterns
const HREF_PATTERN = /href\s*=\s*["']([^"']+)["']/gi
const SRC_PATTERN = /src\s*=\s*["']([^"']+)["']/gi
const ACTION_PATTERN = /action\s*=\s*["']([^"']+)["']/gi

export function extractFromHtml(content: string): Url[] {
	const urls: Url[] = []
	const lines = content.split('\n')

	lines.forEach((line, lineIndex) => {
		try {
			// Extract HTTP/HTTPS URLs - reset regex lastIndex to prevent race conditions
			URL_PATTERN.lastIndex = 0
			let match
			while ((match = URL_PATTERN.exec(line)) !== null) {
				const urlValue = match[0]
				const components = extractUrlComponents(urlValue)
				urls.push({
					value: urlValue,
					protocol: detectUrlProtocol(urlValue),
					domain: components?.domain,
					path: components?.path,
					position: { line: lineIndex + 1, column: (match.index ?? 0) + 1 },
					context: line.trim(),
				})
			}

			// Extract FTP URLs - reset regex lastIndex
			FTP_PATTERN.lastIndex = 0
			while ((match = FTP_PATTERN.exec(line)) !== null) {
				const urlValue = match[0]
				const components = extractUrlComponents(urlValue)
				urls.push({
					value: urlValue,
					protocol: detectUrlProtocol(urlValue),
					domain: components?.domain,
					path: components?.path,
					position: { line: lineIndex + 1, column: (match.index ?? 0) + 1 },
					context: line.trim(),
				})
			}

			// Extract mailto URLs - reset regex lastIndex
			MAILTO_PATTERN.lastIndex = 0
			while ((match = MAILTO_PATTERN.exec(line)) !== null) {
				const urlValue = match[0]
				urls.push({
					value: urlValue,
					protocol: detectUrlProtocol(urlValue),
					position: { line: lineIndex + 1, column: (match.index ?? 0) + 1 },
					context: line.trim(),
				})
			}

			// Extract tel URLs - reset regex lastIndex
			TEL_PATTERN.lastIndex = 0
			while ((match = TEL_PATTERN.exec(line)) !== null) {
				const urlValue = match[0]
				urls.push({
					value: urlValue,
					protocol: detectUrlProtocol(urlValue),
					position: { line: lineIndex + 1, column: (match.index ?? 0) + 1 },
					context: line.trim(),
				})
			}

			// Extract file URLs - reset regex lastIndex
			FILE_PATTERN.lastIndex = 0
			while ((match = FILE_PATTERN.exec(line)) !== null) {
				const urlValue = match[0]
				urls.push({
					value: urlValue,
					protocol: detectUrlProtocol(urlValue),
					position: { line: lineIndex + 1, column: (match.index ?? 0) + 1 },
					context: line.trim(),
				})
			}

			// Extract URLs from href attributes - reset regex lastIndex
			HREF_PATTERN.lastIndex = 0
			while ((match = HREF_PATTERN.exec(line)) !== null) {
				const url = match[1]
				if (url && isValidUrl(url)) {
					const components = extractUrlComponents(url)
					urls.push({
						value: url,
						protocol: detectUrlProtocol(url),
						domain: components?.domain,
						path: components?.path,
						position: { line: lineIndex + 1, column: (match.index ?? 0) + 1 },
						context: line.trim(),
					})
				}
			}

			// Extract URLs from src attributes - reset regex lastIndex
			SRC_PATTERN.lastIndex = 0
			while ((match = SRC_PATTERN.exec(line)) !== null) {
				const url = match[1]
				if (url && isValidUrl(url)) {
					const components = extractUrlComponents(url)
					urls.push({
						value: url,
						protocol: detectUrlProtocol(url),
						domain: components?.domain,
						path: components?.path,
						position: { line: lineIndex + 1, column: (match.index ?? 0) + 1 },
						context: line.trim(),
					})
				}
			}

			// Extract URLs from action attributes - reset regex lastIndex
			ACTION_PATTERN.lastIndex = 0
			while ((match = ACTION_PATTERN.exec(line)) !== null) {
				const url = match[1]
				if (url && isValidUrl(url)) {
					const components = extractUrlComponents(url)
					urls.push({
						value: url,
						protocol: detectUrlProtocol(url),
						domain: components?.domain,
						path: components?.path,
						position: { line: lineIndex + 1, column: (match.index ?? 0) + 1 },
						context: line.trim(),
					})
				}
			}
		} catch (error) {
			// Skip lines that cause regex errors to prevent crashes
			console.warn(`[URLs-LE] Regex error on line ${lineIndex + 1}:`, error)
		}
	})

	return urls
}

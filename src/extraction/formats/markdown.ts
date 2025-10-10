import type { Url } from '../../types'
import { detectUrlProtocol, extractUrlComponents, isValidUrl } from '../../utils/urlValidation'

// Regex patterns for different URL formats in Markdown
const URL_PATTERN = /(https?:\/\/[^\s<>"{}|\\^`[\];)']+)/g
const FTP_PATTERN = /(ftp:\/\/[^\s<>"{}|\\^`[\];)']+)/g
const MAILTO_PATTERN = /(mailto:[^\s<>"{}|\\^`[\];)']+)/g
const TEL_PATTERN = /(tel:[^\s<>"{}|\\^`[\];)']+)/g
const FILE_PATTERN = /(file:\/\/[^\s<>"{}|\\^`[\];)']+)/g

// Markdown link patterns
const MARKDOWN_LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g
const MARKDOWN_AUTOLINK_PATTERN = /<([^>]+)>/g

export function extractFromMarkdown(content: string): Url[] {
	const urls: Url[] = []
	const seenUrls = new Set<string>()
	const lines = content.split('\n')

	lines.forEach((line, lineIndex) => {
		try {
			// Extract URLs from markdown links first (highest priority)
			MARKDOWN_LINK_PATTERN.lastIndex = 0
			let match
			while ((match = MARKDOWN_LINK_PATTERN.exec(line)) !== null) {
				const url = match[2]
				if (url && !seenUrls.has(url)) {
					// Check if it's a valid absolute URL or a relative path
					if (isValidUrl(url) || url.startsWith('/')) {
						seenUrls.add(url)
						const components = extractUrlComponents(url)
						urls.push({
							value: url,
							protocol: url.startsWith('/') ? ('unknown' as const) : detectUrlProtocol(url),
							domain: components?.domain,
							path: components?.path,
							position: {
								line: lineIndex + 1,
								column: (match.index ?? 0) + match[0].indexOf(match[2] ?? '') + 1,
							},
							context: line.trim(),
						})
					}
				}
			}

			// Extract URLs from markdown autolinks
			MARKDOWN_AUTOLINK_PATTERN.lastIndex = 0
			while ((match = MARKDOWN_AUTOLINK_PATTERN.exec(line)) !== null) {
				const url = match[1]
				if (url && isValidUrl(url) && !seenUrls.has(url)) {
					seenUrls.add(url)
					const components = extractUrlComponents(url)
					urls.push({
						value: url,
						protocol: detectUrlProtocol(url),
						domain: components?.domain,
						path: components?.path,
						position: {
							line: lineIndex + 1,
							column: (match.index ?? 0) + match[0].indexOf(match[1] ?? '') + 1,
						},
						context: line.trim(),
					})
				}
			}

			// Extract HTTP/HTTPS URLs from plain text
			URL_PATTERN.lastIndex = 0
			while ((match = URL_PATTERN.exec(line)) !== null) {
				const urlValue = match[1]
				if (urlValue && isValidUrl(urlValue) && !seenUrls.has(urlValue)) {
					seenUrls.add(urlValue)
					const components = extractUrlComponents(urlValue)
					urls.push({
						value: urlValue,
						protocol: detectUrlProtocol(urlValue),
						domain: components?.domain,
						path: components?.path,
						position: {
							line: lineIndex + 1,
							column: (match.index ?? 0) + match[0].indexOf(match[2] ?? '') + 1,
						},
						context: line.trim(),
					})
				}
			}

			// Extract FTP URLs
			FTP_PATTERN.lastIndex = 0
			while ((match = FTP_PATTERN.exec(line)) !== null) {
				const urlValue = match[1]
				if (urlValue && isValidUrl(urlValue) && !seenUrls.has(urlValue)) {
					seenUrls.add(urlValue)
					const components = extractUrlComponents(urlValue)
					urls.push({
						value: urlValue,
						protocol: detectUrlProtocol(urlValue),
						domain: components?.domain,
						path: components?.path,
						position: {
							line: lineIndex + 1,
							column: (match.index ?? 0) + match[0].indexOf(match[2] ?? '') + 1,
						},
						context: line.trim(),
					})
				}
			}

			// Extract mailto URLs
			MAILTO_PATTERN.lastIndex = 0
			while ((match = MAILTO_PATTERN.exec(line)) !== null) {
				const urlValue = match[0]
				if (!seenUrls.has(urlValue)) {
					seenUrls.add(urlValue)
					urls.push({
						value: urlValue,
						protocol: detectUrlProtocol(urlValue),
						position: {
							line: lineIndex + 1,
							column: (match.index ?? 0) + match[0].indexOf(match[2] ?? '') + 1,
						},
						context: line.trim(),
					})
				}
			}

			// Extract tel URLs
			TEL_PATTERN.lastIndex = 0
			while ((match = TEL_PATTERN.exec(line)) !== null) {
				const urlValue = match[0]
				if (!seenUrls.has(urlValue)) {
					seenUrls.add(urlValue)
					urls.push({
						value: urlValue,
						protocol: detectUrlProtocol(urlValue),
						position: {
							line: lineIndex + 1,
							column: (match.index ?? 0) + match[0].indexOf(match[2] ?? '') + 1,
						},
						context: line.trim(),
					})
				}
			}

			// Extract file URLs
			FILE_PATTERN.lastIndex = 0
			while ((match = FILE_PATTERN.exec(line)) !== null) {
				const urlValue = match[0]
				if (!seenUrls.has(urlValue)) {
					seenUrls.add(urlValue)
					urls.push({
						value: urlValue,
						protocol: detectUrlProtocol(urlValue),
						position: {
							line: lineIndex + 1,
							column: (match.index ?? 0) + match[0].indexOf(match[2] ?? '') + 1,
						},
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

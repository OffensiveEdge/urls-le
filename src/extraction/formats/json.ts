import type { Url, UrlProtocol } from '../../types';

// Regex patterns for different URL formats in JSON
const URL_PATTERN = /(https?:\/\/[^\s<>"{}|\\^`[\]]+)/g;
const FTP_PATTERN = /(ftp:\/\/[^\s<>"{}|\\^`[\]]+)/g;
const MAILTO_PATTERN = /(mailto:[^\s<>"{}|\\^`[\]]+)/g;
const TEL_PATTERN = /(tel:[^\s<>"{}|\\^`[\]]+)/g;
const FILE_PATTERN = /(file:\/\/[^\s<>"{}|\\^`[\]]+)/g;

export function extractFromJson(content: string): Url[] {
	const urls: Url[] = [];
	const lines = content.split('\n');

	lines.forEach((line, lineIndex) => {
		// Extract HTTP/HTTPS URLs
		let match;
		while ((match = URL_PATTERN.exec(line)) !== null) {
			urls.push({
				value: match[0],
				protocol: 'https' as UrlProtocol,
				position: { line: lineIndex + 1, column: match.index + 1 },
				context: line.trim(),
			});
		}

		// Extract FTP URLs
		while ((match = FTP_PATTERN.exec(line)) !== null) {
			urls.push({
				value: match[0],
				protocol: 'ftp' as UrlProtocol,
				position: { line: lineIndex + 1, column: match.index + 1 },
				context: line.trim(),
			});
		}

		// Extract mailto URLs
		while ((match = MAILTO_PATTERN.exec(line)) !== null) {
			urls.push({
				value: match[0],
				protocol: 'mailto' as UrlProtocol,
				position: { line: lineIndex + 1, column: match.index + 1 },
				context: line.trim(),
			});
		}

		// Extract tel URLs
		while ((match = TEL_PATTERN.exec(line)) !== null) {
			urls.push({
				value: match[0],
				protocol: 'tel' as UrlProtocol,
				position: { line: lineIndex + 1, column: match.index + 1 },
				context: line.trim(),
			});
		}

		// Extract file URLs
		while ((match = FILE_PATTERN.exec(line)) !== null) {
			urls.push({
				value: match[0],
				protocol: 'file' as UrlProtocol,
				position: { line: lineIndex + 1, column: match.index + 1 },
				context: line.trim(),
			});
		}
	});

	return urls;
}

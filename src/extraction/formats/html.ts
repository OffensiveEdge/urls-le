import type { Url } from '../../types';
import {
	detectUrlProtocol,
	extractUrlComponents,
	isValidUrl,
} from '../../utils/urlValidation';

const URL_PATTERN = /(https?:\/\/[^\s<>"{}|\\^`[\];)']+)/g;
const FTP_PATTERN = /(ftp:\/\/[^\s<>"{}|\\^`[\];)']+)/g;
const MAILTO_PATTERN = /(mailto:[^\s<>"{}|\\^`[\];)']+)/g;
const TEL_PATTERN = /(tel:[^\s<>"{}|\\^`[\];)']+)/g;
const FILE_PATTERN = /(file:\/\/[^\s<>"{}|\\^`[\];)']+)/g;

const HREF_PATTERN = /href\s*=\s*["']([^"']+)["']/gi;
const SRC_PATTERN = /src\s*=\s*["']([^"']+)["']/gi;
const ACTION_PATTERN = /action\s*=\s*["']([^"']+)["']/gi;

interface PatternConfig {
	readonly pattern: RegExp;
	readonly requiresValidation: boolean;
}

const ATTRIBUTE_PATTERNS: readonly PatternConfig[] = Object.freeze([
	{ pattern: HREF_PATTERN, requiresValidation: true },
	{ pattern: SRC_PATTERN, requiresValidation: true },
	{ pattern: ACTION_PATTERN, requiresValidation: true },
]);

const PLAIN_URL_PATTERNS: readonly RegExp[] = Object.freeze([
	URL_PATTERN,
	FTP_PATTERN,
	MAILTO_PATTERN,
	TEL_PATTERN,
	FILE_PATTERN,
]);

export function extractFromHtml(content: string): Url[] {
	const lines = content.split('\n');
	const urls: Url[] = [];
	const extractedPositions = new Set<string>();

	lines.forEach((line, lineIndex) => {
		extractUrlsFromLine(line, lineIndex, urls, extractedPositions);
	});

	return urls;
}

function extractUrlsFromLine(
	line: string,
	lineIndex: number,
	urls: Url[],
	extractedPositions: Set<string>,
): void {
	try {
		// Extract from HTML attributes first (higher priority)
		extractFromAttributes(line, lineIndex, urls, extractedPositions);
		// Extract plain URLs (lower priority)
		extractPlainUrls(line, lineIndex, urls, extractedPositions);
	} catch (error) {
		logExtractionError(lineIndex, error);
	}
}

function extractFromAttributes(
	line: string,
	lineIndex: number,
	urls: Url[],
	extractedPositions: Set<string>,
): void {
	for (const config of ATTRIBUTE_PATTERNS) {
		extractByAttributePattern(
			config.pattern,
			config.requiresValidation,
			line,
			lineIndex,
			urls,
			extractedPositions,
		);
	}
}

function extractByAttributePattern(
	pattern: RegExp,
	requiresValidation: boolean,
	line: string,
	lineIndex: number,
	urls: Url[],
	extractedPositions: Set<string>,
): void {
	pattern.lastIndex = 0;
	let match: RegExpExecArray | null;

	while ((match = pattern.exec(line)) !== null) {
		const url = match[1];
		if (!url) {
			continue;
		}

		const matchIndex = match.index ?? 0;

		// Skip if in comment
		if (isInComment(line, matchIndex)) {
			continue;
		}

		// Validate if required
		if (requiresValidation && !isValidUrl(url)) {
			continue;
		}

		addUrlIfNew(url, line, lineIndex, matchIndex, urls, extractedPositions);
	}
}

function extractPlainUrls(
	line: string,
	lineIndex: number,
	urls: Url[],
	extractedPositions: Set<string>,
): void {
	for (const pattern of PLAIN_URL_PATTERNS) {
		extractByPlainPattern(pattern, line, lineIndex, urls, extractedPositions);
	}
}

function extractByPlainPattern(
	pattern: RegExp,
	line: string,
	lineIndex: number,
	urls: Url[],
	extractedPositions: Set<string>,
): void {
	pattern.lastIndex = 0;
	let match: RegExpExecArray | null;

	while ((match = pattern.exec(line)) !== null) {
		const url = match[0];
		if (!url) {
			continue;
		}

		const matchIndex = match.index ?? 0;

		// Skip if in comment
		if (isInComment(line, matchIndex)) {
			continue;
		}

		addUrlIfNew(url, line, lineIndex, matchIndex, urls, extractedPositions);
	}
}

function isInComment(line: string, index: number): boolean {
	const before = line.substring(0, index);
	const commentStart = before.lastIndexOf('<!--');
	const commentEnd = before.lastIndexOf('-->');
	return commentStart > commentEnd;
}

function addUrlIfNew(
	url: string,
	line: string,
	lineIndex: number,
	columnIndex: number,
	urls: Url[],
	extractedPositions: Set<string>,
): void {
	const posKey = url;
	if (extractedPositions.has(posKey)) {
		return;
	}

	extractedPositions.add(posKey);
	urls.push(createUrl(url, line, lineIndex, columnIndex));
}

function createUrl(
	url: string,
	line: string,
	lineIndex: number,
	columnIndex: number,
): Url {
	const components = extractUrlComponents(url);

	const baseUrl = {
		value: url,
		protocol: detectUrlProtocol(url),
		position: Object.freeze({
			line: lineIndex + 1,
			column: columnIndex + 1,
		}),
		context: line.trim(),
	};

	return Object.freeze({
		...baseUrl,
		...(components?.domain && { domain: components.domain }),
		...(components?.path && { path: components.path }),
	});
}

function logExtractionError(lineIndex: number, error: unknown): void {
	console.warn(`[URLs-LE] Regex error on line ${lineIndex + 1}:`, error);
}

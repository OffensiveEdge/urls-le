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
const MARKDOWN_LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;
const MARKDOWN_AUTOLINK_PATTERN = /<([^>]+)>/g;
const CODE_BLOCK_MARKER = '```';

interface ExtractionContext {
	readonly line: string;
	readonly lineIndex: number;
	readonly inCodeBlock: boolean;
}

export function extractFromMarkdown(content: string): Url[] {
	const lines = content.split('\n');
	const urls: Url[] = [];
	const extractedPositions = new Set<string>();
	let inCodeBlock = false;

	lines.forEach((line, lineIndex) => {
		inCodeBlock = updateCodeBlockState(line, inCodeBlock);

		// Skip code blocks
		if (inCodeBlock) {
			return;
		}

		const context: ExtractionContext = { line, lineIndex, inCodeBlock };
		extractUrlsFromLine(context, urls, extractedPositions);
	});

	return urls;
}

function updateCodeBlockState(line: string, currentState: boolean): boolean {
	return line.trim().startsWith(CODE_BLOCK_MARKER)
		? !currentState
		: currentState;
}

function extractUrlsFromLine(
	context: ExtractionContext,
	urls: Url[],
	extractedPositions: Set<string>,
): void {
	try {
		// Extract in priority order
		extractMarkdownLinks(context, urls, extractedPositions);
		extractAutolinks(context, urls, extractedPositions);
		extractPlainUrls(context, urls, extractedPositions);
	} catch (error) {
		logExtractionError(context.lineIndex, error);
	}
}

function extractMarkdownLinks(
	context: ExtractionContext,
	urls: Url[],
	extractedPositions: Set<string>,
): void {
	MARKDOWN_LINK_PATTERN.lastIndex = 0;
	let match: RegExpExecArray | null;

	while ((match = MARKDOWN_LINK_PATTERN.exec(context.line)) !== null) {
		const url = match[2];
		if (!url || !isValidUrl(url)) {
			continue;
		}

		const matchIndex = match.index ?? 0;
		if (isInInlineCode(context.line, matchIndex)) {
			continue;
		}

		addUrlIfNew(url, context, matchIndex, urls, extractedPositions);
	}
}

function extractAutolinks(
	context: ExtractionContext,
	urls: Url[],
	extractedPositions: Set<string>,
): void {
	MARKDOWN_AUTOLINK_PATTERN.lastIndex = 0;
	let match: RegExpExecArray | null;

	while ((match = MARKDOWN_AUTOLINK_PATTERN.exec(context.line)) !== null) {
		const url = match[1];
		if (!url || !isValidUrl(url)) {
			continue;
		}

		const matchIndex = match.index ?? 0;
		if (isInInlineCode(context.line, matchIndex)) {
			continue;
		}

		addUrlIfNew(url, context, matchIndex, urls, extractedPositions);
	}
}

function extractPlainUrls(
	context: ExtractionContext,
	urls: Url[],
	extractedPositions: Set<string>,
): void {
	const patterns = [
		URL_PATTERN,
		FTP_PATTERN,
		MAILTO_PATTERN,
		TEL_PATTERN,
		FILE_PATTERN,
	];

	for (const pattern of patterns) {
		extractByPattern(pattern, context, urls, extractedPositions);
	}
}

function extractByPattern(
	pattern: RegExp,
	context: ExtractionContext,
	urls: Url[],
	extractedPositions: Set<string>,
): void {
	pattern.lastIndex = 0;
	let match: RegExpExecArray | null;

	while ((match = pattern.exec(context.line)) !== null) {
		const url = match[0];
		if (!url) {
			continue;
		}

		const matchIndex = match.index ?? 0;
		if (isInInlineCode(context.line, matchIndex)) {
			continue;
		}

		// For URL_PATTERN, validate the URL
		if (pattern === URL_PATTERN && !isValidUrl(url)) {
			continue;
		}

		addUrlIfNew(url, context, matchIndex, urls, extractedPositions);
	}
}

function isInInlineCode(line: string, index: number): boolean {
	const before = line.substring(0, index);
	const backticks = before.split('`').length - 1;
	return backticks % 2 === 1;
}

function addUrlIfNew(
	url: string,
	context: ExtractionContext,
	matchIndex: number,
	urls: Url[],
	extractedPositions: Set<string>,
): void {
	const posKey = url;
	if (extractedPositions.has(posKey)) {
		return;
	}

	extractedPositions.add(posKey);
	urls.push(createUrl(url, context, matchIndex));
}

function createUrl(
	url: string,
	context: ExtractionContext,
	columnIndex: number,
): Url {
	const components = extractUrlComponents(url);

	const baseUrl = {
		value: url,
		protocol: detectUrlProtocol(url),
		position: Object.freeze({
			line: context.lineIndex + 1,
			column: columnIndex + 1,
		}),
		context: context.line.trim(),
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

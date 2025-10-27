import type { Url, UrlProtocol } from '../../types';

const URL_PATTERN = /(https?:\/\/[^\s<>"{}|\\^`[\];)']+)/g;
const FTP_PATTERN = /(ftp:\/\/[^\s<>"{}|\\^`[\];)']+)/g;
const MAILTO_PATTERN = /(mailto:[^\s<>"{}|\\^`[\];)']+)/g;
const TEL_PATTERN = /(tel:[^\s<>"{}|\\^`[\];)']+)/g;
const FILE_PATTERN = /(file:\/\/[^\s<>"{}|\\^`[\];)']+)/g;

interface PatternConfig {
	readonly pattern: RegExp;
	readonly protocol: UrlProtocol;
}

const PATTERNS: readonly PatternConfig[] = Object.freeze([
	{ pattern: URL_PATTERN, protocol: 'https' },
	{ pattern: FTP_PATTERN, protocol: 'ftp' },
	{ pattern: MAILTO_PATTERN, protocol: 'mailto' },
	{ pattern: TEL_PATTERN, protocol: 'tel' },
	{ pattern: FILE_PATTERN, protocol: 'file' },
]);

export function extractFromJson(content: string): Url[] {
	const lines = content.split('\n');
	const urls: Url[] = [];

	lines.forEach((line, lineIndex) => {
		extractUrlsFromLine(line, lineIndex, urls);
	});

	return urls;
}

function extractUrlsFromLine(
	line: string,
	lineIndex: number,
	urls: Url[],
): void {
	try {
		for (const config of PATTERNS) {
			extractUrlsByPattern(line, lineIndex, config, urls);
		}
	} catch (error) {
		logRegexError(lineIndex, error);
	}
}

function extractUrlsByPattern(
	line: string,
	lineIndex: number,
	config: PatternConfig,
	urls: Url[],
): void {
	config.pattern.lastIndex = 0; // Reset regex state
	let match: RegExpExecArray | null;

	while ((match = config.pattern.exec(line)) !== null) {
		urls.push(
			createUrl(match[0], config.protocol, line, lineIndex, match.index),
		);
	}
}

function createUrl(
	value: string,
	protocol: UrlProtocol,
	context: string,
	lineIndex: number,
	columnIndex: number,
): Url {
	return Object.freeze({
		value,
		protocol,
		position: Object.freeze({
			line: lineIndex + 1,
			column: columnIndex + 1,
		}),
		context: context.trim(),
	});
}

function logRegexError(lineIndex: number, error: unknown): void {
	console.warn(`[URLs-LE] Regex error on line ${lineIndex + 1}:`, error);
}

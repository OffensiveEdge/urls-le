import type { ExtractionResult, FileType, Url } from '../types';
import { extractFromCss } from './formats/css';
import { extractFromHtml } from './formats/html';
import { extractFromJavaScript } from './formats/javascript';
import { extractFromJson } from './formats/json';
import { extractFromMarkdown } from './formats/markdown';
import { extractFromYaml } from './formats/yaml';

export async function extractUrls(
	content: string,
	languageId: string,
): Promise<ExtractionResult> {
	const fileType = determineFileType(languageId);
	const urls: Url[] = [];
	const errors: Array<{
		type: 'parse-error' | 'validation-error';
		message: string;
		filepath?: string;
	}> = [];

	try {
		switch (fileType) {
			case 'markdown':
				urls.push(...extractFromMarkdown(content));
				break;
			case 'html':
				urls.push(...extractFromHtml(content));
				break;
			case 'css':
				urls.push(...extractFromCss(content));
				break;
			case 'javascript':
			case 'typescript':
				urls.push(...extractFromJavaScript(content));
				break;
			case 'json':
				urls.push(...extractFromJson(content));
				break;
			case 'yaml':
			case 'yml':
				urls.push(...extractFromYaml(content));
				break;
			default:
				// Try markdown extraction as fallback
				urls.push(...extractFromMarkdown(content));
				break;
		}
	} catch (error) {
		errors.push({
			type: 'parse-error',
			message: error instanceof Error ? error.message : 'Unknown parsing error',
		});
	}

	return Object.freeze({
		success: errors.length === 0,
		urls: Object.freeze(urls),
		errors: Object.freeze(errors),
	});
}

function determineFileType(languageId: string): FileType {
	switch (languageId) {
		case 'markdown':
			return 'markdown';
		case 'html':
			return 'html';
		case 'css':
			return 'css';
		case 'javascript':
			return 'javascript';
		case 'typescript':
			return 'typescript';
		case 'json':
			return 'json';
		case 'yaml':
		case 'yml':
			return 'yaml';
		default:
			return 'unknown';
	}
}

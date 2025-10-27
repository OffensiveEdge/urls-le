import type * as vscode from 'vscode';
import type { Configuration } from '../types';

export interface SafetyResult {
	readonly proceed: boolean;
	readonly message: string;
}

export function handleSafetyChecks(
	document: vscode.TextDocument,
	config: Configuration,
): SafetyResult {
	// Fail fast: Skip checks if safety is disabled
	if (!config.safetyEnabled) {
		return createSafeResult();
	}

	const contentSize = getContentSize(document);
	const exceedsLimit = contentSize > config.safetyFileSizeWarnBytes;

	// Fail fast: Check file size
	if (exceedsLimit) {
		return createUnsafeResult(contentSize, config.safetyFileSizeWarnBytes);
	}

	return createSafeResult();
}

function getContentSize(document: vscode.TextDocument): number {
	return document.getText().length;
}

function createSafeResult(): SafetyResult {
	return Object.freeze({ proceed: true, message: '' });
}

function createUnsafeResult(
	actualSize: number,
	threshold: number,
): SafetyResult {
	const message = `File size (${actualSize} bytes) exceeds safety threshold (${threshold} bytes)`;
	return Object.freeze({ proceed: false, message });
}

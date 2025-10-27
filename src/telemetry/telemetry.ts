import * as vscode from 'vscode';
import { getConfiguration } from '../config/config';

export interface Telemetry {
	event(name: string, properties?: Record<string, unknown>): void;
	dispose(): void;
}

export function createTelemetry(): Telemetry {
	let outputChannel: vscode.OutputChannel | undefined;

	return Object.freeze({
		event(name: string, properties?: Record<string, unknown>): void {
			const config = getConfiguration();

			// Fail fast: Skip if telemetry is disabled
			if (!config.telemetryEnabled) {
				return;
			}

			// Create channel lazily if needed
			if (!outputChannel) {
				outputChannel = vscode.window.createOutputChannel('URLs-LE Telemetry');
			}

			logEvent(outputChannel, name, properties);
		},
		dispose(): void {
			outputChannel?.dispose();
		},
	});
}

function logEvent(
	channel: vscode.OutputChannel,
	name: string,
	properties?: Record<string, unknown>,
): void {
	const timestamp = new Date().toISOString();
	const serializedProps = serializeProperties(properties);
	channel.appendLine(`[${timestamp}] ${name}${serializedProps}`);
}

function serializeProperties(properties?: Record<string, unknown>): string {
	if (!properties) {
		return '';
	}

	try {
		return ` ${JSON.stringify(properties)}`;
	} catch {
		return ' [serialization error]';
	}
}

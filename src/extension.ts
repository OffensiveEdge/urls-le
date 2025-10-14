import type * as vscode from 'vscode';
import { registerCommands } from './commands';
import { registerOpenSettingsCommand } from './config/settings';
import { createTelemetry } from './telemetry/telemetry';
import { createNotifier } from './ui/notifier';
import { createStatusBar } from './ui/statusBar';

export function activate(context: vscode.ExtensionContext): void {
	// Create core services
	const telemetry = createTelemetry();
	const notifier = createNotifier();
	const statusBar = createStatusBar(context);

	// Register disposables to prevent memory leaks
	context.subscriptions.push(telemetry);
	context.subscriptions.push(statusBar);

	// Register extract command
	registerCommands(context, {
		telemetry,
		notifier,
		statusBar,
	});

	// Register settings command
	registerOpenSettingsCommand(context, telemetry);

	telemetry.event('extension-activated');
}

export function deactivate(): void {
	// Extensions are automatically disposed via context.subscriptions
	// Additional cleanup can be added here if needed
}

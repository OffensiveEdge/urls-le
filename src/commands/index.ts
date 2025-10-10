import type * as vscode from 'vscode';
import type { Telemetry } from '../telemetry/telemetry';
import type { Notifier } from '../ui/notifier';
import type { StatusBar } from '../ui/statusBar';
import { registerAnalyzeCommand } from './analyze';
import { registerCheckAccessibilityCommand } from './checkAccessibility';
import { registerExtractCommand } from './extract';
import { registerHelpCommand } from './help';
import { registerValidateCommand } from './validate';

export function registerCommands(
	context: vscode.ExtensionContext,
	deps: Readonly<{
		telemetry: Telemetry;
		notifier: Notifier;
		statusBar: StatusBar;
	}>,
): void {
	registerExtractCommand(context, deps);
	registerValidateCommand(context, deps);
	registerCheckAccessibilityCommand(context, deps);
	registerAnalyzeCommand(context, deps);
	registerHelpCommand(context, deps);
}

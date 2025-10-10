import * as vscode from 'vscode'
import { registerCommands } from './commands'
import { registerOpenSettingsCommand } from './config/settings'
import { createTelemetry } from './telemetry/telemetry'
import { createNotifier } from './ui/notifier'
import { createStatusBar } from './ui/statusBar'
import { createErrorHandler, createErrorLogger, createErrorNotifier } from './utils/errorHandling'
import { createLocalizer } from './utils/localization'
import { createPerformanceMonitor } from './utils/performance'

export function activate(context: vscode.ExtensionContext): void {
  // Create output channel for logging
  const outputChannel = vscode.window.createOutputChannel('URLs-LE')
  context.subscriptions.push(outputChannel)

  // Create core services
  const telemetry = createTelemetry()
  const notifier = createNotifier()
  const statusBar = createStatusBar(context)
  const localizer = createLocalizer()
  const performanceMonitor = createPerformanceMonitor()

  // Create error handling services
  const _errorLogger = createErrorLogger()
  const _errorNotifier = createErrorNotifier()
  const errorHandler = createErrorHandler()

  // Register all commands
  registerCommands(context, {
    telemetry,
    notifier,
    statusBar,
    localizer,
    performanceMonitor,
    errorHandler,
  })

  // Register settings command
  registerOpenSettingsCommand(context, telemetry)

  telemetry.event('extension-activated')
}

export function deactivate(): void {
  // Extensions are automatically disposed via context.subscriptions
  // Additional cleanup can be added here if needed
}

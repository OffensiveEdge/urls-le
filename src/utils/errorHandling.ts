import * as vscode from 'vscode'
import type {
  ErrorCategory,
  ErrorSeverity,
  ParseError,
  RecoveryAction,
  UrlsLeError,
} from '../types'

export interface ErrorHandler {
  handleError(error: UrlsLeError, context?: unknown): Promise<void>
  handleParseError(error: ParseError, context?: unknown): Promise<void>
  handleValidationError(error: UrlsLeError, context?: unknown): Promise<void>
  handleFileSystemError(error: UrlsLeError, context?: unknown): Promise<void>
  handleConfigurationError(error: UrlsLeError, context?: unknown): Promise<void>
  handlePerformanceError(error: UrlsLeError, context?: unknown): Promise<void>
}

export interface ErrorRecovery {
  canRecover(error: UrlsLeError): boolean
  recover(error: UrlsLeError, context?: unknown): Promise<RecoveryResult>
}

export interface RecoveryResult {
  success: boolean
  action: RecoveryAction
  message?: string
  data?: unknown
}

export interface ErrorLogger {
  logError(error: UrlsLeError, context?: unknown): void
  logInfo(message: string, data?: unknown): void
  logWarning(message: string, data?: unknown): void
}

export interface ErrorNotifier {
  showError(message: string, error?: UrlsLeError): void
  showWarning(message: string, error?: UrlsLeError): void
  showInfo(message: string, error?: UrlsLeError): void
}

export function createError(
  category: ErrorCategory,
  severity: ErrorSeverity,
  message: string,
  options: {
    context?: string
    recoverable?: boolean
    recoveryAction?: RecoveryAction
    metadata?: Record<string, unknown>
    stack?: string
  } = {},
): UrlsLeError {
  return Object.freeze({
    category,
    severity,
    message,
    context: options.context,
    recoverable: options.recoverable ?? false,
    recoveryAction: options.recoveryAction ?? 'skip',
    timestamp: Date.now(),
    stack: options.stack,
    metadata: options.metadata ? Object.freeze(options.metadata) : undefined,
  })
}

export function createParseError(
  message: string,
  options: {
    filepath?: string
    position?: { line: number; column: number }
    context?: string
    recoverable?: boolean
    recoveryAction?: RecoveryAction
    metadata?: Record<string, unknown>
    stack?: string
  } = {},
): ParseError {
  return Object.freeze({
    category: 'parsing',
    severity: 'warning',
    message,
    filepath: options.filepath,
    position: options.position,
    context: options.context,
    recoverable: options.recoverable ?? true,
    recoveryAction: options.recoveryAction ?? 'skip',
    timestamp: Date.now(),
    stack: options.stack,
    metadata: options.metadata ? Object.freeze(options.metadata) : undefined,
  })
}

export function createValidationError(
  message: string,
  options: {
    context?: string
    recoverable?: boolean
    recoveryAction?: RecoveryAction
    metadata?: Record<string, unknown>
    stack?: string
  } = {},
): UrlsLeError {
  return createError('validation', 'warning', message, {
    ...options,
    recoverable: options.recoverable ?? true,
    recoveryAction: options.recoveryAction ?? 'skip',
  })
}

export function createFileSystemError(
  message: string,
  options: {
    filepath?: string
    context?: string
    recoverable?: boolean
    recoveryAction?: RecoveryAction
    metadata?: Record<string, unknown>
    stack?: string
  } = {},
): UrlsLeError {
  return createError('file-system', 'error', message, {
    ...options,
    recoverable: options.recoverable ?? false,
    recoveryAction: options.recoveryAction ?? 'user-action',
  })
}

export function createConfigurationError(
  message: string,
  options: {
    setting?: string
    context?: string
    recoverable?: boolean
    recoveryAction?: RecoveryAction
    metadata?: Record<string, unknown>
    stack?: string
  } = {},
): UrlsLeError {
  return createError('configuration', 'warning', message, {
    ...options,
    recoverable: options.recoverable ?? true,
    recoveryAction: options.recoveryAction ?? 'fallback',
  })
}

export function createPerformanceError(
  message: string,
  options: {
    metric?: string
    value?: number
    threshold?: number
    context?: string
    recoverable?: boolean
    recoveryAction?: RecoveryAction
    metadata?: Record<string, unknown>
    stack?: string
  } = {},
): UrlsLeError {
  return createError('performance', 'warning', message, {
    ...options,
    recoverable: options.recoverable ?? true,
    recoveryAction: options.recoveryAction ?? 'user-action',
  })
}

export function createErrorHandler(
  deps: Readonly<{
    logger: ErrorLogger
    notifier: ErrorNotifier
    config: Readonly<{ showParseErrors: boolean; notificationsLevel: string }>
  }>,
): ErrorHandler {
  return Object.freeze({
    async handleError(error: UrlsLeError, _context?: unknown): Promise<void> {
      // Log the error
      deps.logger.logError(error, _context)

      // Handle based on category
      switch (error.category) {
        case 'parsing':
          await this.handleParseError(error as ParseError, _context)
          break
        case 'validation':
          await this.handleValidationError(error, _context)
          break
        case 'file-system':
          await this.handleFileSystemError(error, _context)
          break
        case 'configuration':
          await this.handleConfigurationError(error, _context)
          break
        case 'performance':
          await this.handlePerformanceError(error, _context)
          break
        default:
          await this.handleUnknownError(error, _context)
      }
    },

    async handleParseError(error: ParseError, _context?: unknown): Promise<void> {
      if (deps.config.showParseErrors) {
        const message = error.position
          ? `Parse error at line ${error.position.line}, column ${error.position.column}: ${error.message}`
          : `Parse error: ${error.message}`

        deps.notifier.showWarning(message, error)
      }
    },

    async handleValidationError(error: UrlsLeError, _context?: unknown): Promise<void> {
      if (
        deps.config.notificationsLevel === 'all' ||
        deps.config.notificationsLevel === 'important'
      ) {
        deps.notifier.showWarning(`Validation error: ${error.message}`, error)
      }
    },

    async handleFileSystemError(error: UrlsLeError, _context?: unknown): Promise<void> {
      deps.notifier.showError(`File system error: ${error.message}`, error)
    },

    async handleConfigurationError(error: UrlsLeError, _context?: unknown): Promise<void> {
      if (deps.config.notificationsLevel === 'all') {
        deps.notifier.showWarning(`Configuration error: ${error.message}`, error)
      }
    },

    async handlePerformanceError(error: UrlsLeError, _context?: unknown): Promise<void> {
      if (
        deps.config.notificationsLevel === 'all' ||
        deps.config.notificationsLevel === 'important'
      ) {
        deps.notifier.showWarning(`Performance warning: ${error.message}`, error)
      }
    },

    async handleUnknownError(error: UrlsLeError, _context?: unknown): Promise<void> {
      deps.notifier.showError(`Unexpected error: ${error.message}`, error)
    },
  })
}

export function createErrorRecovery(): ErrorRecovery {
  return Object.freeze({
    canRecover(error: UrlsLeError): boolean {
      return error.recoverable
    },

    async recover(error: UrlsLeError, _context?: unknown): Promise<RecoveryResult> {
      if (!this.canRecover(error)) {
        return Object.freeze({
          success: false,
          action: 'abort',
          message: 'Error is not recoverable',
        })
      }

      switch (error.recoveryAction) {
        case 'retry':
          return Object.freeze({
            success: true,
            action: 'retry',
            message: 'Retrying operation',
          })

        case 'fallback':
          return Object.freeze({
            success: true,
            action: 'fallback',
            message: 'Using fallback method',
          })

        case 'skip':
          return Object.freeze({
            success: true,
            action: 'skip',
            message: 'Skipping problematic item',
          })

        case 'user-action':
          return Object.freeze({
            success: false,
            action: 'user-action',
            message: 'User intervention required',
          })

        default:
          return Object.freeze({
            success: false,
            action: 'abort',
            message: 'Unknown recovery action',
          })
      }
    },
  })
}

export function createErrorLogger(outputChannel: vscode.OutputChannel): ErrorLogger {
  return Object.freeze({
    logError(error: UrlsLeError, _context?: unknown): void {
      const timestamp = new Date(error.timestamp).toISOString()
      const logEntry = `[ERROR] ${timestamp} [${error.category}] ${error.message}`

      outputChannel.appendLine(logEntry)

      if (error.context) {
        outputChannel.appendLine(`  Context: ${error.context}`)
      }

      if (error.metadata) {
        outputChannel.appendLine(`  Metadata: ${JSON.stringify(error.metadata)}`)
      }

      if (error.stack) {
        outputChannel.appendLine(`  Stack: ${error.stack}`)
      }

      if (_context) {
        outputChannel.appendLine(`  Additional Context: ${JSON.stringify(_context)}`)
      }
    },

    logInfo(message: string, data?: unknown): void {
      const timestamp = new Date().toISOString()
      const logEntry = `[INFO] ${timestamp} ${message}`

      outputChannel.appendLine(logEntry)

      if (data) {
        outputChannel.appendLine(`  Data: ${JSON.stringify(data)}`)
      }
    },

    logWarning(message: string, data?: unknown): void {
      const timestamp = new Date().toISOString()
      const logEntry = `[WARNING] ${timestamp} ${message}`

      outputChannel.appendLine(logEntry)

      if (data) {
        outputChannel.appendLine(`  Data: ${JSON.stringify(data)}`)
      }
    },
  })
}

export function createErrorNotifier(): ErrorNotifier {
  return Object.freeze({
    showError(message: string, _error?: UrlsLeError): void {
      vscode.window.showErrorMessage(message)
    },

    showWarning(message: string, _error?: UrlsLeError): void {
      vscode.window.showWarningMessage(message)
    },

    showInfo(message: string, _error?: UrlsLeError): void {
      vscode.window.showInformationMessage(message)
    },
  })
}

export function sanitizeErrorForLogging(error: UrlsLeError): UrlsLeError {
  return Object.freeze({
    ...error,
    message: sanitizeString(error.message),
    context: error.context ? sanitizeString(error.context) : undefined,
    metadata: error.metadata ? sanitizeMetadata(error.metadata) : undefined,
  })
}

function sanitizeString(str: string): string {
  return str
    .replace(/https?:\/\/[^\s]+/g, '[URL]')
    .replace(/mailto:[^\s]+/g, '[EMAIL]')
    .replace(/tel:[^\s]+/g, '[PHONE]')
    .replace(/file:\/\/[^\s]+/g, '[FILE]')
}

function sanitizeMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(metadata)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value)
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeMetadata(value as Record<string, unknown>)
    } else {
      sanitized[key] = value
    }
  }

  return Object.freeze(sanitized)
}

export function categorizeError(error: Error): ErrorCategory {
  const message = error.message.toLowerCase()

  if (message.includes('parse') || message.includes('syntax')) {
    return 'parsing'
  }

  if (message.includes('validation') || message.includes('invalid')) {
    return 'validation'
  }

  if (message.includes('file') || message.includes('path') || message.includes('permission')) {
    return 'file-system'
  }

  if (message.includes('config') || message.includes('setting')) {
    return 'configuration'
  }

  if (
    message.includes('timeout') ||
    message.includes('memory') ||
    message.includes('performance')
  ) {
    return 'performance'
  }

  if (message.includes('url') || message.includes('http') || message.includes('network')) {
    return 'url-validation'
  }

  if (
    message.includes('analysis') ||
    message.includes('security') ||
    message.includes('accessibility')
  ) {
    return 'analysis'
  }

  return 'unknown'
}

export function determineSeverity(error: Error, category: ErrorCategory): ErrorSeverity {
  const message = error.message.toLowerCase()

  if (message.includes('critical') || message.includes('fatal')) {
    return 'critical'
  }

  if (message.includes('error') || message.includes('failed')) {
    return 'error'
  }

  if (message.includes('warning') || message.includes('caution')) {
    return 'warning'
  }

  // Default severity based on category
  switch (category) {
    case 'file-system':
    case 'configuration':
      return 'error'
    case 'parsing':
    case 'validation':
    case 'performance':
      return 'warning'
    case 'analysis':
    case 'url-validation':
      return 'info'
    default:
      return 'error'
  }
}

export function determineRecoveryAction(
  category: ErrorCategory,
  severity: ErrorSeverity,
): RecoveryAction {
  if (severity === 'critical') {
    return 'abort'
  }

  switch (category) {
    case 'parsing':
    case 'validation':
      return 'skip'
    case 'file-system':
      return 'user-action'
    case 'configuration':
      return 'fallback'
    case 'performance':
      return 'user-action'
    case 'analysis':
    case 'url-validation':
      return 'skip'
    default:
      return 'skip'
  }
}

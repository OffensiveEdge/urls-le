import * as nls from 'vscode-nls'

const localize = nls.config({ messageFormat: nls.MessageFormat.file })()

/**
 * Enhanced error handling utilities for URLs-LE
 * Provides sophisticated error categorization, recovery, and user feedback
 */

export type ErrorCategory = 'parse' | 'validation' | 'safety' | 'operational' | 'file-system' | 'configuration'

export interface EnhancedError {
	readonly category: ErrorCategory
	readonly originalError: Error
	readonly message: string
	readonly userFriendlyMessage: string
	readonly suggestion: string
	readonly recoverable: boolean
	readonly timestamp: Date
}

export interface ErrorRecoveryOptions {
	readonly retryable: boolean
	readonly maxRetries: number
	readonly retryDelay: number
	readonly fallbackAction?: () => Promise<void>
}

/**
 * Create an enhanced error with categorization and user-friendly messaging
 */
export function createEnhancedError(error: Error, category: ErrorCategory, context?: string): EnhancedError {
	const _errorType = getErrorType(error, category)
	const userFriendlyMessage = getUserFriendlyMessage(error, category, context)
	const suggestion = getErrorSuggestion(error, category)
	const recoverable = isRecoverableError(error, category)

	return Object.freeze({
		category,
		originalError: error,
		message: error.message,
		userFriendlyMessage,
		suggestion,
		recoverable,
		timestamp: new Date(),
	})
}

/**
 * Get error type for categorization
 */
function getErrorType(_error: Error, category: ErrorCategory): string {
	switch (category) {
		case 'parse':
			return 'url-parse-error'
		case 'validation':
			return 'url-validation-error'
		case 'safety':
			return 'url-safety-error'
		case 'file-system':
			return 'url-file-system-error'
		case 'configuration':
			return 'url-configuration-error'
		case 'operational':
			return 'url-operational-error'
		default:
			return 'unknown-error'
	}
}

/**
 * Determine if an error is recoverable
 */
function isRecoverableError(error: Error, category: ErrorCategory): boolean {
	switch (category) {
		case 'parse':
			// Parse errors are recoverable if they don't prevent URL processing
			return true
		case 'file-system':
			// File system errors might be recoverable (permissions, network issues)
			return error.message.includes('permission') || error.message.includes('network')
		case 'configuration':
			// Configuration errors are recoverable (fallback to defaults)
			return true
		case 'validation':
			// Validation errors are recoverable (skip invalid URLs)
			return true
		case 'safety':
			// Safety errors are not recoverable (user must take action)
			return false
		case 'operational':
			return !error.message.includes('fatal')
		default:
			return false
	}
}

/**
 * Get user-friendly error message
 */
function getUserFriendlyMessage(error: Error, category: ErrorCategory, context?: string): string {
	switch (category) {
		case 'parse':
			return localize('runtime.error.parse', 'Failed to parse URL values: {0}', context || 'unknown file')
		case 'file-system':
			return localize('runtime.error.file-system', 'File system error: {0}', error.message)
		case 'configuration':
			return localize('runtime.error.configuration', 'Configuration error: {0}', error.message)
		case 'validation':
			return localize('runtime.error.validation', 'URL validation failed: {0}', error.message)
		case 'safety':
			return localize('runtime.error.safety', 'Safety threshold exceeded: {0}', error.message)
		case 'operational':
			return localize('runtime.error.operational', 'URL extraction failed: {0}', error.message)
		default:
			return localize('runtime.error.unknown', 'Unknown error: {0}', error.message)
	}
}

/**
 * Get error recovery suggestion
 */
function getErrorSuggestion(_error: Error, category: ErrorCategory): string {
	switch (category) {
		case 'parse':
			return localize('runtime.error.parse.suggestion', 'Check the URL format and ensure values are valid')
		case 'file-system':
			return localize('runtime.error.file-system.suggestion', 'Check file permissions and ensure the file exists')
		case 'configuration':
			return localize(
				'runtime.error.configuration.suggestion',
				'Reset to default settings or check configuration syntax',
			)
		case 'validation':
			return localize(
				'runtime.error.validation.suggestion',
				'Review URL values and ensure they meet validation criteria',
			)
		case 'safety':
			return localize('runtime.error.safety.suggestion', 'Reduce file size or adjust safety thresholds')
		case 'operational':
			return localize('runtime.error.operational.suggestion', 'Try again or check system resources')
		default:
			return localize(
				'runtime.error.unknown.suggestion',
				'Check the logs for more details and consider reporting this issue',
			)
	}
}

/**
 * Get error recovery options
 */
export function getErrorRecoveryOptions(error: EnhancedError): ErrorRecoveryOptions {
	switch (error.category) {
		case 'parse':
			return {
				retryable: false,
				maxRetries: 0,
				retryDelay: 0,
			}
		case 'file-system':
			return {
				retryable: true,
				maxRetries: 3,
				retryDelay: 1000,
			}
		case 'configuration':
			return {
				retryable: false,
				maxRetries: 0,
				retryDelay: 0,
				fallbackAction: async () => {
					// Fallback to default configuration
				},
			}
		case 'validation':
			return {
				retryable: false,
				maxRetries: 0,
				retryDelay: 0,
			}
		case 'safety':
			return {
				retryable: false,
				maxRetries: 0,
				retryDelay: 0,
			}
		case 'operational':
			return {
				retryable: true,
				maxRetries: 2,
				retryDelay: 2000,
			}
		default:
			return {
				retryable: false,
				maxRetries: 0,
				retryDelay: 0,
			}
	}
}

/**
 * Sanitize error message for display
 */
export function sanitizeErrorMessage(message: string): string {
	// Remove sensitive information
	return message
		.replace(/\/Users\/[^/]+\//g, '/Users/***/')
		.replace(/\/home\/[^/]+\//g, '/home/***/')
		.replace(/C:\\Users\\[^\\]+\\/g, 'C:\\Users\\***\\')
		.replace(/password[=:]\s*[^\s]+/gi, 'password=***')
		.replace(/token[=:]\s*[^\s]+/gi, 'token=***')
		.replace(/key[=:]\s*[^\s]+/gi, 'key=***')
}

/**
 * Handle error with appropriate user feedback
 */
export function handleError(error: EnhancedError): void {
	const sanitizedMessage = sanitizeErrorMessage(error.userFriendlyMessage)

	if (error.recoverable) {
		// Show warning for recoverable errors
		console.warn(`[URLs-LE] ${sanitizedMessage}`)
	} else {
		// Show error for non-recoverable errors
		console.error(`[URLs-LE] ${sanitizedMessage}`)
	}
}

void localize

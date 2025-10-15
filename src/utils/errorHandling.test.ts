import { describe, expect, it } from 'vitest';
import {
	categorizeError,
	createErrorMessage,
	type ErrorCategory,
	formatErrorForUser,
	getErrorSuggestion,
	isKnownError,
} from './errorHandling';

describe('Error Handling', () => {
	describe('categorizeError', () => {
		it('categorizes parse errors', () => {
			const parseError = new Error('Failed to parse JSON');
			expect(categorizeError(parseError)).toBe('parse');

			const syntaxError = new SyntaxError('Unexpected token');
			expect(categorizeError(syntaxError)).toBe('parse');
		});

		it('categorizes file system errors', () => {
			const fsError = new Error('ENOENT: no such file or directory');
			expect(categorizeError(fsError)).toBe('file-system');

			const permissionError = new Error('EACCES: permission denied');
			expect(categorizeError(permissionError)).toBe('file-system');
		});

		it('categorizes configuration errors', () => {
			const configError = new Error('Invalid configuration value');
			expect(categorizeError(configError)).toBe('configuration');

			const settingsError = new Error('Settings validation failed');
			expect(categorizeError(settingsError)).toBe('configuration');
		});

		it('categorizes validation errors', () => {
			const validationError = new Error('URL validation failed');
			expect(categorizeError(validationError)).toBe('validation');

			const formatError = new Error('Invalid URL format');
			expect(categorizeError(formatError)).toBe('validation');
		});

		it('categorizes safety errors', () => {
			const safetyError = new Error('File size exceeds safety threshold');
			expect(categorizeError(safetyError)).toBe('safety');

			const memoryError = new Error('Memory usage too high');
			expect(categorizeError(memoryError)).toBe('safety');
		});

		it('categorizes operational errors', () => {
			const networkError = new Error('Network request failed');
			expect(categorizeError(networkError)).toBe('operational');

			const timeoutError = new Error('Operation timed out');
			expect(categorizeError(timeoutError)).toBe('operational');
		});

		it('defaults to unknown for unrecognized errors', () => {
			const unknownError = new Error('Some random error');
			expect(categorizeError(unknownError)).toBe('unknown');
		});

		it('handles errors without messages', () => {
			const emptyError = new Error('');
			expect(categorizeError(emptyError)).toBe('unknown');

			const nullError = new Error();
			expect(categorizeError(nullError)).toBe('unknown');
		});
	});

	describe('isKnownError', () => {
		it('identifies known error categories', () => {
			expect(isKnownError('parse')).toBe(true);
			expect(isKnownError('file-system')).toBe(true);
			expect(isKnownError('configuration')).toBe(true);
			expect(isKnownError('validation')).toBe(true);
			expect(isKnownError('safety')).toBe(true);
			expect(isKnownError('operational')).toBe(true);
		});

		it('identifies unknown error categories', () => {
			expect(isKnownError('unknown')).toBe(false);
			expect(isKnownError('random' as ErrorCategory)).toBe(false);
		});
	});

	describe('getErrorSuggestion', () => {
		it('provides suggestions for parse errors', () => {
			const suggestion = getErrorSuggestion('parse');
			expect(suggestion).toContain('Check the URL format');
			expect(suggestion).toContain('ensure values are valid');
		});

		it('provides suggestions for file system errors', () => {
			const suggestion = getErrorSuggestion('file-system');
			expect(suggestion).toContain('Check file permissions');
			expect(suggestion).toContain('ensure the file exists');
		});

		it('provides suggestions for configuration errors', () => {
			const suggestion = getErrorSuggestion('configuration');
			expect(suggestion).toContain('Reset to default settings');
			expect(suggestion).toContain('check configuration syntax');
		});

		it('provides suggestions for validation errors', () => {
			const suggestion = getErrorSuggestion('validation');
			expect(suggestion).toContain('Review URL values');
			expect(suggestion).toContain('validation criteria');
		});

		it('provides suggestions for safety errors', () => {
			const suggestion = getErrorSuggestion('safety');
			expect(suggestion).toContain('Reduce file size');
			expect(suggestion).toContain('adjust safety thresholds');
		});

		it('provides suggestions for operational errors', () => {
			const suggestion = getErrorSuggestion('operational');
			expect(suggestion).toContain('Try again');
			expect(suggestion).toContain('check system resources');
		});

		it('provides generic suggestion for unknown errors', () => {
			const suggestion = getErrorSuggestion('unknown');
			expect(suggestion).toContain('Check the logs');
			expect(suggestion).toContain('reporting this issue');
		});
	});

	describe('createErrorMessage', () => {
		it('creates localized error messages', () => {
			const parseError = new Error('JSON parse failed');
			const message = createErrorMessage(parseError);

			expect(message).toContain('Failed to parse URL values');
			expect(message).toContain('JSON parse failed');
		});

		it('handles different error categories', () => {
			const fsError = new Error('File not found');
			const message = createErrorMessage(fsError);

			expect(message).toContain('File system error');
			expect(message).toContain('File not found');
		});

		it('handles errors without specific messages', () => {
			const genericError = new Error();
			const message = createErrorMessage(genericError);

			expect(message).toContain('Unknown error');
		});
	});

	describe('formatErrorForUser', () => {
		it('formats error with suggestion', () => {
			const error = new Error('Invalid URL format');
			const formatted = formatErrorForUser(error);

			expect(formatted).toContain('URL validation failed');
			expect(formatted).toContain('Invalid URL format');
			expect(formatted).toContain('Review URL values');
		});

		it('formats error without duplicating information', () => {
			const error = new Error('Parse error occurred');
			const formatted = formatErrorForUser(error);

			// Should not repeat "parse" multiple times
			const parseCount = (formatted.match(/parse/gi) || []).length;
			expect(parseCount).toBeLessThanOrEqual(2);
		});

		it('handles very long error messages', () => {
			const longMessage = 'A'.repeat(500);
			const error = new Error(longMessage);
			const formatted = formatErrorForUser(error);

			// Should still be readable and include suggestion
			expect(formatted.length).toBeGreaterThan(longMessage.length);
			expect(formatted).toContain('Check the logs');
		});

		it('handles errors with special characters', () => {
			const error = new Error('Error with "quotes" and <brackets>');
			const formatted = formatErrorForUser(error);

			expect(formatted).toContain('quotes');
			expect(formatted).toContain('brackets');
		});

		it('provides context for different error types', () => {
			const configError = new Error('Invalid setting value');
			const formatted = formatErrorForUser(configError);

			expect(formatted).toContain('Configuration error');
			expect(formatted).toContain('Reset to default settings');
		});
	});

	describe('edge cases', () => {
		it('handles null and undefined errors', () => {
			expect(() => categorizeError(null as any)).not.toThrow();
			expect(() => categorizeError(undefined as any)).not.toThrow();
			expect(() => createErrorMessage(null as any)).not.toThrow();
			expect(() => formatErrorForUser(null as any)).not.toThrow();
		});

		it('handles errors with circular references', () => {
			const error: any = new Error('Circular error');
			error.circular = error;

			expect(() => categorizeError(error)).not.toThrow();
			expect(() => createErrorMessage(error)).not.toThrow();
			expect(() => formatErrorForUser(error)).not.toThrow();
		});

		it('handles non-Error objects', () => {
			const stringError = 'String error';
			const objectError = { message: 'Object error' };

			expect(() => categorizeError(stringError as any)).not.toThrow();
			expect(() => categorizeError(objectError as any)).not.toThrow();
		});
	});
});

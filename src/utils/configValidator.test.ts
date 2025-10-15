import { describe, expect, it } from 'vitest';
import { validateConfiguration } from './configValidator';

describe('Config Validator', () => {
	describe('validateConfiguration', () => {
		it('validates valid configuration', () => {
			const validConfig = {
				copyToClipboardEnabled: true,
				dedupeEnabled: false,
				notificationsLevel: 'important',
				postProcessOpenInNewFile: true,
				openResultsSideBySide: false,
				safetyEnabled: true,
				safetyFileSizeWarnBytes: 1000000,
				safetyLargeOutputLinesThreshold: 50000,
				safetyManyDocumentsThreshold: 8,
				analysisEnabled: true,
				analysisIncludeSecurity: true,
				analysisIncludeAccessibility: false,
				validationEnabled: true,
				validationTimeout: 5000,
				validationFollowRedirects: true,
			};

			const result = validateConfiguration(validConfig);
			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('validates boolean fields', () => {
			const config = {
				copyToClipboardEnabled: 'invalid',
				dedupeEnabled: true,
			};

			const result = validateConfiguration(config);
			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
		});

		it('validates string enum fields', () => {
			const config = {
				notificationsLevel: 'invalid-level',
			};

			const result = validateConfiguration(config);
			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
		});

		it('validates number fields', () => {
			const config = {
				safetyFileSizeWarnBytes: 'not-a-number',
			};

			const result = validateConfiguration(config);
			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
		});

		it('validates number ranges', () => {
			const config = {
				safetyFileSizeWarnBytes: -100,
			};

			const result = validateConfiguration(config);
			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
		});

		it('allows partial configuration', () => {
			const partialConfig = {
				copyToClipboardEnabled: true,
				notificationsLevel: 'silent',
			};

			expect(() => validateConfiguration(partialConfig)).not.toThrow();
		});

		it('validates notification levels', () => {
			const validLevels = ['all', 'important', 'silent'];

			for (const level of validLevels) {
				const config = { notificationsLevel: level };
				const result = validateConfiguration(config);
				expect(result.valid).toBe(true);
			}

			const invalidConfig = { notificationsLevel: 'invalid' };
			const result = validateConfiguration(invalidConfig);
			expect(result.valid).toBe(false);
		});

		it('validates safety thresholds', () => {
			const validConfig = {
				safetyFileSizeWarnBytes: 1000000,
				safetyLargeOutputLinesThreshold: 50000,
				safetyManyDocumentsThreshold: 8,
			};

			expect(() => validateConfiguration(validConfig)).not.toThrow();

			const invalidConfig = {
				safetyFileSizeWarnBytes: 0,
				safetyLargeOutputLinesThreshold: -1,
				safetyManyDocumentsThreshold: 0,
			};

			const result = validateConfiguration(invalidConfig);
			expect(result.valid).toBe(false);
		});

		it('validates timeout values', () => {
			const validConfig = {
				validationTimeout: 5000,
			};

			expect(() => validateConfiguration(validConfig)).not.toThrow();

			const invalidConfigs = [
				{ validationTimeout: 0 },
				{ validationTimeout: -1000 },
				{ validationTimeout: 'invalid' },
			];

			for (const config of invalidConfigs) {
				const result = validateConfiguration(config);
				expect(result.valid).toBe(false);
			}
		});

		it('handles empty configuration', () => {
			expect(() => validateConfiguration({})).not.toThrow();
		});

		it('handles null and undefined', () => {
			expect(() => validateConfiguration(null)).toThrow();
			expect(() => validateConfiguration(undefined)).toThrow();
		});

		it('validates nested object structure', () => {
			const configWithNested = {
				copyToClipboardEnabled: true,
				nested: {
					value: 'should be ignored',
				},
			};

			// Should validate known fields and ignore unknown ones
			const result = validateConfiguration(configWithNested);
			expect(result.valid).toBe(true);
		});

		it('validates array fields if present', () => {
			const configWithArray = {
				someArray: ['value1', 'value2'],
				copyToClipboardEnabled: true,
			};

			// Should ignore unknown fields
			const result = validateConfiguration(configWithArray);
			expect(result.valid).toBe(true);
		});

		it('provides meaningful error messages', () => {
			const invalidConfig = {
				copyToClipboardEnabled: 'not-boolean',
				notificationsLevel: 'invalid-level',
			};

			const result = validateConfiguration(invalidConfig);
			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
			expect(
				result.errors.some((error) => error.includes('notification')),
			).toBe(true);
		});

		it('validates complex configuration', () => {
			const complexConfig = {
				copyToClipboardEnabled: true,
				dedupeEnabled: false,
				notificationsLevel: 'important',
				postProcessOpenInNewFile: true,
				openResultsSideBySide: false,
				safetyEnabled: true,
				safetyFileSizeWarnBytes: 2000000,
				safetyLargeOutputLinesThreshold: 75000,
				safetyManyDocumentsThreshold: 12,
				analysisEnabled: true,
				analysisIncludeSecurity: true,
				analysisIncludeAccessibility: true,
				validationEnabled: true,
				validationTimeout: 10000,
				validationFollowRedirects: false,
				statusBarEnabled: true,
				telemetryEnabled: false,
				showParseErrors: true,
			};

			const result = validateConfiguration(complexConfig);
			expect(result.valid).toBe(true);
		});

		it('handles type coercion appropriately', () => {
			const configWithCoercion = {
				copyToClipboardEnabled: 1, // truthy number
				safetyFileSizeWarnBytes: '1000000', // string number
			};

			// Should validate based on actual types, not coerced types
			const result = validateConfiguration(configWithCoercion);
			expect(result.valid).toBe(false);
		});

		it('validates boundary values', () => {
			const boundaryConfig = {
				safetyFileSizeWarnBytes: 1, // minimum valid
				safetyLargeOutputLinesThreshold: 1, // minimum valid
				safetyManyDocumentsThreshold: 1, // minimum valid
				validationTimeout: 1000, // minimum reasonable
			};

			const result = validateConfiguration(boundaryConfig);
			expect(result.valid).toBe(true);
		});
	});
});

import { describe, expect, it } from 'vitest'
import { createConfiguration } from './config'

// Mock VS Code workspace
const mockWorkspace = {
	getConfiguration: () => ({
		get: (key: string, defaultValue: any) => {
			const config: Record<string, any> = {
				copyToClipboardEnabled: false,
				dedupeEnabled: false,
				notificationsLevel: 'silent',
				postProcessOpenInNewFile: false,
				openResultsSideBySide: false,
				safetyEnabled: true,
				safetyFileSizeWarnBytes: 1000000,
				safetyLargeOutputLinesThreshold: 50000,
				safetyManyDocumentsThreshold: 8,
				analysisEnabled: true,
				analysisIncludeSecurity: true,
				analysisIncludeAccessibility: true,
				validationEnabled: true,
				validationTimeout: 5000,
				validationFollowRedirects: true,
			}
			return config[key] ?? defaultValue
		},
	}),
}

// Mock vscode module
vi.mock('vscode', () => ({
	workspace: mockWorkspace,
}))

describe('Configuration', () => {
	describe('createConfiguration', () => {
		it('should create configuration with default values', () => {
			const config = createConfiguration()

			expect(config.copyToClipboardEnabled).toBe(false)
			expect(config.dedupeEnabled).toBe(false)
			expect(config.notificationsLevel).toBe('silent')
			expect(config.postProcessOpenInNewFile).toBe(false)
			expect(config.openResultsSideBySide).toBe(false)
			expect(config.safetyEnabled).toBe(true)
			expect(config.safetyFileSizeWarnBytes).toBe(1000000)
			expect(config.safetyLargeOutputLinesThreshold).toBe(50000)
			expect(config.safetyManyDocumentsThreshold).toBe(8)
			expect(config.analysisEnabled).toBe(true)
			expect(config.analysisIncludeSecurity).toBe(true)
			expect(config.analysisIncludeAccessibility).toBe(true)
			expect(config.validationEnabled).toBe(true)
			expect(config.validationTimeout).toBe(5000)
			expect(config.validationFollowRedirects).toBe(true)
		})

		it('should return frozen configuration object', () => {
			const config = createConfiguration()

			expect(Object.isFrozen(config)).toBe(true)
		})

		it('should handle custom configuration values', () => {
			const customWorkspace = {
				getConfiguration: () => ({
					get: (key: string, defaultValue: any) => {
						const customConfig: Record<string, any> = {
							copyToClipboardEnabled: true,
							dedupeEnabled: true,
							notificationsLevel: 'all',
							postProcessOpenInNewFile: true,
							openResultsSideBySide: true,
							safetyEnabled: false,
							safetyFileSizeWarnBytes: 2000000,
							safetyLargeOutputLinesThreshold: 100000,
							safetyManyDocumentsThreshold: 16,
							analysisEnabled: false,
							analysisIncludeSecurity: false,
							analysisIncludeAccessibility: false,
							validationEnabled: false,
							validationTimeout: 10000,
							validationFollowRedirects: false,
						}
						return customConfig[key] ?? defaultValue
					},
				}),
			}

			// Temporarily replace the mock
			vi.mocked(require('vscode')).workspace = customWorkspace

			const config = createConfiguration()

			expect(config.copyToClipboardEnabled).toBe(true)
			expect(config.dedupeEnabled).toBe(true)
			expect(config.notificationsLevel).toBe('all')
			expect(config.postProcessOpenInNewFile).toBe(true)
			expect(config.openResultsSideBySide).toBe(true)
			expect(config.safetyEnabled).toBe(false)
			expect(config.safetyFileSizeWarnBytes).toBe(2000000)
			expect(config.safetyLargeOutputLinesThreshold).toBe(100000)
			expect(config.safetyManyDocumentsThreshold).toBe(16)
			expect(config.analysisEnabled).toBe(false)
			expect(config.analysisIncludeSecurity).toBe(false)
			expect(config.analysisIncludeAccessibility).toBe(false)
			expect(config.validationEnabled).toBe(false)
			expect(config.validationTimeout).toBe(10000)
			expect(config.validationFollowRedirects).toBe(false)

			// Restore original mock
			vi.mocked(require('vscode')).workspace = mockWorkspace
		})

		it('should handle missing configuration keys', () => {
			const minimalWorkspace = {
				getConfiguration: () => ({
					get: (key: string, defaultValue: any) => defaultValue,
				}),
			}

			// Temporarily replace the mock
			vi.mocked(require('vscode')).workspace = minimalWorkspace

			const config = createConfiguration()

			expect(config.copyToClipboardEnabled).toBe(false)
			expect(config.dedupeEnabled).toBe(false)
			expect(config.notificationsLevel).toBe('silent')
			expect(config.postProcessOpenInNewFile).toBe(false)
			expect(config.openResultsSideBySide).toBe(false)
			expect(config.safetyEnabled).toBe(true)
			expect(config.safetyFileSizeWarnBytes).toBe(1000000)
			expect(config.safetyLargeOutputLinesThreshold).toBe(50000)
			expect(config.safetyManyDocumentsThreshold).toBe(8)
			expect(config.analysisEnabled).toBe(true)
			expect(config.analysisIncludeSecurity).toBe(true)
			expect(config.analysisIncludeAccessibility).toBe(true)
			expect(config.validationEnabled).toBe(true)
			expect(config.validationTimeout).toBe(5000)
			expect(config.validationFollowRedirects).toBe(true)

			// Restore original mock
			vi.mocked(require('vscode')).workspace = mockWorkspace
		})

		it('should handle invalid configuration values', () => {
			const invalidWorkspace = {
				getConfiguration: () => ({
					get: (key: string, defaultValue: any) => {
						const invalidConfig: Record<string, any> = {
							copyToClipboardEnabled: 'invalid',
							dedupeEnabled: null,
							notificationsLevel: 'invalid-level',
							safetyFileSizeWarnBytes: -1000,
							validationTimeout: 'invalid',
						}
						return invalidConfig[key] ?? defaultValue
					},
				}),
			}

			// Temporarily replace the mock
			vi.mocked(require('vscode')).workspace = invalidWorkspace

			const config = createConfiguration()

			// Should fall back to default values for invalid inputs
			expect(config.copyToClipboardEnabled).toBe(false)
			expect(config.dedupeEnabled).toBe(false)
			expect(config.notificationsLevel).toBe('silent')
			expect(config.safetyFileSizeWarnBytes).toBe(1000000)
			expect(config.validationTimeout).toBe(5000)

			// Restore original mock
			vi.mocked(require('vscode')).workspace = mockWorkspace
		})

		it('should maintain immutability of configuration', () => {
			const config = createConfiguration()

			// Attempting to modify should not work
			expect(() => {
				// @ts-expect-error - Testing immutability
				config.copyToClipboardEnabled = true
			}).toThrow()

			expect(() => {
				// @ts-expect-error - Testing immutability
				config.safetyFileSizeWarnBytes = 2000000
			}).toThrow()

			expect(() => {
				// @ts-expect-error - Testing immutability
				config.notificationsLevel = 'all'
			}).toThrow()
		})

		it('should handle edge case values', () => {
			const edgeCaseWorkspace = {
				getConfiguration: () => ({
					get: (key: string, defaultValue: any) => {
						const edgeConfig: Record<string, any> = {
							safetyFileSizeWarnBytes: 0,
							safetyLargeOutputLinesThreshold: 1,
							safetyManyDocumentsThreshold: 0,
							validationTimeout: 1,
						}
						return edgeConfig[key] ?? defaultValue
					},
				}),
			}

			// Temporarily replace the mock
			vi.mocked(require('vscode')).workspace = edgeCaseWorkspace

			const config = createConfiguration()

			expect(config.safetyFileSizeWarnBytes).toBe(0)
			expect(config.safetyLargeOutputLinesThreshold).toBe(1)
			expect(config.safetyManyDocumentsThreshold).toBe(0)
			expect(config.validationTimeout).toBe(1)

			// Restore original mock
			vi.mocked(require('vscode')).workspace = mockWorkspace
		})
	})
})

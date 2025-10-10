import * as vscode from 'vscode'
import type { Configuration } from '../types'

export function getConfiguration(): Configuration {
	const config = vscode.workspace.getConfiguration('urls-le')

	return Object.freeze({
		copyToClipboardEnabled: config.get<boolean>('copyToClipboardEnabled', false),
		dedupeEnabled: config.get<boolean>('dedupeEnabled', false),
		notificationsLevel: config.get<'all' | 'important' | 'silent'>('notificationsLevel', 'silent'),
		postProcessOpenInNewFile: config.get<boolean>('postProcess.openInNewFile', false),
		openResultsSideBySide: config.get<boolean>('openResultsSideBySide', false),
		safetyEnabled: config.get<boolean>('safety.enabled', true),
		safetyFileSizeWarnBytes: config.get<number>('safety.fileSizeWarnBytes', 1000000),
		safetyLargeOutputLinesThreshold: config.get<number>('safety.largeOutputLinesThreshold', 50000),
		safetyManyDocumentsThreshold: config.get<number>('safety.manyDocumentsThreshold', 8),
		showParseErrors: config.get<boolean>('showParseErrors', false),
		statusBarEnabled: config.get<boolean>('statusBar.enabled', true),
		telemetryEnabled: config.get<boolean>('telemetryEnabled', false),
		analysisEnabled: config.get<boolean>('analysis.enabled', true),
		analysisIncludeSecurity: config.get<boolean>('analysis.includeSecurity', true),
		analysisIncludeAccessibility: config.get<boolean>('analysis.includeAccessibility', true),
		validationEnabled: config.get<boolean>('validation.enabled', true),
		validationTimeout: config.get<number>('validation.timeout', 5000),
		validationFollowRedirects: config.get<boolean>('validation.followRedirects', true),
		performanceEnabled: config.get<boolean>('performance.enabled', true),
		performanceMaxDuration: config.get<number>('performance.maxDuration', 5000),
		performanceMaxMemoryUsage: config.get<number>('performance.maxMemoryUsage', 104857600),
		performanceMaxCpuUsage: config.get<number>('performance.maxCpuUsage', 1000000),
		performanceMinThroughput: config.get<number>('performance.minThroughput', 1000),
		performanceMaxCacheSize: config.get<number>('performance.maxCacheSize', 1000),
	})
}

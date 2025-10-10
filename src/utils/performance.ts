import * as vscode from 'vscode'
import type { UrlsLeError } from '../types'
import { createPerformanceError } from './errorHandling'

export interface PerformanceMetrics {
	readonly startTime: number
	readonly endTime: number
	readonly duration: number
	readonly memoryUsage: number
	readonly urlCount: number
	readonly fileSize: number
	readonly throughput: number
	readonly cpuUsage?: number
}

export interface PerformanceThresholds {
	readonly maxDuration: number
	readonly maxMemoryUsage: number
	readonly maxCpuUsage: number
	readonly minThroughput: number
	readonly maxCacheSize: number
}

export interface PerformanceTimer {
	readonly startTime: number
	readonly memoryStart: number
	readonly cpuStart?: number
}

export interface PerformanceMonitor {
	start(): PerformanceTimer
	end(timer: PerformanceTimer, urlCount: number, fileSize: number): PerformanceMetrics
	checkThresholds(metrics: PerformanceMetrics, thresholds: PerformanceThresholds): PerformanceCheckResult
	createProgressReporter(title: string, token: vscode.CancellationToken): ProgressReporter
}

export interface PerformanceCheckResult {
	readonly passed: boolean
	readonly warnings: readonly PerformanceWarning[]
	readonly errors: readonly UrlsLeError[]
}

export interface PerformanceWarning {
	readonly metric: string
	readonly value: number
	readonly threshold: number
	readonly severity: 'warning' | 'error'
	readonly message: string
}

export interface ProgressReporter {
	report(increment: number, message?: string): void
	isCancelled(): boolean
}

export interface PerformanceCache<K, V> {
	get(key: K): V | undefined
	set(key: K, value: V): void
	clear(): void
	size(): number
	has(key: K): boolean
	delete(key: K): boolean
}

export function createPerformanceMonitor(): PerformanceMonitor {
	return Object.freeze({
		start(): PerformanceTimer {
			const startTime = Date.now()
			const memoryStart = process.memoryUsage().heapUsed

			return Object.freeze({
				startTime,
				memoryStart,
				cpuStart: getCpuUsage(),
			})
		},

		end(timer: PerformanceTimer, urlCount: number, fileSize: number): PerformanceMetrics {
			const endTime = Date.now()
			const memoryEnd = process.memoryUsage().heapUsed
			const cpuEnd = getCpuUsage()

			const duration = endTime - timer.startTime
			const memoryUsage = memoryEnd - timer.memoryStart
			const throughput = urlCount / (duration / 1000) // URLs per second
			const cpuUsage = timer.cpuStart && cpuEnd ? cpuEnd - timer.cpuStart : undefined

			return Object.freeze({
				startTime: timer.startTime,
				endTime,
				duration,
				memoryUsage,
				urlCount,
				fileSize,
				throughput,
				cpuUsage,
			})
		},

		checkThresholds(metrics: PerformanceMetrics, thresholds: PerformanceThresholds): PerformanceCheckResult {
			const warnings: PerformanceWarning[] = []
			const errors: UrlsLeError[] = []

			// Check duration threshold
			if (metrics.duration > thresholds.maxDuration) {
				const warning: PerformanceWarning = {
					metric: 'duration',
					value: metrics.duration,
					threshold: thresholds.maxDuration,
					severity: 'warning',
					message: `Processing took ${metrics.duration}ms, exceeding threshold of ${thresholds.maxDuration}ms`,
				}
				warnings.push(warning)
			}

			// Check memory usage threshold
			if (metrics.memoryUsage > thresholds.maxMemoryUsage) {
				const warning: PerformanceWarning = {
					metric: 'memory',
					value: metrics.memoryUsage,
					threshold: thresholds.maxMemoryUsage,
					severity: 'warning',
					message: `Memory usage ${formatBytes(
						metrics.memoryUsage,
					)} exceeded threshold of ${formatBytes(thresholds.maxMemoryUsage)}`,
				}
				warnings.push(warning)
			}

			// Check CPU usage threshold
			if (metrics.cpuUsage && metrics.cpuUsage > thresholds.maxCpuUsage) {
				const warning: PerformanceWarning = {
					metric: 'cpu',
					value: metrics.cpuUsage,
					threshold: thresholds.maxCpuUsage,
					severity: 'warning',
					message: `CPU usage ${metrics.cpuUsage}ms exceeded threshold of ${thresholds.maxCpuUsage}ms`,
				}
				warnings.push(warning)
			}

			// Check throughput threshold
			if (metrics.throughput < thresholds.minThroughput) {
				const warning: PerformanceWarning = {
					metric: 'throughput',
					value: metrics.throughput,
					threshold: thresholds.minThroughput,
					severity: 'warning',
					message: `Throughput ${metrics.throughput.toFixed(2)} URLs/sec below threshold of ${
						thresholds.minThroughput
					} URLs/sec`,
				}
				warnings.push(warning)
			}

			// Convert critical warnings to errors
			for (const warning of warnings) {
				if (warning.severity === 'error') {
					const error = createPerformanceError(warning.message, {
						metric: warning.metric,
						value: warning.value,
						threshold: warning.threshold,
						recoverable: true,
						recoveryAction: 'user-action',
					})
					errors.push(error)
				}
			}

			return Object.freeze({
				passed: warnings.length === 0,
				warnings: Object.freeze(warnings),
				errors: Object.freeze(errors),
			})
		},

		createProgressReporter(_title: string, token: vscode.CancellationToken): ProgressReporter {
			return Object.freeze({
				report(_increment: number, _message?: string): void {
					// Progress reporting is handled by VS Code's withProgress
					// This is a placeholder for future implementation
				},
				isCancelled(): boolean {
					return token.isCancellationRequested
				},
			})
		},
	})
}

export function createPerformanceCache<K, V>(maxSize: number = 1000): PerformanceCache<K, V> {
	const cache = new Map<K, V>()
	const accessOrder = new Map<K, number>()
	let accessCounter = 0

	return Object.freeze({
		get(key: K): V | undefined {
			const value = cache.get(key)
			if (value !== undefined) {
				accessOrder.set(key, ++accessCounter)
			}
			return value
		},

		set(key: K, value: V): void {
			if (cache.size >= maxSize) {
				// Remove least recently used entry
				let oldestKey: K | undefined
				let oldestAccess = Infinity

				for (const [k, access] of accessOrder.entries()) {
					if (access < oldestAccess) {
						oldestAccess = access
						oldestKey = k
					}
				}

				if (oldestKey !== undefined) {
					cache.delete(oldestKey)
					accessOrder.delete(oldestKey)
				}
			}

			cache.set(key, value)
			accessOrder.set(key, ++accessCounter)
		},

		clear(): void {
			cache.clear()
			accessOrder.clear()
			accessCounter = 0
		},

		size(): number {
			return cache.size
		},

		has(key: K): boolean {
			return cache.has(key)
		},

		delete(key: K): boolean {
			const deleted = cache.delete(key)
			if (deleted) {
				accessOrder.delete(key)
			}
			return deleted
		},
	})
}

export function withProgress<T>(
	title: string,
	operation: (progress: ProgressReporter, token: vscode.CancellationToken) => Promise<T>,
): Promise<T> {
	return new Promise((resolve, reject) => {
		vscode.window.withProgress(
			{
				location: vscode.ProgressLocation.Notification,
				title,
				cancellable: true,
			},
			async (progress, token) => {
				try {
					const progressReporter: ProgressReporter = Object.freeze({
						report(increment: number, message?: string): void {
							progress.report({ increment, message })
						},
						isCancelled(): boolean {
							return token.isCancellationRequested
						},
					})

					const result = await operation(progressReporter, token)
					resolve(result)
				} catch (error) {
					reject(error)
				}
			},
		)
	})
}

export function withTimeout<T>(
	promise: Promise<T>,
	timeoutMs: number,
	errorMessage: string = `Operation timed out after ${timeoutMs}ms`,
): Promise<T> {
	return Promise.race([
		promise,
		new Promise<never>((_, reject) => {
			setTimeout(() => {
				reject(new Error(errorMessage))
			}, timeoutMs)
		}),
	])
}

export function withCancellation<T>(promise: Promise<T>, token: vscode.CancellationToken): Promise<T> {
	return new Promise((resolve, reject) => {
		const subscription = token.onCancellationRequested(() => {
			reject(new Error('Operation was cancelled'))
		})

		promise
			.then((result) => {
				subscription.dispose()
				resolve(result)
			})
			.catch((error) => {
				subscription.dispose()
				reject(error)
			})
	})
}

export function withPerformanceMonitoring<T>(
	operation: () => Promise<T>,
	monitor: PerformanceMonitor,
	thresholds: PerformanceThresholds,
	urlCount: number,
	fileSize: number,
): Promise<{ result: T; metrics: PerformanceMetrics; check: PerformanceCheckResult }> {
	return new Promise((resolve, reject) => {
		const timer = monitor.start()

		operation()
			.then((result) => {
				const metrics = monitor.end(timer, urlCount, fileSize)
				const check = monitor.checkThresholds(metrics, thresholds)
				resolve({ result, metrics, check })
			})
			.catch((error) => {
				const metrics = monitor.end(timer, urlCount, fileSize)
				const check = monitor.checkThresholds(metrics, thresholds)
				reject({ error, metrics, check })
			})
	})
}

export function formatBytes(bytes: number): string {
	if (bytes === 0) return '0 Bytes'

	const k = 1024
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
	const i = Math.floor(Math.log(bytes) / Math.log(k))

	return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
}

export function formatDuration(milliseconds: number): string {
	if (milliseconds < 1000) {
		return `${milliseconds}ms`
	}

	const seconds = Math.floor(milliseconds / 1000)
	const minutes = Math.floor(seconds / 60)
	const hours = Math.floor(minutes / 60)

	if (hours > 0) {
		return `${hours}h ${minutes % 60}m ${seconds % 60}s`
	} else if (minutes > 0) {
		return `${minutes}m ${seconds % 60}s`
	} else {
		return `${seconds}s`
	}
}

export function formatThroughput(throughput: number): string {
	if (throughput < 1) {
		return `${(throughput * 1000).toFixed(0)} URLs/min`
	} else if (throughput < 60) {
		return `${throughput.toFixed(2)} URLs/sec`
	} else {
		return `${(throughput * 60).toFixed(0)} URLs/min`
	}
}

export function getCpuUsage(): number | undefined {
	// This is a simplified CPU usage calculation
	// In a real implementation, you might use a library like 'cpu-stat'
	try {
		const usage = process.cpuUsage()
		return usage.user + usage.system
	} catch {
		return undefined
	}
}

export function createDefaultThresholds(): PerformanceThresholds {
	return Object.freeze({
		maxDuration: 5000, // 5 seconds
		maxMemoryUsage: 104857600, // 100MB
		maxCpuUsage: 1000000, // 1 second CPU time
		minThroughput: 1000, // 1000 URLs per second
		maxCacheSize: 1000, // 1000 cache entries
	})
}

export function createPerformanceReport(metrics: PerformanceMetrics): string {
	const report = [
		'# Performance Report',
		'',
		'## Metrics',
		`- **Duration**: ${formatDuration(metrics.duration)}`,
		`- **Memory Usage**: ${formatBytes(metrics.memoryUsage)}`,
		`- **URL Count**: ${metrics.urlCount}`,
		`- **File Size**: ${formatBytes(metrics.fileSize)}`,
		`- **Throughput**: ${formatThroughput(metrics.throughput)}`,
		'',
		'## Performance Analysis',
		`- **Processing Rate**: ${metrics.throughput.toFixed(2)} URLs/second`,
		`- **Memory Efficiency**: ${formatBytes(metrics.memoryUsage / metrics.urlCount)} per URL`,
		`- **Time Efficiency**: ${(metrics.duration / metrics.urlCount).toFixed(2)}ms per URL`,
	]

	if (metrics.cpuUsage) {
		report.push(`- **CPU Usage**: ${formatDuration(metrics.cpuUsage)}`)
	}

	return report.join('\n')
}

export function generatePerformanceReport(metrics: PerformanceMetrics[]): string {
	if (metrics.length === 0) {
		return '# Performance Report\n\nNo performance data available.'
	}

	const totalDuration = metrics.reduce((sum, m) => sum + m.duration, 0)
	const totalMemory = metrics.reduce((sum, m) => sum + m.memoryUsage, 0)
	const totalUrls = metrics.reduce((sum, m) => sum + m.urlCount, 0)
	const totalFileSize = metrics.reduce((sum, m) => sum + m.fileSize, 0)

	const avgDuration = totalDuration / metrics.length
	const avgMemory = totalMemory / metrics.length
	const avgThroughput = totalUrls / (totalDuration / 1000)

	const report = [
		'# Performance Report',
		'',
		'## Summary',
		`- **Total Operations**: ${metrics.length}`,
		`- **Total Duration**: ${formatDuration(totalDuration)}`,
		`- **Total Memory Usage**: ${formatBytes(totalMemory)}`,
		`- **Total URLs Processed**: ${totalUrls}`,
		`- **Total File Size**: ${formatBytes(totalFileSize)}`,
		'',
		'## Averages',
		`- **Average Duration**: ${formatDuration(avgDuration)}`,
		`- **Average Memory Usage**: ${formatBytes(avgMemory)}`,
		`- **Average Throughput**: ${formatThroughput(avgThroughput)}`,
		'',
		'## Individual Operations',
		'',
	]

	metrics.forEach((metric, index) => {
		report.push(`### Operation ${index + 1}`)
		report.push(`- Duration: ${formatDuration(metric.duration)}`)
		report.push(`- Memory: ${formatBytes(metric.memoryUsage)}`)
		report.push(`- URLs: ${metric.urlCount}`)
		report.push(`- Throughput: ${formatThroughput(metric.throughput)}`)
		report.push('')
	})

	return report.join('\n')
}

# URLs-LE Performance Guide

## Overview

URLs-LE is designed for high performance and efficient resource usage. This guide covers performance characteristics, optimization strategies, monitoring, and best practices for maintaining optimal performance.

## Performance Characteristics

### Extraction Performance

- **Small files (< 1MB)**: < 100ms
- **Medium files (1-10MB)**: < 500ms
- **Large files (> 10MB)**: < 2s with streaming
- **Memory usage**: < 50MB for typical operations

### Validation Performance

- **Single URL**: < 10ms
- **Batch validation**: < 100ms per URL
- **Network validation**: < 5s timeout
- **Caching**: 95% hit rate for repeated URLs

### Analysis Performance

- **Domain analysis**: < 50ms per 100 URLs
- **Pattern analysis**: < 100ms per 100 URLs
- **Security analysis**: < 200ms per 100 URLs
- **Accessibility analysis**: < 150ms per 100 URLs

## Performance Monitoring

### Built-in Monitoring

```typescript
export interface PerformanceMetrics {
  readonly operation: string
  readonly duration: number
  readonly inputSize: number
  readonly throughput: number
  readonly memoryUsage: number
  readonly cpuUsage: number
  readonly cacheHits: number
  readonly cacheMisses: number
  readonly errors: number
}

export interface PerformanceThresholds {
  readonly maxDuration: number
  readonly maxMemoryUsage: number
  readonly maxCpuUsage: number
  readonly minThroughput: number
  readonly maxCacheSize: number
}
```

### Performance Tracking

```typescript
export function createPerformanceTracker(
  operation: string,
  inputSize: number,
  monitor: PerformanceMonitor,
): PerformanceTracker {
  const startTime = Date.now()
  const startMemory = process.memoryUsage()

  return Object.freeze({
    end: () => {
      const endTime = Date.now()
      const endMemory = process.memoryUsage()

      const metrics = Object.freeze({
        operation,
        duration: endTime - startTime,
        inputSize,
        throughput: inputSize / (endTime - startTime),
        memoryUsage: endMemory.heapUsed - startMemory.heapUsed,
        cpuUsage: process.cpuUsage().user,
        cacheHits: 0,
        cacheMisses: 0,
        errors: 0,
      })

      monitor.recordMetrics(metrics)
      return metrics
    },
  })
}
```

### Performance Reports

```typescript
export function generatePerformanceReport(
  metrics: ReadonlyArray<PerformanceMetrics>,
): Readonly<PerformanceReport> {
  const totalDuration = metrics.reduce((sum, m) => sum + m.duration, 0)
  const averageDuration = totalDuration / metrics.length
  const totalThroughput = metrics.reduce((sum, m) => sum + m.throughput, 0)
  const averageMemoryUsage = metrics.reduce((sum, m) => sum + m.memoryUsage, 0) / metrics.length

  return Object.freeze({
    summary: Object.freeze({
      totalOperations: metrics.length,
      totalDuration,
      averageDuration,
      totalThroughput,
      averageMemoryUsage,
    }),
    recommendations: Object.freeze(generateRecommendations(metrics)),
    thresholds: Object.freeze(getPerformanceThresholds()),
  })
}
```

## Optimization Strategies

### Memory Optimization

#### Streaming Processing

```typescript
export function extractUrlsStreaming(
  content: string,
  format: string,
  config: Configuration,
): AsyncGenerator<Url, void, unknown> {
  const lines = content.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const urls = extractUrlsFromLine(line, format)

    for (const url of urls) {
      yield Object.freeze({
        ...url,
        line: i + 1,
      })
    }

    // Yield control to prevent blocking
    if (i % 1000 === 0) {
      await new Promise((resolve) => setImmediate(resolve))
    }
  }
}
```

#### Efficient Data Structures

```typescript
export function createUrlSet(): ReadonlySet<string> {
  return new Set<string>()
}

export function addUrlToSet(set: Set<string>, url: string): void {
  if (!set.has(url)) {
    set.add(url)
  }
}

export function getUniqueUrls(urls: ReadonlyArray<Url>): ReadonlyArray<Url> {
  const seen = new Set<string>()
  const unique: Url[] = []

  for (const url of urls) {
    if (!seen.has(url.value)) {
      seen.add(url.value)
      unique.push(url)
    }
  }

  return Object.freeze(unique)
}
```

#### Memory Cleanup

```typescript
export function cleanupResources(): void {
  // Clear caches
  clearUrlCache()
  clearValidationCache()

  // Force garbage collection if available
  if (global.gc) {
    global.gc()
  }

  // Log memory usage
  const memoryUsage = process.memoryUsage()
  console.log('Memory usage after cleanup:', memoryUsage)
}
```

### CPU Optimization

#### Efficient Regex Patterns

```typescript
// Pre-compiled regex patterns for better performance
const URL_PATTERNS = Object.freeze({
  markdown: /\[([^\]]+)\]\(([^)]+)\)/g,
  html: /<a[^>]+href=["']([^"']+)["'][^>]*>/gi,
  css: /url\(["']?([^"')]+)["']?\)/g,
  javascript: /["']([^"']*https?:\/\/[^"']*)["']/g,
})

export function extractUrlsWithPattern(content: string, pattern: RegExp): ReadonlyArray<Url> {
  const urls: Url[] = []
  let match: RegExpExecArray | null

  while ((match = pattern.exec(content)) !== null) {
    urls.push(
      Object.freeze({
        value: match[1] ?? '',
        line: getLineNumber(content, match.index ?? 0),
        column: getColumnNumber(content, match.index ?? 0),
        format: 'unknown',
      }),
    )
  }

  return Object.freeze(urls)
}
```

#### Caching Strategies

```typescript
export class UrlCache {
  private readonly cache = new Map<string, CachedResult>()
  private readonly maxSize: number

  constructor(maxSize = 1000) {
    this.maxSize = maxSize
  }

  get(key: string): CachedResult | undefined {
    const result = this.cache.get(key)
    if (result) {
      result.lastAccessed = Date.now()
      return result
    }
    return undefined
  }

  set(key: string, value: CachedResult): void {
    if (this.cache.size >= this.maxSize) {
      this.evictOldest()
    }

    this.cache.set(key, {
      ...value,
      lastAccessed: Date.now(),
    })
  }

  private evictOldest(): void {
    let oldestKey = ''
    let oldestTime = Date.now()

    for (const [key, value] of this.cache) {
      if (value.lastAccessed < oldestTime) {
        oldestTime = value.lastAccessed
        oldestKey = key
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey)
    }
  }
}
```

#### Parallel Processing

```typescript
export async function processUrlsInParallel(
  urls: ReadonlyArray<Url>,
  processor: (url: Url) => Promise<ProcessedUrl>,
  concurrency = 5,
): Promise<ReadonlyArray<ProcessedUrl>> {
  const results: ProcessedUrl[] = []
  const chunks = chunkArray(urls, concurrency)

  for (const chunk of chunks) {
    const chunkResults = await Promise.all(chunk.map(processor))
    results.push(...chunkResults)
  }

  return Object.freeze(results)
}

function chunkArray<T>(array: ReadonlyArray<T>, size: number): ReadonlyArray<ReadonlyArray<T>> {
  const chunks: T[][] = []

  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }

  return Object.freeze(chunks)
}
```

### Network Optimization

#### Request Batching

```typescript
export async function validateUrlsBatch(
  urls: ReadonlyArray<Url>,
  timeout = 5000,
): Promise<ReadonlyArray<ValidationResult>> {
  const results: ValidationResult[] = []
  const batchSize = 10

  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize)
    const batchResults = await Promise.allSettled(
      batch.map((url) => validateSingleUrl(url, timeout)),
    )

    for (const result of batchResults) {
      if (result.status === 'fulfilled') {
        results.push(result.value)
      } else {
        results.push(createErrorResult(result.reason))
      }
    }

    // Small delay between batches to prevent overwhelming servers
    if (i + batchSize < urls.length) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }

  return Object.freeze(results)
}
```

#### Connection Pooling

```typescript
export class ConnectionPool {
  private readonly connections = new Map<string, Connection>()
  private readonly maxConnections = 10

  async getConnection(hostname: string): Promise<Connection> {
    if (this.connections.has(hostname)) {
      return this.connections.get(hostname)!
    }

    if (this.connections.size >= this.maxConnections) {
      await this.closeOldestConnection()
    }

    const connection = await this.createConnection(hostname)
    this.connections.set(hostname, connection)
    return connection
  }

  private async closeOldestConnection(): Promise<void> {
    // Implementation for closing oldest connection
  }

  private async createConnection(hostname: string): Promise<Connection> {
    // Implementation for creating new connection
    return {} as Connection
  }
}
```

## Performance Testing

### Benchmark Tests

```typescript
// test/performance/benchmark.test.ts
import { describe, expect, it } from 'vitest'
import { extractUrls } from '../../src/extraction/extract'

describe('Performance Benchmarks', () => {
  it('should extract URLs from large markdown file', async () => {
    const largeContent = generateLargeMarkdownContent(10000) // 10k lines

    const startTime = Date.now()
    const result = await extractUrls(largeContent, 'markdown', createTestConfig())
    const duration = Date.now() - startTime

    expect(duration).toBeLessThan(2000) // Should complete in under 2 seconds
    expect(result.urls.length).toBeGreaterThan(0)
  })

  it('should handle memory efficiently', async () => {
    const initialMemory = process.memoryUsage().heapUsed

    for (let i = 0; i < 100; i++) {
      const content = generateTestContent(1000)
      await extractUrls(content, 'markdown', createTestConfig())
    }

    const finalMemory = process.memoryUsage().heapUsed
    const memoryIncrease = finalMemory - initialMemory

    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024) // Less than 50MB increase
  })
})
```

### Load Testing

```typescript
// test/performance/load.test.ts
import { describe, expect, it } from 'vitest'
import { validateUrls } from '../../src/utils/validation'

describe('Load Testing', () => {
  it('should handle concurrent URL validation', async () => {
    const urls = generateTestUrls(1000)
    const startTime = Date.now()

    const results = await Promise.all(Array.from({ length: 10 }, () => validateUrls(urls)))

    const duration = Date.now() - startTime

    expect(duration).toBeLessThan(10000) // Should complete in under 10 seconds
    expect(results).toHaveLength(10)
    expect(results[0]).toHaveLength(1000)
  })
})
```

### Memory Profiling

```typescript
// test/performance/memory.test.ts
import { describe, expect, it } from 'vitest'
import { extractUrls } from '../../src/extraction/extract'

describe('Memory Profiling', () => {
  it('should not leak memory during repeated operations', async () => {
    const content = generateTestContent(1000)
    const initialMemory = process.memoryUsage().heapUsed

    // Perform multiple operations
    for (let i = 0; i < 50; i++) {
      await extractUrls(content, 'markdown', createTestConfig())

      // Force garbage collection if available
      if (global.gc) {
        global.gc()
      }
    }

    const finalMemory = process.memoryUsage().heapUsed
    const memoryIncrease = finalMemory - initialMemory

    // Memory increase should be minimal
    expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024) // Less than 10MB
  })
})
```

## Performance Configuration

### Performance Settings

```json
{
  "urls-le.performance.enabled": true,
  "urls-le.performance.maxDuration": 5000,
  "urls-le.performance.maxMemoryUsage": 100000000,
  "urls-le.performance.maxCpuUsage": 500000,
  "urls-le.performance.minThroughput": 1000,
  "urls-le.performance.maxCacheSize": 1000
}
```

### Safety Thresholds

```json
{
  "urls-le.safety.enabled": true,
  "urls-le.safety.fileSizeWarnBytes": 1000000,
  "urls-le.safety.largeOutputLinesThreshold": 50000,
  "urls-le.safety.manyDocumentsThreshold": 8
}
```

## Performance Best Practices

### Development Guidelines

1. **Use efficient algorithms** for URL extraction and validation
2. **Implement caching** for repeated operations
3. **Use streaming** for large file processing
4. **Minimize memory allocations** in hot paths
5. **Profile regularly** to identify bottlenecks

### User Guidelines

1. **Enable safety checks** to prevent performance issues
2. **Use appropriate file sizes** for processing
3. **Configure timeouts** based on network conditions
4. **Monitor resource usage** during large operations
5. **Use cancellation** for long-running operations

### Monitoring Guidelines

1. **Track key metrics** (duration, memory, CPU)
2. **Set performance thresholds** based on requirements
3. **Monitor error rates** and recovery patterns
4. **Profile memory usage** regularly
5. **Test performance** under various conditions

## Troubleshooting Performance Issues

### Common Issues

- **Slow extraction**: Large files, complex patterns, inefficient algorithms
- **High memory usage**: Memory leaks, large datasets, inefficient data structures
- **Network timeouts**: Slow connections, server issues, incorrect timeout settings
- **CPU spikes**: Inefficient algorithms, lack of caching, excessive processing

### Solutions

- **Optimize algorithms** for better performance
- **Implement caching** to reduce repeated work
- **Use streaming** for large file processing
- **Adjust thresholds** based on system capabilities
- **Monitor resources** and implement limits

### Performance Debugging

```typescript
export function debugPerformance(operation: string): PerformanceDebugger {
  const startTime = Date.now()
  const startMemory = process.memoryUsage()

  return Object.freeze({
    end: () => {
      const endTime = Date.now()
      const endMemory = process.memoryUsage()

      console.log(`Performance Debug - ${operation}:`)
      console.log(`  Duration: ${endTime - startTime}ms`)
      console.log(`  Memory: ${endMemory.heapUsed - startMemory.heapUsed} bytes`)
      console.log(`  CPU: ${process.cpuUsage().user} microseconds`)
    },
  })
}
```

This performance guide provides comprehensive information for optimizing and monitoring URLs-LE performance, ensuring the extension remains fast and efficient across all use cases.

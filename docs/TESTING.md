# URLs-LE Testing Guide

## Overview

URLs-LE uses Vitest as its testing framework, providing fast, reliable testing for all components. This guide covers testing philosophy, structure, commands, and best practices.

## Testing Philosophy

### Test-Driven Development

- Write tests before implementing features
- Test edge cases and error conditions
- Maintain high test coverage
- Use tests as documentation

### Quality Assurance

- Comprehensive test coverage
- Performance testing
- Integration testing
- User experience testing

### Continuous Integration

- Automated test execution
- Coverage reporting
- Performance monitoring
- Quality gates

## Testing Framework

### Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    exclude: ['node_modules/**', 'dist/**'],
    coverage: {
      reporter: ['text', 'lcov'],
      include: [
        'src/extension.ts',
        'src/commands/**/*.ts',
        'src/config/**/*.ts',
        'src/extraction/**/*.ts',
        'src/telemetry/**/*.ts',
        'src/ui/**/*.ts',
        'src/utils/**/*.ts',
        'src/providers/**/*.ts',
      ],
      exclude: [
        'src/**/*.test.ts',
        'test/**',
        'dist/**',
        'src/__mocks__/**',
        'src/types.ts',
        'src/interfaces/**',
      ],
    },
  },
  resolve: {
    alias: {
      vscode: path.resolve(__dirname, 'src/__mocks__/vscode.ts'),
    },
  },
})
```

### Test Structure

```
src/
├── commands/
│   ├── extract.test.ts
│   ├── validate.test.ts
│   └── analyze.test.ts
├── config/
│   ├── config.test.ts
│   └── settings.test.ts
├── extraction/
│   ├── extract.test.ts
│   └── formats/
│       ├── markdown.test.ts
│       ├── html.test.ts
│       └── css.test.ts
├── utils/
│   ├── validation.test.ts
│   ├── analysis.test.ts
│   └── safety.test.ts
└── __mocks__/
    └── vscode.ts
```

## Test Types

### Unit Tests

Test individual functions and components in isolation.

```typescript
// src/utils/validation.test.ts
import { describe, expect, it } from 'vitest'
import { validateUrl } from './validation'

describe('URL Validation', () => {
  describe('validateUrl', () => {
    it('should validate valid HTTPS URLs', () => {
      const result = validateUrl('https://example.com')

      expect(result.isValid).toBe(true)
      expect(result.protocol).toBe('https:')
      expect(result.hostname).toBe('example.com')
    })

    it('should reject invalid URLs', () => {
      const result = validateUrl('not-a-url')

      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Invalid URL format')
    })

    it('should handle edge cases', () => {
      const result = validateUrl('')

      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Invalid URL format')
    })
  })
})
```

### Integration Tests

Test component interactions and workflows.

```typescript
// src/extraction/extract.test.ts
import { describe, expect, it } from 'vitest'
import { extractUrls } from './extract'
import { createTestConfig } from '../test-utils'

describe('URL Extraction Integration', () => {
  it('should extract URLs from markdown content', async () => {
    const content = `
      # Test Document
      [Link 1](https://example.com)
      ![Image](https://example.com/image.png)
      <https://example.com/direct>
    `

    const result = await extractUrls(content, 'markdown', createTestConfig())

    expect(result.urls).toHaveLength(3)
    expect(result.urls[0].value).toBe('https://example.com')
    expect(result.urls[1].value).toBe('https://example.com/image.png')
    expect(result.urls[2].value).toBe('https://example.com/direct')
  })

  it('should handle extraction errors gracefully', async () => {
    const content = 'Invalid content with malformed URLs'

    const result = await extractUrls(content, 'markdown', createTestConfig())

    expect(result.urls).toHaveLength(0)
    expect(result.errors).toBeDefined()
    expect(result.errors).toHaveLength(1)
  })
})
```

### Performance Tests

Test performance characteristics and limits.

```typescript
// src/extraction/performance.test.ts
import { describe, expect, it } from 'vitest'
import { extractUrls } from './extract'
import { generateLargeContent } from '../test-utils'

describe('Performance Tests', () => {
  it('should extract URLs from large content efficiently', async () => {
    const content = generateLargeContent(10000) // 10k lines
    const startTime = Date.now()

    const result = await extractUrls(content, 'markdown', createTestConfig())

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

    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024) // Less than 50MB
  })
})
```

## Test Utilities

### Mock VS Code API

```typescript
// src/__mocks__/vscode.ts
export const window = {
  activeTextEditor: undefined,
  showInformationMessage: () => Promise.resolve(''),
  showWarningMessage: () => Promise.resolve(''),
  showErrorMessage: () => Promise.resolve(''),
  withProgress: (options: any, task: any) => task({}, {}),
  createStatusBarItem: () => ({
    text: '',
    show: () => {},
    hide: () => {},
    dispose: () => {},
  }),
}

export const workspace = {
  getConfiguration: () => ({
    get: (key: string, defaultValue: any) => defaultValue,
  }),
  openTextDocument: () => Promise.resolve({}),
  applyEdit: () => Promise.resolve(true),
}

export const commands = {
  registerCommand: () => ({ dispose: () => {} }),
}

export const env = {
  clipboard: {
    writeText: () => Promise.resolve(),
  },
}
```

### Test Helpers

```typescript
// src/test-utils.ts
export function createTestConfig(): Configuration {
  return Object.freeze({
    copyToClipboardEnabled: false,
    dedupeEnabled: true,
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
  })
}

export function generateTestContent(lines: number): string {
  const content: string[] = []

  for (let i = 0; i < lines; i++) {
    content.push(`[Link ${i}](https://example.com/page${i})`)
  }

  return content.join('\n')
}

export function generateLargeContent(lines: number): string {
  const content: string[] = []

  for (let i = 0; i < lines; i++) {
    content.push(`# Section ${i}`)
    content.push(`[Link ${i}](https://example.com/page${i})`)
    content.push(`![Image ${i}](https://example.com/image${i}.png)`)
    content.push(`<https://example.com/direct${i}>`)
  }

  return content.join('\n')
}
```

## Test Commands

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npx vitest src/utils/validation.test.ts

# Run tests matching pattern
npx vitest --run validation

# Run tests in specific directory
npx vitest src/commands/
```

### Coverage Commands

```bash
# Generate coverage report
npm run test:coverage

# View coverage in browser
npx vitest --coverage --ui

# Generate LCOV report
npx vitest --coverage --reporter=lcov
```

### Performance Commands

```bash
# Run performance tests
npm run test:performance

# Generate performance report
npm run performance:report

# Benchmark specific functions
npx vitest --run performance
```

## Test Coverage

### Coverage Requirements

- **Minimum**: 80% overall coverage
- **Critical**: 95% coverage for core functions
- **New Code**: 100% coverage for new features
- **Branches**: 90% branch coverage

### Coverage Reports

```bash
# Generate text coverage report
npm run test:coverage

# Generate HTML coverage report
npx vitest --coverage --reporter=html

# Generate LCOV report for CI
npx vitest --coverage --reporter=lcov
```

### Coverage Exclusions

```typescript
// Files excluded from coverage
exclude: [
  'src/**/*.test.ts',
  'test/**',
  'dist/**',
  'src/__mocks__/**',
  'src/types.ts',
  'src/interfaces/**',
]
```

## Test Data

### Test Fixtures

```typescript
// test/fixtures/markdown/basic.md
# Test Document
[Link 1](https://example.com)
![Image](https://example.com/image.png)
<https://example.com/direct>

// test/fixtures/html/basic.html
<!DOCTYPE html>
<html>
<head>
  <link href="https://example.com/style.css" rel="stylesheet">
</head>
<body>
  <a href="https://example.com">Link</a>
  <img src="https://example.com/image.png" alt="Image">
</body>
</html>
```

### Test Data Generation

```typescript
export function generateTestUrls(count: number): ReadonlyArray<Url> {
  const urls: Url[] = []

  for (let i = 0; i < count; i++) {
    urls.push(
      Object.freeze({
        value: `https://example.com/page${i}`,
        line: i + 1,
        column: 1,
        format: 'markdown',
      }),
    )
  }

  return Object.freeze(urls)
}

export function generateInvalidUrls(count: number): ReadonlyArray<string> {
  const urls: string[] = []

  for (let i = 0; i < count; i++) {
    urls.push(`invalid-url-${i}`)
  }

  return Object.freeze(urls)
}
```

## Error Testing

### Error Scenarios

```typescript
describe('Error Handling', () => {
  it('should handle parse errors gracefully', async () => {
    const content = 'Malformed content with invalid syntax'

    const result = await extractUrls(content, 'markdown', createTestConfig())

    expect(result.errors).toBeDefined()
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].category).toBe('parse')
  })

  it('should handle validation errors', async () => {
    const content = '[Link](invalid-url)'

    const result = await extractUrls(content, 'markdown', createTestConfig())

    expect(result.urls).toHaveLength(1)
    expect(result.urls[0].value).toBe('invalid-url')
  })

  it('should handle safety errors', async () => {
    const content = generateLargeContent(100000) // Very large content

    const result = await extractUrls(content, 'markdown', createTestConfig())

    expect(result.errors).toBeDefined()
    expect(result.errors.some((e) => e.category === 'safety')).toBe(true)
  })
})
```

### Recovery Testing

```typescript
describe('Recovery Mechanisms', () => {
  it('should recover from transient errors', async () => {
    const content = 'Content with temporary issues'

    const result = await extractUrls(content, 'markdown', createTestConfig())

    expect(result.urls).toBeDefined()
    expect(result.errors).toBeDefined()
  })

  it('should provide fallback options', async () => {
    const content = 'Content requiring fallback processing'

    const result = await extractUrls(content, 'markdown', createTestConfig())

    expect(result.urls).toBeDefined()
    expect(result.errors).toBeDefined()
  })
})
```

## Continuous Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Generate coverage
        run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

### Quality Gates

- **Tests**: All tests must pass
- **Coverage**: Minimum 80% coverage
- **Performance**: Performance tests must pass
- **Linting**: No linting errors

## Best Practices

### Test Writing

1. **Arrange-Act-Assert**: Structure tests clearly
2. **Descriptive Names**: Use descriptive test names
3. **Single Responsibility**: Test one thing per test
4. **Edge Cases**: Test edge cases and error conditions
5. **Mocking**: Mock external dependencies

### Test Organization

1. **Group Related Tests**: Use describe blocks
2. **Logical Order**: Order tests logically
3. **Setup/Teardown**: Use beforeEach/afterEach
4. **Test Data**: Use consistent test data
5. **Documentation**: Comment complex tests

### Performance Testing

1. **Benchmarks**: Establish performance benchmarks
2. **Memory Testing**: Test memory usage
3. **Load Testing**: Test under load
4. **Regression Testing**: Prevent performance regressions
5. **Monitoring**: Monitor performance metrics

This testing guide ensures URLs-LE maintains high quality and reliability through comprehensive testing practices.

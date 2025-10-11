# URLs-LE Testing Guide

## Framework

Vitest with V8 coverage provider. Target 80% minimum coverage across all metrics.

### Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      threshold: {
        global: { branches: 80, functions: 80, lines: 80, statements: 80 },
      },
    },
  },
  resolve: {
    alias: {
      vscode: path.resolve(__dirname, 'src/__mocks__/vscode.ts'),
    },
  },
})
```

## Test Organization

```
src/
├── commands/
│   ├── extract.test.ts
│   ├── validate.test.ts
│   └── analyze.test.ts
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

## Test Categories

### Unit Tests

Pure function validation:

```typescript
describe('URL Validation', () => {
  it('validates HTTPS URLs', () => {
    const result = validateUrl('https://example.com')

    expect(result.isValid).toBe(true)
    expect(result.protocol).toBe('https:')
    expect(result.hostname).toBe('example.com')
  })

  it('validates HTTP URLs', () => {
    const result = validateUrl('http://example.com/path')

    expect(result.isValid).toBe(true)
    expect(result.pathname).toBe('/path')
  })

  it('rejects invalid URLs', () => {
    const result = validateUrl('not-a-url')

    expect(result.isValid).toBe(false)
    expect(result.error).toBe('Invalid URL format')
  })

  it('handles edge cases', () => {
    expect(validateUrl('')).toHaveProperty('isValid', false)
    expect(validateUrl(' ')).toHaveProperty('isValid', false)
  })
})
```

### Integration Tests

Workflow validation:

```typescript
describe('URL Extraction Integration', () => {
  it('extracts URLs from markdown', async () => {
    const content = `
      # Document
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

  it('handles extraction errors gracefully', async () => {
    const content = 'Invalid markdown with malformed [link'

    const result = await extractUrls(content, 'markdown', createTestConfig())

    expect(result.urls).toHaveLength(0)
    expect(result.errors).toBeDefined()
  })
})
```

### Performance Tests

Resource usage validation:

```typescript
describe('Performance', () => {
  it('extracts 10k URLs within 2 seconds', async () => {
    const content = generateLargeContent(10000) // 10k lines
    const start = Date.now()

    const result = await extractUrls(content, 'markdown', createTestConfig())

    expect(Date.now() - start).toBeLessThan(2000)
    expect(result.urls.length).toBeGreaterThan(0)
  })

  it('handles memory efficiently', async () => {
    const initial = process.memoryUsage().heapUsed

    for (let i = 0; i < 100; i++) {
      await extractUrls(generateTestContent(1000), 'markdown', createTestConfig())
    }

    const used = process.memoryUsage().heapUsed - initial
    expect(used).toBeLessThan(50 * 1024 * 1024) // Less than 50MB
  })
})
```

## Test Utilities

### Mock VS Code

```typescript
// __mocks__/vscode.ts
export const window = {
  activeTextEditor: undefined,
  showInformationMessage: vi.fn(() => Promise.resolve('')),
  showWarningMessage: vi.fn(() => Promise.resolve('')),
  createStatusBarItem: vi.fn(() => ({
    text: '',
    show: vi.fn(),
    hide: vi.fn(),
    dispose: vi.fn(),
  })),
  withProgress: vi.fn((opts, task) => task({}, {})),
}

export const workspace = {
  getConfiguration: vi.fn(() => ({
    get: vi.fn((key, defaultValue) => defaultValue),
  })),
}

export const env = {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve()),
  },
}
```

### Test Helpers

```typescript
export function createTestConfig(): Configuration {
  return Object.freeze({
    copyToClipboardEnabled: false,
    dedupeEnabled: true,
    notificationsLevel: 'silent',
    safetyEnabled: true,
    safetyFileSizeWarnBytes: 1000000,
    analysisEnabled: true,
    validationEnabled: true,
  })
}

export function generateTestContent(lines: number): string {
  const urls: string[] = []

  for (let i = 0; i < lines; i++) {
    urls.push(`[Link ${i}](https://example.com/page${i})`)
  }

  return urls.join('\n')
}

export function generateLargeContent(lines: number): string {
  const content: string[] = []

  for (let i = 0; i < lines; i++) {
    content.push(`# Section ${i}`)
    content.push(`[Link](https://example.com/page${i})`)
    content.push(`![Image](https://example.com/image${i}.png)`)
  }

  return content.join('\n')
}
```

## Running Tests

```bash
npm test                       # Run all tests
npm run test:watch             # Watch mode
npm run test:coverage          # Generate coverage report
npx vitest src/utils/validation.test.ts  # Specific file
npx vitest --run validation    # Pattern match
npx vitest --ui                # Visual test UI
```

## Coverage Requirements

- **Minimum**: 80% across all metrics
- **Critical Paths**: 95% for extraction and validation functions
- **New Features**: 100% coverage required
- **Reports**: HTML reports in `coverage/` directory

## Performance Benchmarks

| Input | URLs | Max Duration | Max Memory | Throughput    |
| ----- | ---- | ------------ | ---------- | ------------- |
| 1KB   | ~10  | 10ms         | 1MB        | 1,000 URLs/s  |
| 100KB | ~1K  | 100ms        | 10MB       | 10,000 URLs/s |
| 1MB   | ~10K | 1s           | 50MB       | 10,000 URLs/s |

## Quality Assurance

### Test Writing Principles

1. **Arrange-Act-Assert**: Clear three-phase structure
2. **Single Responsibility**: One behavior per test
3. **Independence**: Tests run in any order
4. **Speed**: Under 100ms per test
5. **Descriptive**: Meaningful test names

### Error Testing

```typescript
describe('Error Handling', () => {
  it('handles parse errors gracefully', async () => {
    const content = 'Malformed markdown [link'

    const result = await extractUrls(content, 'markdown', createTestConfig())

    expect(result.errors).toBeDefined()
    expect(result.errors[0].category).toBe('parse')
  })

  it('handles validation errors', async () => {
    const content = '[Bad Link](invalid-url)'

    const result = await extractUrls(content, 'markdown', createTestConfig())

    expect(result.urls[0].value).toBe('invalid-url')
  })

  it('handles safety errors', async () => {
    const content = generateLargeContent(100000)

    const result = await extractUrls(content, 'markdown', createTestConfig())

    expect(result.errors.some((e) => e.category === 'safety')).toBe(true)
  })
})
```

### Recovery Testing

```typescript
describe('Recovery Mechanisms', () => {
  it('recovers from transient errors', async () => {
    const content = 'Content with [valid](https://example.com) and [invalid](bad) links'

    const result = await extractUrls(content, 'markdown', createTestConfig())

    expect(result.urls).toHaveLength(2)
    expect(result.errors).toHaveLength(0)
  })
})
```

## Format-Specific Tests

### Markdown Tests

```typescript
describe('Markdown Extraction', () => {
  it('extracts inline links', () => {
    const content = '[text](https://example.com)'
    expect(extractUrls(content, 'markdown').urls).toHaveLength(1)
  })

  it('extracts image URLs', () => {
    const content = '![alt](https://example.com/img.png)'
    expect(extractUrls(content, 'markdown').urls[0].type).toBe('image')
  })

  it('extracts autolinks', () => {
    const content = '<https://example.com>'
    expect(extractUrls(content, 'markdown').urls).toHaveLength(1)
  })
})
```

### HTML Tests

```typescript
describe('HTML Extraction', () => {
  it('extracts anchor hrefs', () => {
    const content = '<a href="https://example.com">Link</a>'
    expect(extractUrls(content, 'html').urls).toHaveLength(1)
  })

  it('extracts image sources', () => {
    const content = '<img src="https://example.com/img.png">'
    expect(extractUrls(content, 'html').urls[0].type).toBe('image')
  })
})
```

## Continuous Integration

GitHub Actions runs tests on every push:

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
```

---

**Related:** [Architecture](ARCHITECTURE.md) | [Performance](PERFORMANCE.md) | [Development](DEVELOPMENT.md)

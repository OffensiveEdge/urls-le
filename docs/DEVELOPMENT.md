# URLs-LE Development Guide

## Overview

This guide provides comprehensive information for developing, testing, and contributing to URLs-LE. It covers the development environment setup, coding standards, testing procedures, and contribution guidelines.

## Development Environment Setup

### Prerequisites

- **Node.js**: >= 20.0.0
- **VS Code**: >= 1.105.0
- **Git**: Latest version
- **TypeScript**: ^5.9.3

### Project Structure

```
urls-le/
├── src/                    # Source code
│   ├── commands/          # Command implementations
│   ├── config/            # Configuration management
│   ├── extraction/        # URL extraction logic
│   ├── providers/         # VS Code providers
│   ├── telemetry/         # Telemetry and logging
│   ├── ui/               # User interface components
│   ├── utils/             # Utility functions
│   ├── types.ts          # Type definitions
│   └── extension.ts      # Extension entry point
├── docs/                 # Documentation
├── test/                 # Test files
├── package.json          # Project configuration
├── tsconfig.json         # TypeScript configuration
├── vitest.config.ts      # Test configuration
└── biome.json           # Linting configuration
```

### Installation

```bash
# Clone the repository
git clone https://github.com/nolindnaidoo/urls-le.git
cd urls-le

# Install dependencies
npm install

# Build the extension
npm run build

# Run tests
npm test
```

## Coding Standards

### TypeScript Guidelines

#### Strict TypeScript Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": false
  }
}
```

#### Type Safety

- Use `readonly` types for immutable data
- Apply `Object.freeze()` to exported objects
- Explicit return type annotations
- Null safety with optional chaining (`?.`)
- Type guards for runtime type checking

#### Example Type Definitions

```typescript
export interface Url {
  readonly value: string
  readonly line: number
  readonly column: number
  readonly context?: string
  readonly format: string
}

export interface UrlExtractionResult {
  readonly urls: ReadonlyArray<Url>
  readonly totalCount: number
  readonly format: string
  readonly timestamp: number
  readonly errors?: ReadonlyArray<ExtractionError>
}
```

### Functional Programming Patterns

#### Immutability

```typescript
// Good: Immutable data structures
export function createUrl(value: string, line: number, column: number): Readonly<Url> {
  return Object.freeze({
    value,
    line,
    column,
    format: 'unknown',
  })
}

// Bad: Mutable data structures
export function createUrl(value: string, line: number, column: number): Url {
  return {
    value,
    line,
    column,
    format: 'unknown',
  }
}
```

#### Pure Functions

```typescript
// Good: Pure function with explicit return type
export function validateUrl(url: string): Readonly<ValidationResult> {
  try {
    const urlObj = new URL(url)
    return Object.freeze({
      isValid: true,
      protocol: urlObj.protocol,
      hostname: urlObj.hostname,
      pathname: urlObj.pathname,
    })
  } catch {
    return Object.freeze({
      isValid: false,
      error: 'Invalid URL format',
    })
  }
}

// Bad: Function with side effects
export function validateUrl(url: string): ValidationResult {
  console.log('Validating URL:', url) // Side effect
  // ... validation logic
}
```

#### Factory Functions

```typescript
// Good: Factory function for component creation
export function createExtractCommand(deps: CommandDependencies): Command {
  return async () => {
    const editor = vscode.window.activeTextEditor
    if (!editor) {
      deps.notifier.warning('No active editor found')
      return
    }
    // ... command logic
  }
}

// Bad: Class-based approach
export class ExtractCommand {
  constructor(private deps: CommandDependencies) {}

  async execute(): Promise<void> {
    // ... command logic
  }
}
```

### Error Handling

#### Error Categories

```typescript
export enum ErrorCategory {
  PARSE = 'parse',
  VALIDATION = 'validation',
  SAFETY = 'safety',
  NETWORK = 'network',
  FILE_SYSTEM = 'file-system',
  CONFIGURATION = 'configuration',
  OPERATIONAL = 'operational',
}

export interface CategorizedError {
  readonly category: ErrorCategory
  readonly severity: 'low' | 'medium' | 'high'
  readonly recoverable: boolean
  readonly message: string
  readonly suggestion?: string
  readonly action?: string
}
```

#### Error Handling Pattern

```typescript
export function handleError(error: Error, context: string): Readonly<ErrorResult> {
  const categorized = categorizeError(error)
  const recovery = getRecoveryOptions(categorized)

  return Object.freeze({
    categorized,
    recovery,
    context,
    timestamp: Date.now(),
  })
}
```

### Performance Considerations

#### Safety Checks

```typescript
export function shouldCancelOperation(
  processedItems: number,
  threshold: number,
  startTime: number,
  maxTimeMs: number,
): boolean {
  const elapsed = Date.now() - startTime
  return processedItems > threshold || elapsed > maxTimeMs
}
```

#### Progress Indicators

```typescript
export async function extractUrlsWithProgress(
  content: string,
  format: string,
  config: Configuration,
  token?: vscode.CancellationToken,
): Promise<UrlExtractionResult> {
  return vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Extracting URLs...',
      cancellable: true,
    },
    async (progress, cancellationToken) => {
      // ... extraction logic with progress updates
    },
  )
}
```

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

### Test Commands

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
```

## Localization

### Adding New Strings

#### 1. Add to Runtime Localization

```json
// src/i18n/runtime.json
{
  "runtime.extract.progress": "Extracting URLs...",
  "runtime.extract.success": "Extracted {0} URLs",
  "runtime.extract.error": "Error extracting URLs: {0}"
}
```

#### 2. Add to Manifest Localization

```json
// src/i18n/package.nls.json
{
  "manifest.command.extract.title": "Extract URLs",
  "manifest.command.category": "URLs-LE",
  "manifest.settings.title": "URLs-LE Settings"
}
```

#### 3. Use in Code

```typescript
import * as nls from 'vscode-nls'

const localize = nls.config({ messageFormat: nls.MessageFormat.file })()

export function showExtractionProgress(count: number): void {
  const message = localize('runtime.extract.progress', 'Extracting URLs...')
  vscode.window.showInformationMessage(message)
}

export function showExtractionSuccess(count: number): void {
  const message = localize('runtime.extract.success', 'Extracted {0} URLs', count)
  vscode.window.showInformationMessage(message)
}
```

### String Formatting

```typescript
// Simple string
localize('runtime.extract.progress', 'Extracting URLs...')

// String with parameters
localize('runtime.extract.success', 'Extracted {0} URLs', count)

// String with multiple parameters
localize('runtime.extract.details', 'Extracted {0} URLs from {1} lines', count, lines)

// String with named parameters
localize('runtime.extract.named', 'Extracted {count} URLs from {lines} lines', { count, lines })
```

## Building and Packaging

### Build Commands

```bash
# Build TypeScript
npm run build

# Watch mode for development
npm run watch

# Clean build artifacts
npm run clean

# Package extension
npm run package

# Publish extension
npm run publish
```

### Build Process

1. **TypeScript Compilation**: `tsc -p ./`
2. **Copy Localization**: `cp src/i18n/package.nls.json .`
3. **Package Extension**: `vsce package`
4. **Clean Artifacts**: Remove temporary files

### Package Configuration

```json
{
  "scripts": {
    "build": "tsc -p ./",
    "clean": "rm -rf dist coverage release/*.vsix",
    "clean:i18n": "rm -rf package.nls.*.json vsix/",
    "copy:i18n": "cp src/i18n/package.nls.json .",
    "watch": "tsc -watch -p ./",
    "test": "vitest run --pool=threads",
    "test:watch": "vitest --pool=threads",
    "test:coverage": "vitest run --coverage --pool=threads",
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "vscode:prepublish": "npm run build && npm run copy:i18n",
    "package": "npm run clean:i18n && mkdir -p release && npx vsce package --out release/${npm_package_name}-${npm_package_version}.vsix && npm run clean:i18n"
  }
}
```

## Linting and Formatting

### Biome Configuration

```json
{
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedVariables": "error",
        "noUnusedFunctionParameters": "warn"
      },
      "suspicious": {
        "noImplicitAnyLet": "off",
        "noAssignInExpressions": "off",
        "noExplicitAny": "warn"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  }
}
```

### Linting Commands

```bash
# Check for linting errors
npm run lint

# Fix linting errors automatically
npm run lint:fix

# Check specific files
npx biome check src/utils/validation.ts

# Format specific files
npx biome format --write src/utils/validation.ts
```

## Debugging

### VS Code Debug Configuration

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Run Extension",
      "type": "extensionHost",
      "request": "launch",
      "args": ["--extensionDevelopmentPath=${workspaceFolder}"],
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "preLaunchTask": "npm: build"
    },
    {
      "name": "Extension Tests",
      "type": "extensionHost",
      "request": "launch",
      "args": ["--extensionDevelopmentPath=${workspaceFolder}", "--extensionTestsPath=${workspaceFolder}/dist/test/suite/index"]],
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "preLaunchTask": "npm: build"
    }
  ]
}
```

### Debugging Tips

- Use `console.log` for debugging (removed in production builds)
- Set breakpoints in TypeScript source files
- Use VS Code's debug console for variable inspection
- Enable source maps for accurate debugging

## Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** changes following coding standards
4. **Write** tests for new functionality
5. **Run** tests and linting
6. **Submit** a pull request

### Pull Request Guidelines

- Include tests for new functionality
- Update documentation as needed
- Follow existing code style
- Ensure all tests pass
- Address review feedback

### Code Review Checklist

- [ ] Code follows TypeScript best practices
- [ ] Functions are pure and immutable
- [ ] Error handling is comprehensive
- [ ] Tests cover new functionality
- [ ] Documentation is updated
- [ ] Performance considerations addressed
- [ ] Security implications considered

## Performance Optimization

### Memory Management

- Use streaming for large files
- Implement proper cleanup
- Avoid memory leaks
- Monitor memory usage

### CPU Optimization

- Use efficient algorithms
- Implement caching where appropriate
- Minimize unnecessary computations
- Use background processing

### Network Optimization

- Implement request timeouts
- Use connection pooling
- Cache network responses
- Handle network errors gracefully

## Security Considerations

### Input Validation

- Validate all user inputs
- Sanitize file paths
- Check URL formats
- Limit resource usage

### Privacy Protection

- No external data transmission
- Local-only telemetry
- User data protection
- Configurable privacy settings

### Error Handling

- Don't expose sensitive information
- Provide user-friendly error messages
- Log errors securely
- Implement proper recovery

This development guide provides comprehensive information for contributing to URLs-LE, ensuring consistent code quality and maintainability across the project.

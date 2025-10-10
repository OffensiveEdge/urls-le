# URLs-LE Architecture

## Overview

URLs-LE is a VS Code extension designed for lightweight, unobtrusive URL extraction and validation from documentation, configuration files, and code. Built with functional programming principles and TypeScript best practices, it provides developers with fast, reliable tools for URL discovery and analysis.

## Core Principles

### Functional Programming

- **Immutability**: All data structures use `readonly` types and `Object.freeze()`
- **Pure Functions**: Functions have no side effects and explicit return types
- **Factory Functions**: Component creation through factory functions instead of classes
- **Dependency Injection**: Components receive dependencies via parameter objects

### Performance & Safety

- **Lightweight**: Minimal resource usage and fast execution
- **Safety Checks**: Built-in protection against large files and resource exhaustion
- **Cancellation Support**: Operations can be cancelled for responsiveness
- **Memory Efficiency**: Streaming and chunked processing for large datasets

### Developer Experience

- **Unobtrusive**: Silent by default, configurable notifications
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Accessible**: Keyboard navigation and screen reader support
- **Localized**: Full internationalization support

## Architecture Components

### 1. Extension Activation (`src/extension.ts`)

```typescript
export function activate(context: vscode.ExtensionContext): void {
  const telemetry = createTelemetry()
  const notifier = createNotifier()
  const statusBar = createStatusBar(context)

  registerCommands(context, { telemetry, notifier, statusBar })
  registerOpenSettingsCommand(context, telemetry)
  registerCodeActions(context)

  telemetry.event('extension-activated')
}
```

**Responsibilities:**

- Minimal activation logic
- Dependency injection setup
- Component registration
- Telemetry initialization

### 2. Command System (`src/commands/`)

```typescript
export function registerCommands(
  context: vscode.ExtensionContext,
  deps: Readonly<CommandDependencies>,
): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('urls-le.extractUrls', createExtractCommand(deps)),
  )
}
```

**Commands:**

- `extractUrls`: Main extraction command
- `validate`: URL validation and accessibility checks
- `checkAccessibility`: Accessibility analysis
- `analyze`: Pattern and security analysis
- `help`: Documentation and usage help

**Pattern:**

- Factory functions for command creation
- Progress indicators for long operations
- Error handling with user feedback
- Cancellation token support

### 3. Configuration Management (`src/config/`)

```typescript
export function createConfiguration(): Readonly<Configuration> {
  const config = vscode.workspace.getConfiguration('urls-le')

  return Object.freeze({
    copyToClipboardEnabled: config.get('copyToClipboardEnabled', false),
    dedupeEnabled: config.get('dedupeEnabled', false),
    // ... other settings
  })
}
```

**Features:**

- Frozen configuration objects
- Real-time configuration changes
- Type-safe settings access
- Default value handling

### 4. URL Extraction (`src/extraction/`)

```typescript
export function extractUrls(
  content: string,
  format: string,
  config: Readonly<Configuration>,
): Readonly<UrlExtractionResult> {
  const extractor = getExtractor(format)
  const urls = extractor.extract(content)

  return Object.freeze({
    urls: urls.map((url) => Object.freeze(url)),
    totalCount: urls.length,
    format,
    timestamp: Date.now(),
  })
}
```

**Supported Formats:**

- **Markdown**: `[text](url)`, `![alt](url)`, `<url>`
- **HTML**: `<a href="">`, `<img src="">`, `<link href="">`
- **CSS**: `url()`, `@import`, `background-image`
- **JavaScript/TypeScript**: String literals, template literals
- **JSON**: String values matching URL patterns
- **YAML**: String values and URL-specific keys

**Extraction Process:**

1. Format detection and validation
2. Pattern matching with regex
3. URL validation and normalization
4. Deduplication and sorting
5. Result formatting and analysis

### 5. URL Validation (`src/utils/validation.ts`)

```typescript
export function validateUrl(url: string): Readonly<ValidationResult> {
  try {
    const urlObj = new URL(url)
    return Object.freeze({
      isValid: true,
      protocol: urlObj.protocol,
      hostname: urlObj.hostname,
      pathname: urlObj.pathname,
      // ... other components
    })
  } catch {
    return Object.freeze({
      isValid: false,
      error: 'Invalid URL format',
    })
  }
}
```

**Validation Features:**

- Format validation using `URL` constructor
- Protocol validation (http, https, ftp, etc.)
- Domain validation and normalization
- Path validation and sanitization
- Query parameter analysis
- Fragment handling

### 6. URL Analysis (`src/utils/analysis.ts`)

```typescript
export function analyzeUrls(urls: ReadonlyArray<Url>): Readonly<AnalysisResult> {
  const domains = extractDomains(urls)
  const patterns = analyzePatterns(urls)
  const security = analyzeSecurity(urls)

  return Object.freeze({
    domainAnalysis: Object.freeze(domains),
    patternAnalysis: Object.freeze(patterns),
    securityAnalysis: Object.freeze(security),
    summary: Object.freeze(createSummary(urls)),
  })
}
```

**Analysis Types:**

- **Domain Analysis**: Domain distribution, subdomains, TLDs
- **Pattern Analysis**: URL structure patterns, parameter usage
- **Security Analysis**: Suspicious patterns, mixed content, redirects
- **Accessibility Analysis**: Alt text, descriptive links, contrast

### 7. Safety System (`src/utils/safety.ts`)

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

**Safety Features:**

- File size warnings and limits
- Processing time limits
- Memory usage monitoring
- URL count thresholds
- Complex pattern detection
- User confirmation for large operations

### 8. Performance Monitoring (`src/utils/performance.ts`)

```typescript
export function createPerformanceMonitor(
  config: Readonly<Configuration>,
): Readonly<PerformanceMonitor> {
  return Object.freeze({
    start: (operation: string, inputSize: number) => {
      /* ... */
    },
    end: () => {
      /* ... */
    },
    getMetrics: () => {
      /* ... */
    },
    shouldCancel: () => {
      /* ... */
    },
  })
}
```

**Metrics Tracked:**

- Operation duration and throughput
- Memory usage and efficiency
- CPU usage patterns
- Cache hit rates
- Error rates and recovery

### 9. Error Handling (`src/utils/errorHandling.ts`)

```typescript
export function createErrorHandler(): Readonly<ErrorHandler> {
  return Object.freeze({
    handle: (error: Error, context: string) => {
      const categorized = categorizeError(error)
      const recovery = getRecoveryOptions(categorized)
      return Object.freeze({ categorized, recovery })
    },
  })
}
```

**Error Categories:**

- **Parse Errors**: Invalid format, syntax errors
- **Validation Errors**: Invalid URLs, malformed data
- **Safety Errors**: Resource limits exceeded
- **Network Errors**: Connection failures, timeouts
- **File System Errors**: Permission issues, missing files

### 10. User Interface (`src/ui/`)

```typescript
export function createNotifier(): Readonly<Notifier> {
  return Object.freeze({
    info: (message: string) => vscode.window.showInformationMessage(message),
    warning: (message: string) => vscode.window.showWarningMessage(message),
    error: (message: string) => vscode.window.showErrorMessage(message),
  })
}
```

**UI Components:**

- **Notifier**: User notifications and feedback
- **Status Bar**: Progress indicators and status
- **Output Channel**: Detailed logging and results
- **Progress Indicators**: Long-running operation feedback

### 11. Telemetry (`src/telemetry/`)

```typescript
export function createTelemetry(): Readonly<Telemetry> {
  return Object.freeze({
    event: (name: string, properties?: Record<string, unknown>) => {
      // Local-only logging, no external transmission
    },
  })
}
```

**Telemetry Features:**

- Local-only logging (no external transmission)
- Performance metrics collection
- Error tracking and analysis
- Usage pattern insights
- Privacy-first approach

### 12. Localization (`src/i18n/`)

```typescript
const localize = nls.config({ messageFormat: nls.MessageFormat.file })()

export function getLocalizedMessage(key: string, ...args: unknown[]): string {
  return localize(key, ...args)
}
```

**Localization Support:**

- Manifest localization (`package.nls.json`)
- Runtime localization (`runtime.json`)
- Message formatting with parameters
- Pluralization support
- Date and number formatting

## Data Flow

### 1. URL Extraction Flow

```
User Command → Command Handler → Format Detection → Pattern Matching →
URL Validation → Deduplication → Analysis → Result Formatting → User Feedback
```

### 2. Error Handling Flow

```
Error Occurrence → Error Categorization → Recovery Options →
User Notification → Logging → Telemetry
```

### 3. Performance Monitoring Flow

```
Operation Start → Metrics Collection → Threshold Checking →
Cancellation Decision → Operation End → Report Generation
```

## Dependencies

### External Dependencies

- **vscode-nls**: Internationalization support
- **@types/vscode**: VS Code API type definitions
- **@types/node**: Node.js type definitions

### Internal Dependencies

- **types.ts**: Centralized type definitions
- **interfaces/**: Interface definitions
- **utils/**: Utility functions and helpers
- \***\*mocks**/\*\*: VS Code API mocks for testing

## Testing Strategy

### Test Types

- **Unit Tests**: Individual function testing
- **Integration Tests**: Component interaction testing
- **Performance Tests**: Speed and memory testing
- **Accessibility Tests**: Screen reader and keyboard testing

### Test Framework

- **Vitest**: Fast, modern testing framework
- **Coverage**: Comprehensive code coverage reporting
- **Mocking**: VS Code API mocking for isolated testing
- **Fixtures**: Test data and expected outputs

## Security Considerations

### Input Validation

- All user inputs are validated and sanitized
- URL validation prevents injection attacks
- File path validation prevents directory traversal
- Content size limits prevent resource exhaustion

### Privacy Protection

- No external data transmission
- Local-only telemetry and logging
- User data stays within VS Code
- Configurable privacy settings

### Error Handling

- Sensitive information is not logged
- Error messages are user-friendly
- Stack traces are handled securely
- Recovery options are provided

## Performance Characteristics

### Memory Usage

- Streaming processing for large files
- Efficient data structures and algorithms
- Garbage collection optimization
- Memory leak prevention

### CPU Usage

- Optimized regex patterns
- Efficient string processing
- Minimal computational overhead
- Background processing support

### Network Usage

- Minimal network requests
- Efficient URL validation
- Caching for repeated operations
- Timeout handling

## Extension Lifecycle

### Activation

1. Extension context initialization
2. Dependency injection setup
3. Component registration
4. Configuration loading
5. Telemetry initialization

### Runtime

1. Command execution
2. URL extraction and analysis
3. User feedback and notifications
4. Performance monitoring
5. Error handling and recovery

### Deactivation

1. Resource cleanup
2. Telemetry finalization
3. Configuration saving
4. Component disposal
5. Memory cleanup

## Future Considerations

### Scalability

- Support for larger files and datasets
- Improved performance monitoring
- Enhanced caching strategies
- Parallel processing support

### Feature Extensions

- Additional URL formats and patterns
- Advanced security analysis
- Integration with external services
- Custom validation rules

### User Experience

- Enhanced accessibility features
- Improved error messages
- Better progress indicators
- Customizable UI components

This architecture ensures URLs-LE remains lightweight, performant, and maintainable while providing powerful URL extraction and validation capabilities for developers.

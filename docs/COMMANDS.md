# URLs-LE Commands

## Overview

URLs-LE provides a comprehensive set of commands for URL extraction, validation, and analysis. All commands are designed to be lightweight, unobtrusive, and focused on developer productivity during preparation and discovery phases.

## Primary Commands

### Extract URLs (`urls-le.extractUrls`)

**Purpose**: Extract URLs from the current document using format-specific patterns.

**Usage**:

- Command Palette: `URLs-LE: Extract URLs`
- Keyboard Shortcut: `Ctrl+Alt+U` (Windows/Linux) / `Cmd+Alt+U` (macOS)
- Context Menu: Right-click in supported file types

**Supported Formats**:

- Markdown (`.md`, `.markdown`)
- HTML (`.html`, `.htm`)
- CSS (`.css`)
- JavaScript/TypeScript (`.js`, `.ts`, `.jsx`, `.tsx`)
- JSON (`.json`)
- YAML (`.yml`, `.yaml`)

**Features**:

- Format detection and validation
- Pattern matching with regex
- URL validation and normalization
- Deduplication and sorting
- Progress indicators for large files
- Safety checks and warnings
- Error handling with recovery options

**Output**:

- Extracted URLs with metadata
- Format information
- Extraction statistics
- Error reports (if any)

**Example Output**:

```
Extracted 15 URLs from markdown document:
- https://example.com (line 5, column 12)
- https://api.example.com (line 12, column 8)
- https://cdn.example.com/image.png (line 18, column 15)
...
```

### Validate URLs (`urls-le.postProcess.validate`)

**Purpose**: Validate extracted URLs for format, accessibility, and security.

**Usage**:

- Command Palette: `URLs-LE: Validate URLs`
- Context Menu: After extraction

**Validation Types**:

- **Format Validation**: URL structure and syntax
- **Protocol Validation**: HTTP, HTTPS, FTP, etc.
- **Domain Validation**: Domain format and normalization
- **Path Validation**: Path structure and encoding
- **Query Parameters**: Parameter parsing and validation
- **Fragment Handling**: Fragment identifier processing

**Security Checks**:

- HTTPS preference detection
- Mixed content warnings
- Suspicious pattern detection
- Redirect chain analysis

**Output**:

- Validation results with status
- Error messages and suggestions
- Security warnings
- Accessibility recommendations

**Example Output**:

```
Validation Results:
✓ https://example.com - Valid HTTPS URL
⚠ https://insecure.com - HTTP URL (consider HTTPS)
✗ malformed-url - Invalid URL format
🔒 https://secure.com - Secure with valid certificate
```

### Check Accessibility (`urls-le.postProcess.checkAccessibility`)

**Purpose**: Analyze URLs for accessibility compliance and best practices.

**Usage**:

- Command Palette: `URLs-LE: Check Accessibility`
- Context Menu: After extraction

**Accessibility Checks**:

- Alt text for images
- Descriptive link text
- Proper contrast ratios
- Screen reader compatibility
- Keyboard navigation support
- Focus management

**Analysis Types**:

- **Link Analysis**: Link text quality and descriptiveness
- **Image Analysis**: Alt text presence and quality
- **Contrast Analysis**: Color contrast ratios
- **Navigation Analysis**: Keyboard and screen reader support

**Output**:

- Accessibility score and recommendations
- Specific issues and fixes
- Best practice suggestions
- Compliance status

**Example Output**:

```
Accessibility Analysis:
Score: 85/100

Issues Found:
- Missing alt text for image: https://example.com/image.png
- Non-descriptive link text: "Click here"
- Low contrast ratio: 2.1:1 (minimum 4.5:1)

Recommendations:
- Add descriptive alt text for images
- Use descriptive link text
- Improve color contrast ratios
```

### Analyze URLs (`urls-le.postProcess.analyze`)

**Purpose**: Perform comprehensive analysis of extracted URLs for patterns, security, and insights.

**Usage**:

- Command Palette: `URLs-LE: Analyze URLs`
- Context Menu: After extraction

**Analysis Types**:

- **Domain Analysis**: Domain distribution, subdomains, TLD analysis
- **Pattern Analysis**: URL structure patterns, parameter usage
- **Security Analysis**: Suspicious patterns, mixed content detection
- **Usage Analysis**: Frequency, patterns, and trends

**Security Analysis**:

- Suspicious pattern detection
- Mixed content warnings
- Redirect chain analysis
- Protocol security assessment
- Domain reputation checks

**Pattern Analysis**:

- URL structure patterns
- Parameter usage analysis
- Path pattern recognition
- Query parameter trends
- Fragment usage patterns

**Output**:

- Comprehensive analysis report
- Security recommendations
- Pattern insights
- Usage statistics
- Trend analysis

**Example Output**:

```
URL Analysis Report:

Domain Analysis:
- Total domains: 8
- Unique domains: 5
- Most common TLD: .com (60%)
- Subdomains: api, cdn, docs

Security Analysis:
- HTTPS URLs: 12/15 (80%)
- Mixed content: 2 warnings
- Suspicious patterns: 0 detected
- Redirect chains: 1 detected

Pattern Analysis:
- API endpoints: 5 URLs
- Image resources: 3 URLs
- Documentation: 2 URLs
- Static assets: 5 URLs
```

## Utility Commands

### Open Settings (`urls-le.openSettings`)

**Purpose**: Open the URLs-LE extension settings in VS Code.

**Usage**:

- Command Palette: `URLs-LE: Open Settings`
- Status Bar: Click on URLs-LE status

**Features**:

- Direct access to all extension settings
- Organized by category (Basic, Safety, Analysis, Validation)
- Real-time preview of changes
- Reset to defaults option

**Settings Categories**:

- **Basic**: Clipboard, deduplication, notifications
- **Safety**: File size limits, processing thresholds
- **Analysis**: Security, accessibility analysis options
- **Validation**: Timeout, redirect handling

### Help (`urls-le.help`)

**Purpose**: Display help information, documentation, and usage examples.

**Usage**:

- Command Palette: `URLs-LE: Help`
- Command Palette: `URLs-LE: Show Documentation`

**Features**:

- Quick start guide
- Command reference
- Configuration examples
- Troubleshooting tips
- Links to documentation
- Usage examples

**Help Sections**:

- Getting Started
- Command Reference
- Configuration Guide
- Troubleshooting
- Examples and Use Cases
- Links to Documentation

## Command Execution Flow

### 1. Command Registration

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

### 2. Command Execution

```typescript
export function createExtractCommand(deps: CommandDependencies) {
  return async () => {
    const editor = vscode.window.activeTextEditor
    if (!editor) {
      deps.notifier.warning('No active editor found')
      return
    }

    const content = editor.document.getText()
    const format = editor.document.languageId

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Extracting URLs...',
        cancellable: true,
      },
      async (progress, token) => {
        const result = await extractUrls(content, format, deps.config, token)
        await handleExtractionResult(result, deps)
      },
    )
  }
}
```

### 3. Result Handling

```typescript
async function handleExtractionResult(
  result: UrlExtractionResult,
  deps: CommandDependencies,
): Promise<void> {
  if (result.urls.length === 0) {
    deps.notifier.info('No URLs found in the current document')
    return
  }

  deps.notifier.info(`Extracted ${result.urls.length} URLs`)

  if (deps.config.copyToClipboardEnabled) {
    await vscode.env.clipboard.writeText(formatUrlsForClipboard(result.urls))
    deps.notifier.info('URLs copied to clipboard')
  }

  if (deps.config.postProcessOpenInNewFile) {
    await openResultsInNewFile(result, deps)
  }
}
```

## Error Handling

### Common Errors

- **No Active Editor**: User must open a file first
- **Unsupported Format**: File type not supported for extraction
- **Large File**: File exceeds safety limits
- **Parse Errors**: Invalid file format or syntax
- **Network Errors**: URL validation failures
- **Permission Errors**: File access issues

### Recovery Options

- **Retry**: Automatic retry for transient errors
- **Fallback**: Alternative extraction methods
- **User Action**: Manual intervention required
- **Skip**: Continue with remaining URLs

### Error Messages

- Clear, actionable descriptions
- Suggestions for resolution
- Links to documentation
- Context-specific help

## Performance Considerations

### Large Files

- Streaming processing for files > 1MB
- Progress indicators for long operations
- Cancellation support
- Memory usage monitoring

### Batch Operations

- Efficient processing of multiple URLs
- Caching for repeated operations
- Parallel processing where possible
- Resource limit enforcement

### User Experience

- Responsive UI during processing
- Clear progress feedback
- Cancellation options
- Error recovery paths

## Keyboard Shortcuts

### Default Shortcuts

- `Ctrl+Alt+U` (Windows/Linux) / `Cmd+Alt+U` (macOS): Extract URLs

### Customizable Shortcuts

All commands can be assigned custom keyboard shortcuts through VS Code's keyboard shortcuts editor.

### Shortcut Categories

- **Primary**: Main extraction command
- **Secondary**: Validation and analysis commands
- **Utility**: Settings and help commands

## Context Menu Integration

### Supported File Types

- Markdown (`.md`, `.markdown`)
- HTML (`.html`, `.htm`)
- CSS (`.css`)
- JavaScript/TypeScript (`.js`, `.ts`, `.jsx`, `.tsx`)
- JSON (`.json`)
- YAML (`.yml`, `.yaml`)

### Context Menu Items

- Extract URLs
- Validate URLs (after extraction)
- Check Accessibility (after extraction)
- Analyze URLs (after extraction)

### Menu Organization

- Primary commands at the top
- Secondary commands grouped together
- Utility commands at the bottom
- Separators for visual organization

## Command Palette Integration

### Command Categories

- **URLs-LE**: All extension commands
- **Extract**: Primary extraction commands
- **Analyze**: Analysis and validation commands
- **Settings**: Configuration commands

### Search Features

- Fuzzy search support
- Command descriptions
- Keyboard shortcuts display
- Recent commands

## Status Bar Integration

### Status Display

- Current operation status
- URL count and statistics
- Error indicators
- Progress information

### Interactive Elements

- Click to open settings
- Hover for detailed information
- Right-click for context menu
- Status updates in real-time

This command reference provides comprehensive documentation for all URLs-LE commands, ensuring developers can effectively use the extension for URL extraction, validation, and analysis tasks.

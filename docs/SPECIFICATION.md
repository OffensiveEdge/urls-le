# URLs-LE Specification

## Overview

URLs-LE is a VS Code extension that provides lightweight, unobtrusive URL extraction and validation from documentation, configuration files, and code. It focuses on developer productivity during preparation and discovery phases, offering fast, reliable tools for URL analysis and validation.

## Core Functionality

### URL Extraction

Extract URLs from various file formats with high accuracy and performance:

- **Markdown**: `[text](url)`, `![alt](url)`, `<url>`, `[text][ref]`
- **HTML**: `<a href="">`, `<img src="">`, `<link href="">`, `<script src="">`
- **CSS**: `url()`, `@import`, `background-image`, `src`
- **JavaScript/TypeScript**: String literals, template literals, object properties
- **JSON**: String values matching URL patterns
- **YAML**: String values and URL-specific keys

### URL Validation

Comprehensive URL validation and normalization:

- **Format Validation**: Using `URL` constructor for strict validation
- **Protocol Validation**: HTTP, HTTPS, FTP, mailto, tel, etc.
- **Domain Validation**: Domain format and normalization
- **Path Validation**: Path structure and sanitization
- **Query Parameters**: Parameter parsing and validation
- **Fragment Handling**: Fragment identifier processing

### URL Analysis

Advanced analysis capabilities for extracted URLs:

- **Domain Analysis**: Domain distribution, subdomains, TLD analysis
- **Pattern Analysis**: URL structure patterns, parameter usage
- **Security Analysis**: Suspicious patterns, mixed content detection
- **Accessibility Analysis**: Alt text, descriptive links, contrast analysis

## Technical Specifications

### Supported File Formats

#### Markdown (.md, .markdown)

```markdown
[Link text](https://example.com)
![Image alt](https://example.com/image.png)
<https://example.com>
[Link text][reference]
[reference]: https://example.com
```

#### HTML (.html, .htm)

```html
<a href="https://example.com">Link</a>
<img src="https://example.com/image.png" alt="Image" />
<link href="https://example.com/style.css" rel="stylesheet" />
<script src="https://example.com/script.js"></script>
```

#### CSS (.css)

```css
background-image: url('https://example.com/image.png');
@import url('https://example.com/style.css');
background: url('https://example.com/bg.jpg');
```

#### JavaScript/TypeScript (.js, .ts, .jsx, .tsx)

```javascript
const url = 'https://example.com'
const image = `https://example.com/image.png`
const config = { apiUrl: 'https://api.example.com' }
```

#### JSON (.json)

```json
{
  "website": "https://example.com",
  "api": "https://api.example.com",
  "cdn": "https://cdn.example.com"
}
```

#### YAML (.yml, .yaml)

```yaml
website: https://example.com
api:
  base_url: https://api.example.com
  docs: https://docs.example.com
```

### URL Patterns

#### Standard URLs

- `https://example.com`
- `http://example.com`
- `ftp://example.com`
- `mailto:user@example.com`
- `tel:+1234567890`

#### Relative URLs

- `/path/to/resource`
- `../relative/path`
- `./local/file`
- `#fragment`
- `?query=value`

#### Special URLs

- `data:image/png;base64,...`
- `blob:uuid`
- `file:///path/to/file`
- `javascript:void(0)`

### Validation Rules

#### Format Validation

- Must be valid URL format
- Protocol must be supported
- Hostname must be valid
- Path must be properly encoded

#### Security Validation

- HTTPS preferred over HTTP
- No suspicious patterns
- No mixed content warnings
- No redirect chains

#### Accessibility Validation

- Alt text for images
- Descriptive link text
- Proper contrast ratios
- Screen reader compatibility

## Configuration Options

### Basic Settings

```json
{
  "urls-le.copyToClipboardEnabled": false,
  "urls-le.dedupeEnabled": false,
  "urls-le.notificationsLevel": "silent",
  "urls-le.postProcess.openInNewFile": false,
  "urls-le.openResultsSideBySide": false
}
```

### Safety Settings

```json
{
  "urls-le.safety.enabled": true,
  "urls-le.safety.fileSizeWarnBytes": 1000000,
  "urls-le.safety.largeOutputLinesThreshold": 50000,
  "urls-le.safety.manyDocumentsThreshold": 8
}
```

### Analysis Settings

```json
{
  "urls-le.analysis.enabled": true,
  "urls-le.analysis.includeSecurity": true,
  "urls-le.analysis.includeAccessibility": true
}
```

### Validation Settings

```json
{
  "urls-le.validation.enabled": true,
  "urls-le.validation.timeout": 5000,
  "urls-le.validation.followRedirects": true
}
```

## Commands

### Primary Commands

- `urls-le.extractUrls`: Extract URLs from current document
- `urls-le.postProcess.validate`: Validate extracted URLs
- `urls-le.postProcess.checkAccessibility`: Check URL accessibility
- `urls-le.postProcess.analyze`: Analyze URL patterns and security

### Utility Commands

- `urls-le.openSettings`: Open extension settings
- `urls-le.help`: Show help and documentation

### Keyboard Shortcuts

- `Ctrl+Alt+U` (Windows/Linux) / `Cmd+Alt+U` (macOS): Extract URLs

## User Interface

### Status Bar

- Shows extraction progress
- Displays URL count
- Indicates analysis status
- Provides quick access to commands

### Context Menu

- Right-click in supported file types
- Quick access to extraction commands
- Format-specific options

### Command Palette

- Searchable command list
- Command descriptions
- Keyboard shortcuts display

### Output Panel

- Detailed extraction results
- Error messages and warnings
- Performance metrics
- Analysis reports

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

## Error Handling

### Error Categories

- **Parse Errors**: Invalid format, syntax errors
- **Validation Errors**: Invalid URLs, malformed data
- **Safety Errors**: Resource limits exceeded
- **Network Errors**: Connection failures, timeouts
- **File System Errors**: Permission issues, missing files

### Recovery Options

- **Retry**: Automatic retry for transient errors
- **Fallback**: Alternative extraction methods
- **User Action**: Manual intervention required
- **Skip**: Continue with remaining URLs

### Error Messages

- Clear, actionable error descriptions
- Suggestions for resolution
- Links to documentation
- Context-specific help

## Security Considerations

### Input Validation

- All inputs are validated and sanitized
- URL validation prevents injection attacks
- File path validation prevents directory traversal
- Content size limits prevent resource exhaustion

### Privacy Protection

- No external data transmission
- Local-only telemetry and logging
- User data stays within VS Code
- Configurable privacy settings

### Security Analysis

- HTTPS preference detection
- Mixed content warnings
- Suspicious pattern detection
- Redirect chain analysis

## Accessibility Features

### Keyboard Navigation

- Full keyboard support for all commands
- Tab navigation through results
- Keyboard shortcuts for common actions
- Focus management and indicators

### Screen Reader Support

- ARIA labels and descriptions
- Semantic HTML structure
- Announcements for status changes
- Descriptive error messages

### Visual Accessibility

- High contrast mode support
- Scalable text and icons
- Color-blind friendly indicators
- Clear visual hierarchy

## Localization Support

### Supported Languages

- English (en) - Default
- German (de)
- Spanish (es)
- French (fr)
- Italian (it)
- Japanese (ja)
- Korean (ko)
- Russian (ru)
- Ukrainian (uk)
- Vietnamese (vi)
- Chinese Simplified (zh-cn)
- Indonesian (id)

### Localization Features

- Manifest localization
- Runtime message localization
- Date and number formatting
- Pluralization support
- Message parameter substitution

## Testing Requirements

### Unit Tests

- Individual function testing
- Mock VS Code API usage
- Edge case handling
- Error condition testing

### Integration Tests

- Component interaction testing
- End-to-end workflow testing
- Configuration change testing
- Command execution testing

### Performance Tests

- Large file processing
- Memory usage monitoring
- Speed benchmarking
- Resource limit testing

### Accessibility Tests

- Screen reader compatibility
- Keyboard navigation testing
- High contrast mode testing
- Focus management testing

## Dependencies

### Runtime Dependencies

- **vscode-nls**: Internationalization support
- **VS Code API**: Extension host integration

### Development Dependencies

- **@types/vscode**: VS Code API type definitions
- **@types/node**: Node.js type definitions
- **@biomejs/biome**: Linting and formatting
- **vitest**: Testing framework
- **@vitest/coverage-v8**: Test coverage
- **typescript**: TypeScript compiler
- **@vscode/vsce**: Extension packaging

## Browser Compatibility

### VS Code Versions

- **Minimum**: VS Code 1.105.0
- **Recommended**: Latest stable version
- **Node.js**: >= 20.0.0

### Operating Systems

- **Windows**: 10, 11
- **macOS**: 10.15, 11, 12, 13, 14
- **Linux**: Ubuntu 18.04+, CentOS 7+, RHEL 7+

## Future Roadmap

### Short Term (v1.1)

- Enhanced error handling
- Performance improvements
- Additional URL formats
- Better accessibility features

### Medium Term (v1.2)

- Custom validation rules
- Integration with external services
- Advanced security analysis
- Batch processing improvements

### Long Term (v2.0)

- Plugin system for custom extractors
- Real-time URL monitoring
- Advanced analytics dashboard
- Team collaboration features

This specification defines the complete functionality, technical requirements, and quality standards for URLs-LE, ensuring it meets the needs of developers while maintaining high performance and reliability.

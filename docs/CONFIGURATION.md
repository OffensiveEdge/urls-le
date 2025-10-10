# URLs-LE Configuration

## Overview

URLs-LE provides comprehensive configuration options to customize behavior, performance, and user experience. All settings are organized by category and include detailed descriptions, default values, and validation rules.

## Configuration Categories

### Basic Settings

Core functionality and user experience options.

### Safety Settings

Resource limits and safety checks to prevent performance issues.

### Analysis Settings

URL analysis options for security, accessibility, and pattern detection.

### Validation Settings

URL validation behavior and network request configuration.

## Basic Settings

### `urls-le.copyToClipboardEnabled`

**Type**: `boolean`  
**Default**: `false`  
**Description**: Automatically copy extracted URLs to clipboard after extraction.

**Usage**:

```json
{
  "urls-le.copyToClipboardEnabled": true
}
```

**Benefits**:

- Quick access to extracted URLs
- Easy sharing and pasting
- Reduced manual copying

**Considerations**:

- May overwrite existing clipboard content
- Requires user permission for clipboard access

### `urls-le.dedupeEnabled`

**Type**: `boolean`  
**Default**: `false`  
**Description**: Remove duplicate URLs from extraction results.

**Usage**:

```json
{
  "urls-le.dedupeEnabled": true
}
```

**Benefits**:

- Cleaner results
- Reduced processing time
- Better analysis accuracy

**Considerations**:

- May hide legitimate duplicate URLs
- Requires additional processing time

### `urls-le.notificationsLevel`

**Type**: `string`  
**Default**: `"silent"`  
**Enum**: `["all", "important", "silent"]`  
**Description**: Control the level of notifications shown to the user.

**Options**:

- `"all"`: Show all notifications and status updates
- `"important"`: Show only important notifications and errors
- `"silent"`: Show only critical errors and warnings

**Usage**:

```json
{
  "urls-le.notificationsLevel": "important"
}
```

**Benefits**:

- Customizable user experience
- Reduced notification noise
- Focus on important information

### `urls-le.postProcess.openInNewFile`

**Type**: `boolean`  
**Default**: `false`  
**Description**: Open extraction results in a new VS Code document.

**Usage**:

```json
{
  "urls-le.postProcess.openInNewFile": true
}
```

**Benefits**:

- Easy result review and editing
- Persistent results
- Side-by-side comparison

**Considerations**:

- Creates additional documents
- May clutter workspace

### `urls-le.openResultsSideBySide`

**Type**: `boolean`  
**Default**: `false`  
**Description**: Open results in a split view alongside the original document.

**Usage**:

```json
{
  "urls-le.openResultsSideBySide": true
}
```

**Benefits**:

- Side-by-side comparison
- Context preservation
- Efficient workflow

**Considerations**:

- Requires additional screen space
- May affect workspace layout

## Safety Settings

### `urls-le.safety.enabled`

**Type**: `boolean`  
**Default**: `true`  
**Description**: Enable safety checks and resource limits.

**Usage**:

```json
{
  "urls-le.safety.enabled": true
}
```

**Benefits**:

- Prevents performance issues
- Protects against resource exhaustion
- Maintains system stability

**Considerations**:

- May limit processing of large files
- Requires user confirmation for large operations

### `urls-le.safety.fileSizeWarnBytes`

**Type**: `number`  
**Default**: `1000000` (1MB)  
**Minimum**: `1000`  
**Description**: File size threshold for warning messages.

**Usage**:

```json
{
  "urls-le.safety.fileSizeWarnBytes": 2000000
}
```

**Benefits**:

- Early warning for large files
- User awareness of processing time
- Prevents unexpected delays

**Considerations**:

- May trigger warnings for normal files
- Requires user confirmation

### `urls-le.safety.largeOutputLinesThreshold`

**Type**: `number`  
**Default**: `50000`  
**Minimum**: `100`  
**Description**: Threshold for large output warnings.

**Usage**:

```json
{
  "urls-le.safety.largeOutputLinesThreshold": 100000
}
```

**Benefits**:

- Prevents overwhelming output
- Maintains performance
- User control over results

**Considerations**:

- May limit result visibility
- Requires user confirmation

### `urls-le.safety.manyDocumentsThreshold`

**Type**: `number`  
**Default**: `8`  
**Minimum**: `1`  
**Description**: Threshold for warning about processing many documents.

**Usage**:

```json
{
  "urls-le.safety.manyDocumentsThreshold": 10
}
```

**Benefits**:

- Prevents workspace overload
- Maintains performance
- User control over scope

**Considerations**:

- May limit batch processing
- Requires user confirmation

## Analysis Settings

### `urls-le.analysis.enabled`

**Type**: `boolean`  
**Default**: `true`  
**Description**: Enable URL analysis features.

**Usage**:

```json
{
  "urls-le.analysis.enabled": true
}
```

**Benefits**:

- Comprehensive URL insights
- Security and accessibility checks
- Pattern recognition

**Considerations**:

- Requires additional processing time
- May generate large reports

### `urls-le.analysis.includeSecurity`

**Type**: `boolean`  
**Default**: `true`  
**Description**: Include security analysis in URL processing.

**Usage**:

```json
{
  "urls-le.analysis.includeSecurity": true
}
```

**Security Checks**:

- HTTPS preference detection
- Mixed content warnings
- Suspicious pattern detection
- Redirect chain analysis
- Protocol security assessment

**Benefits**:

- Security awareness
- Risk identification
- Best practice recommendations

### `urls-le.analysis.includeAccessibility`

**Type**: `boolean`  
**Default**: `true`  
**Description**: Include accessibility analysis in URL processing.

**Usage**:

```json
{
  "urls-le.analysis.includeAccessibility": true
}
```

**Accessibility Checks**:

- Alt text for images
- Descriptive link text
- Proper contrast ratios
- Screen reader compatibility
- Keyboard navigation support

**Benefits**:

- Accessibility compliance
- Inclusive design support
- Best practice recommendations

## Validation Settings

### `urls-le.validation.enabled`

**Type**: `boolean`  
**Default**: `true`  
**Description**: Enable URL validation features.

**Usage**:

```json
{
  "urls-le.validation.enabled": true
}
```

**Benefits**:

- URL format validation
- Error detection and reporting
- Quality assurance

**Considerations**:

- Requires additional processing time
- May generate validation reports

### `urls-le.validation.timeout`

**Type**: `number`  
**Default**: `5000` (5 seconds)  
**Minimum**: `1000`  
**Description**: Timeout for network-based URL validation.

**Usage**:

```json
{
  "urls-le.validation.timeout": 10000
}
```

**Benefits**:

- Prevents hanging operations
- Configurable timeout duration
- Network error handling

**Considerations**:

- May timeout on slow networks
- Requires network connectivity

### `urls-le.validation.followRedirects`

**Type**: `boolean`  
**Default**: `true`  
**Description**: Follow HTTP redirects during validation.

**Usage**:

```json
{
  "urls-le.validation.followRedirects": true
}
```

**Benefits**:

- Complete URL validation
- Redirect chain analysis
- Final destination tracking

**Considerations**:

- May increase processing time
- Requires network connectivity

## Configuration Management

### Settings Access

```typescript
// Get configuration
const config = vscode.workspace.getConfiguration('urls-le')

// Read specific setting
const copyToClipboard = config.get('copyToClipboardEnabled', false)

// Update setting
await config.update('copyToClipboardEnabled', true, vscode.ConfigurationTarget.Global)
```

### Configuration Change Events

```typescript
// Listen for configuration changes
vscode.workspace.onDidChangeConfiguration((event) => {
  if (event.affectsConfiguration('urls-le')) {
    // Reload configuration
    const newConfig = createConfiguration()
    // Update components
  }
})
```

### Configuration Validation

```typescript
export function validateConfiguration(config: any): Configuration {
  return Object.freeze({
    copyToClipboardEnabled: Boolean(config.copyToClipboardEnabled),
    dedupeEnabled: Boolean(config.dedupeEnabled),
    notificationsLevel: ['all', 'important', 'silent'].includes(config.notificationsLevel)
      ? config.notificationsLevel
      : 'silent',
    // ... other validations
  })
}
```

## Configuration Examples

### Development Setup

```json
{
  "urls-le.copyToClipboardEnabled": true,
  "urls-le.dedupeEnabled": true,
  "urls-le.notificationsLevel": "all",
  "urls-le.analysis.enabled": true,
  "urls-le.analysis.includeSecurity": true,
  "urls-le.analysis.includeAccessibility": true,
  "urls-le.validation.enabled": true,
  "urls-le.validation.timeout": 10000
}
```

### Production Setup

```json
{
  "urls-le.copyToClipboardEnabled": false,
  "urls-le.dedupeEnabled": true,
  "urls-le.notificationsLevel": "important",
  "urls-le.analysis.enabled": true,
  "urls-le.analysis.includeSecurity": true,
  "urls-le.analysis.includeAccessibility": true,
  "urls-le.validation.enabled": true,
  "urls-le.validation.timeout": 5000
}
```

### Performance-Optimized Setup

```json
{
  "urls-le.copyToClipboardEnabled": false,
  "urls-le.dedupeEnabled": true,
  "urls-le.notificationsLevel": "silent",
  "urls-le.safety.enabled": true,
  "urls-le.safety.fileSizeWarnBytes": 500000,
  "urls-le.safety.largeOutputLinesThreshold": 25000,
  "urls-le.analysis.enabled": false,
  "urls-le.validation.enabled": false
}
```

### Security-Focused Setup

```json
{
  "urls-le.copyToClipboardEnabled": false,
  "urls-le.dedupeEnabled": true,
  "urls-le.notificationsLevel": "all",
  "urls-le.analysis.enabled": true,
  "urls-le.analysis.includeSecurity": true,
  "urls-le.analysis.includeAccessibility": false,
  "urls-le.validation.enabled": true,
  "urls-le.validation.timeout": 10000,
  "urls-le.validation.followRedirects": true
}
```

## Configuration Best Practices

### Performance Optimization

- Disable unnecessary analysis features
- Set appropriate safety thresholds
- Use silent notifications for automation
- Configure reasonable timeouts

### Security Considerations

- Enable security analysis
- Use HTTPS validation
- Set appropriate timeouts
- Follow redirects cautiously

### User Experience

- Choose appropriate notification levels
- Enable clipboard copying for convenience
- Use side-by-side results for comparison
- Configure safety warnings appropriately

### Development Workflow

- Use comprehensive analysis for development
- Enable all notifications for debugging
- Set longer timeouts for slow networks
- Use new file results for review

## Troubleshooting Configuration

### Common Issues

- **Settings not applying**: Restart VS Code after configuration changes
- **Performance issues**: Adjust safety thresholds and disable unnecessary features
- **Network errors**: Increase timeout values and check connectivity
- **Memory issues**: Reduce safety thresholds and disable analysis features

### Configuration Reset

```json
{
  "urls-le.copyToClipboardEnabled": false,
  "urls-le.dedupeEnabled": false,
  "urls-le.notificationsLevel": "silent",
  "urls-le.postProcess.openInNewFile": false,
  "urls-le.openResultsSideBySide": false,
  "urls-le.safety.enabled": true,
  "urls-le.safety.fileSizeWarnBytes": 1000000,
  "urls-le.safety.largeOutputLinesThreshold": 50000,
  "urls-le.safety.manyDocumentsThreshold": 8,
  "urls-le.analysis.enabled": true,
  "urls-le.analysis.includeSecurity": true,
  "urls-le.analysis.includeAccessibility": true,
  "urls-le.validation.enabled": true,
  "urls-le.validation.timeout": 5000,
  "urls-le.validation.followRedirects": true
}
```

This configuration guide provides comprehensive documentation for all URLs-LE settings, ensuring developers can effectively customize the extension for their specific needs and workflows.

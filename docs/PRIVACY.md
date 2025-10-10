# URLs-LE Privacy Policy

## Overview

URLs-LE is committed to protecting user privacy and data security. This privacy policy outlines how the extension handles user data, what information is collected, and how it's used.

## Privacy Principles

### Local-First Approach

- All processing happens locally within VS Code
- No external data transmission
- User data never leaves the local environment
- Complete control over data handling

### Transparency

- Clear documentation of data handling practices
- Open source code for verification
- User control over all features
- No hidden data collection

### Minimal Data Collection

- Only essential data for functionality
- No personal information collection
- No tracking or analytics
- User consent for all operations

## Data Handling

### What Data We Process

#### File Content

- **Purpose**: URL extraction and analysis
- **Scope**: Only the active document content
- **Retention**: Not stored or transmitted
- **Access**: Local processing only

#### Extracted URLs

- **Purpose**: Validation, analysis, and user feedback
- **Scope**: URLs found in processed content
- **Retention**: Temporary processing only
- **Access**: Local processing only

#### Configuration Settings

- **Purpose**: Extension customization and preferences
- **Scope**: User-configured settings
- **Retention**: Stored locally in VS Code settings
- **Access**: Local access only

### What Data We Don't Collect

#### Personal Information

- No names, emails, or personal identifiers
- No user accounts or authentication
- No contact information
- No demographic data

#### Usage Analytics

- No usage tracking or analytics
- No feature usage statistics
- No performance metrics transmission
- No error reporting to external services

#### Network Data

- No network requests to external services
- No data transmission to servers
- No cloud storage or synchronization
- No external API calls

## Data Processing

### Local Processing Only

```typescript
export function extractUrls(content: string, format: string): UrlExtractionResult {
  // All processing happens locally
  const urls = parseUrlsLocally(content, format)
  const validated = validateUrlsLocally(urls)
  const analyzed = analyzeUrlsLocally(validated)

  return Object.freeze({
    urls: analyzed,
    totalCount: analyzed.length,
    format,
    timestamp: Date.now(),
  })
}
```

### No External Communication

```typescript
export function validateUrl(url: string): ValidationResult {
  try {
    // Local validation only - no network requests
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
```

### Memory Management

```typescript
export function cleanupProcessingData(): void {
  // Clear all temporary data
  clearUrlCache()
  clearValidationCache()
  clearAnalysisCache()

  // Force garbage collection if available
  if (global.gc) {
    global.gc()
  }
}
```

## Telemetry and Logging

### Local-Only Telemetry

```typescript
export function createTelemetry(): Telemetry {
  return Object.freeze({
    event: (name: string, properties?: Record<string, unknown>) => {
      // Local-only logging - no external transmission
      if (isTelemetryEnabled()) {
        logLocally({
          event: name,
          properties,
          timestamp: Date.now(),
          sessionId: getSessionId(),
        })
      }
    },
  })
}
```

### Telemetry Data

- **Event names**: Extension activation, command execution
- **Properties**: Non-sensitive operation metadata
- **Retention**: Local logs only, user-controlled
- **Access**: Local access only

### Logging Practices

- **Level**: Information, warnings, errors
- **Content**: Non-sensitive operation details
- **Storage**: Local VS Code output channel
- **Retention**: User-controlled, no external transmission

## User Control

### Privacy Settings

```json
{
  "urls-le.telemetryEnabled": false,
  "urls-le.notificationsLevel": "silent",
  "urls-le.safety.enabled": true
}
```

### User Choices

- **Telemetry**: Enable/disable local telemetry
- **Notifications**: Control notification levels
- **Safety**: Enable/disable safety checks
- **Data**: Complete control over processed data

### Data Access

- **View**: All data visible in VS Code output
- **Export**: Copy results to clipboard
- **Delete**: Clear output and caches
- **Control**: Complete user control

## Security Measures

### Input Validation

```typescript
export function validateInput(content: string): boolean {
  // Validate input to prevent injection attacks
  if (typeof content !== 'string') {
    return false
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    return false
  }

  // Check for suspicious patterns
  if (containsSuspiciousPatterns(content)) {
    return false
  }

  return true
}
```

### Data Sanitization

```typescript
export function sanitizeUrl(url: string): string {
  // Remove potentially dangerous characters
  return url
    .replace(/[<>\"'&]/g, '')
    .trim()
    .substring(0, MAX_URL_LENGTH)
}
```

### Error Handling

```typescript
export function handleError(error: Error, context: string): void {
  // Log errors locally without sensitive information
  const sanitizedError = {
    message: error.message,
    context,
    timestamp: Date.now(),
  }

  logLocally(sanitizedError)

  // Don't expose stack traces or sensitive data
  showUserFriendlyError(error.message)
}
```

## Compliance

### GDPR Compliance

- **Data Minimization**: Only essential data processed
- **Purpose Limitation**: Data used only for stated purposes
- **Storage Limitation**: No permanent data storage
- **User Rights**: Complete user control over data

### CCPA Compliance

- **No Sale**: No data sold to third parties
- **User Rights**: Right to know, delete, and opt-out
- **Transparency**: Clear data handling practices
- **Local Processing**: No external data sharing

### Industry Standards

- **Security**: Industry-standard security practices
- **Privacy**: Privacy-by-design principles
- **Transparency**: Open source and documented practices
- **User Control**: Complete user control over data

## Data Retention

### Processing Data

- **Duration**: Only during active processing
- **Retention**: Not retained after processing
- **Storage**: Temporary memory only
- **Cleanup**: Automatic cleanup after operations

### Configuration Data

- **Duration**: Until user changes settings
- **Retention**: Stored in VS Code settings
- **Storage**: Local VS Code configuration
- **Access**: User-controlled

### Log Data

- **Duration**: Until user clears logs
- **Retention**: Local VS Code output channel
- **Storage**: Local file system
- **Access**: User-controlled

## User Rights

### Right to Know

- **Data Collection**: What data is processed
- **Data Use**: How data is used
- **Data Sharing**: No data sharing practices
- **Data Retention**: How long data is retained

### Right to Control

- **Data Access**: View all processed data
- **Data Modification**: Modify configuration
- **Data Deletion**: Clear logs and caches
- **Data Portability**: Copy results to clipboard

### Right to Privacy

- **Opt-Out**: Disable all optional features
- **Minimal Collection**: Only essential data
- **Local Processing**: No external transmission
- **User Consent**: Consent for all operations

## Contact Information

### Privacy Questions

- **GitHub Issues**: https://github.com/nolindnaidoo/urls-le/issues
- **Documentation**: See docs/PRIVACY.md
- **Source Code**: https://github.com/nolindnaidoo/urls-le

### Privacy Concerns

- **Report Issues**: Use GitHub issues
- **Request Changes**: Submit pull requests
- **Ask Questions**: Use GitHub discussions
- **Provide Feedback**: Use GitHub issues

## Privacy Updates

### Policy Changes

- **Notification**: Changes posted on GitHub
- **Version Control**: Tracked in git history
- **User Consent**: Continued use implies acceptance
- **Major Changes**: Will be highlighted

### Version History

- **v1.0.0**: Initial privacy policy
- **Updates**: Tracked in git history
- **Changes**: Documented in commits
- **Transparency**: All changes visible

## Best Practices

### For Users

1. **Review Settings**: Check privacy-related settings
2. **Monitor Logs**: Review local logs regularly
3. **Clear Data**: Clear logs and caches as needed
4. **Report Issues**: Report privacy concerns

### For Developers

1. **Privacy by Design**: Consider privacy in all features
2. **Minimal Data**: Collect only essential data
3. **Local Processing**: Keep all processing local
4. **User Control**: Give users complete control

### For Contributors

1. **Follow Guidelines**: Follow privacy guidelines
2. **Review Changes**: Review privacy implications
3. **Document Changes**: Document privacy-related changes
4. **Test Privacy**: Test privacy features

## Privacy Assurance

### Code Review

- **Open Source**: All code is open source
- **Community Review**: Community can review code
- **Privacy Focus**: Privacy-focused development
- **Regular Audits**: Regular privacy audits

### Testing

- **Privacy Tests**: Test privacy features
- **Security Tests**: Test security measures
- **Compliance Tests**: Test compliance requirements
- **User Tests**: Test user control features

### Monitoring

- **Privacy Monitoring**: Monitor privacy practices
- **Security Monitoring**: Monitor security measures
- **Compliance Monitoring**: Monitor compliance
- **User Feedback**: Monitor user feedback

This privacy policy ensures URLs-LE maintains the highest standards of privacy protection while providing powerful URL extraction and validation capabilities.

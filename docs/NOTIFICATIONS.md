# URLs-LE Notifications Guide

## Overview

URLs-LE provides a comprehensive notification system to keep users informed about extraction, validation, and analysis operations. The system is designed to be unobtrusive while providing meaningful feedback when needed.

## Notification Levels

### Silent (`silent`)

**Default level** - Minimal notifications for clean, uninterrupted workflow.

**Shows**:

- Critical errors that prevent operation
- Safety warnings for large files
- System-level failures

**Hides**:

- Success messages
- Progress updates
- Informational messages
- Non-critical warnings

**Use cases**:

- CI/CD environments
- Automated workflows
- Users who prefer minimal feedback

### Important (`important`)

**Balanced level** - Key information without overwhelming the user.

**Shows**:

- Operation completion
- Significant warnings
- Error messages
- Safety notifications

**Hides**:

- Progress updates
- Minor informational messages
- Routine status updates

**Use cases**:

- Most development workflows
- Team environments
- Users who want key updates

### All (`all`)

**Verbose level** - Complete feedback for detailed monitoring.

**Shows**:

- All notifications
- Progress updates
- Detailed status information
- Operation statistics

**Hides**:

- Nothing (all notifications shown)

**Use cases**:

- Debugging and troubleshooting
- Learning the extension
- Detailed workflow monitoring

## Notification Types

### Success Notifications

#### URL Extraction Success

```
✅ Extracted 15 URLs from markdown document
```

#### URL Validation Success

```
✅ Validated 15 URLs - all passed validation
```

#### Analysis Success

```
✅ Analysis complete - found 3 domains, 2 security issues
```

### Warning Notifications

#### Large File Warning

```
⚠️ Large file detected (5.2MB). This may take a while...
```

#### Invalid URLs Warning

```
⚠️ Found 3 invalid URLs that were skipped
```

#### Performance Warning

```
⚠️ Operation took longer than expected (2.1s)
```

### Error Notifications

#### Extraction Error

```
❌ Extraction failed: File format not supported
```

#### Validation Error

```
❌ Validation failed: Network timeout
```

#### Analysis Error

```
❌ Analysis failed: Insufficient memory
```

### Information Notifications

#### Clipboard Copy

```
📋 URLs copied to clipboard
```

#### Settings Saved

```
💾 Settings saved successfully
```

#### Help Opened

```
📖 Help documentation opened
```

## Configuration

### Setting Notification Level

```json
{
  "urls-le.notificationsLevel": "important"
}
```

### Programmatic Control

```typescript
// Get current notification level
const config = vscode.workspace.getConfiguration('urls-le')
const level = config.get('notificationsLevel', 'silent')

// Show notification based on level
function showNotification(message: string, type: 'info' | 'warning' | 'error') {
  switch (level) {
    case 'all':
      vscode.window.showInformationMessage(message)
      break
    case 'important':
      if (type === 'error' || type === 'warning') {
        vscode.window.showWarningMessage(message)
      }
      break
    case 'silent':
      if (type === 'error') {
        vscode.window.showErrorMessage(message)
      }
      break
  }
}
```

## Notification Implementation

### Notification Service

```typescript
export interface NotificationService {
  showSuccess(message: string): void
  showWarning(message: string): void
  showError(message: string): void
  showInfo(message: string): void
  showProgress(message: string): void
  hideProgress(): void
}

export function createNotificationService(): NotificationService {
  const config = vscode.workspace.getConfiguration('urls-le')
  const level = config.get('notificationsLevel', 'silent')

  return {
    showSuccess(message: string) {
      if (level === 'all' || level === 'important') {
        vscode.window.showInformationMessage(`✅ ${message}`)
      }
    },

    showWarning(message: string) {
      if (level === 'all' || level === 'important') {
        vscode.window.showWarningMessage(`⚠️ ${message}`)
      }
    },

    showError(message: string) {
      // Always show errors
      vscode.window.showErrorMessage(`❌ ${message}`)
    },

    showInfo(message: string) {
      if (level === 'all') {
        vscode.window.showInformationMessage(`ℹ️ ${message}`)
      }
    },

    showProgress(message: string) {
      if (level === 'all') {
        vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: message,
            cancellable: true,
          },
          (progress, token) => {
            // Progress implementation
          },
        )
      }
    },

    hideProgress() {
      // Hide progress implementation
    },
  }
}
```

### Localized Notifications

```typescript
import * as nls from 'vscode-nls'

const localize = nls.config({ messageFormat: nls.MessageFormat.file })()

// Localized notification messages
const messages = {
  extractionComplete: localize('runtime.success.urls-extracted', 'Successfully extracted {0} URLs'),
  validationComplete: localize('runtime.success.urls-validated', 'Successfully validated {0} URLs'),
  analysisComplete: localize(
    'runtime.success.analysis-complete',
    'Analysis completed successfully',
  ),
  largeFileWarning: localize(
    'runtime.warning.large-file',
    'Large file detected. This may take a while...',
  ),
  noUrlsFound: localize('runtime.warning.no-urls-found', 'No URLs found in the current document'),
  extractionFailed: localize('runtime.error.extraction-failed', 'Extraction failed: {0}'),
  validationFailed: localize('runtime.error.validation-failed', 'Validation failed: {0}'),
  analysisFailed: localize('runtime.error.analysis-failed', 'Analysis failed: {0}'),
}
```

## Best Practices

### Message Design

- **Be concise**: Keep messages short and actionable
- **Provide context**: Include relevant details (counts, file names)
- **Use consistent formatting**: Standardize emoji and structure
- **Avoid technical jargon**: Use user-friendly language

### Timing

- **Immediate feedback**: Show progress for operations > 1s
- **Batch updates**: Group related notifications
- **Avoid spam**: Don't show too many notifications rapidly
- **Respect user preferences**: Honor notification level settings

### Error Handling

- **Graceful degradation**: Continue operation when possible
- **Actionable errors**: Provide next steps for resolution
- **Context preservation**: Maintain operation context in errors
- **Recovery options**: Offer retry or alternative actions

## Testing Notifications

### Manual Testing

1. **Test all levels**: Verify behavior at silent, important, all
2. **Test all types**: Success, warning, error, info
3. **Test localization**: Verify messages in different languages
4. **Test timing**: Ensure notifications appear at appropriate times

### Automated Testing

```typescript
describe('Notifications', () => {
  it('should show error notifications at all levels', () => {
    const service = createNotificationService()

    // Mock vscode.window.showErrorMessage
    const mockShowError = vi.fn()
    vi.mocked(vscode.window.showErrorMessage).mockImplementation(mockShowError)

    service.showError('Test error')

    expect(mockShowError).toHaveBeenCalledWith('❌ Test error')
  })

  it('should respect notification level settings', () => {
    // Test different notification levels
    const config = vscode.workspace.getConfiguration('urls-le')

    config.update('notificationsLevel', 'silent')
    // Test silent behavior

    config.update('notificationsLevel', 'important')
    // Test important behavior

    config.update('notificationsLevel', 'all')
    // Test all behavior
  })
})
```

## Troubleshooting

### Common Issues

**Notifications not showing**

- Check notification level setting
- Verify VS Code notification settings
- Check for extension conflicts

**Too many notifications**

- Reduce notification level to 'important' or 'silent'
- Check for repeated operations
- Verify notification logic

**Missing notifications**

- Increase notification level to 'all'
- Check for notification service errors
- Verify message formatting

### Debug Mode

Enable debug mode for detailed notification logging:

```json
{
  "urls-le.debug": true,
  "urls-le.notificationsLevel": "all"
}
```

This will show all notifications and log detailed information to the output channel.

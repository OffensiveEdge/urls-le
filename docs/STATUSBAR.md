# URLs-LE Status Bar Guide

## Overview

URLs-LE provides a comprehensive status bar integration that displays real-time information about URL extraction, validation, and analysis operations. The status bar serves as a quick reference and access point for key functionality.

## Status Bar Items

### Main Status Item

**Position**: Left side of status bar  
**ID**: `urls-le.status`  
**Purpose**: Primary status indicator and command access

#### States

##### Idle State

```
URLs-LE: Ready
```

- **Color**: Default (gray)
- **Tooltip**: "URLs-LE: Click to extract URLs from current document"
- **Action**: Opens main extraction command

##### Extracting State

```
URLs-LE: Extracting...
```

- **Color**: Blue (active)
- **Tooltip**: "URLs-LE: Extracting URLs from current document"
- **Action**: Shows progress information

##### Validating State

```
URLs-LE: Validating...
```

- **Color**: Yellow (processing)
- **Tooltip**: "URLs-LE: Validating extracted URLs"
- **Action**: Shows validation progress

##### Analyzing State

```
URLs-LE: Analyzing...
```

- **Color**: Purple (processing)
- **Tooltip**: "URLs-LE: Analyzing URL patterns and domains"
- **Action**: Shows analysis progress

##### Success State

```
URLs-LE: 15 URLs found
```

- **Color**: Green (success)
- **Tooltip**: "URLs-LE: Click to view extracted URLs"
- **Action**: Opens results view

##### Error State

```
URLs-LE: Error
```

- **Color**: Red (error)
- **Tooltip**: "URLs-LE: Click to view error details"
- **Action**: Opens error details

##### Warning State

```
URLs-LE: 3 invalid URLs
```

- **Color**: Orange (warning)
- **Tooltip**: "URLs-LE: Click to view warnings"
- **Action**: Opens warning details

### Count Display

**Position**: Right side of status bar  
**ID**: `urls-le.count`  
**Purpose**: Shows current URL count and statistics

#### Display Format

##### Basic Count

```
URLs: 15
```

##### With Validation

```
URLs: 15 (12 valid, 3 invalid)
```

##### With Analysis

```
URLs: 15 | Domains: 3 | Issues: 2
```

##### With Progress

```
URLs: 15/50 (30%)
```

## Configuration

### Enable/Disable Status Bar

```json
{
  "urls-le.statusBar.enabled": true
}
```

### Show/Hide Count Display

```json
{
  "urls-le.statusBar.showCount": true
}
```

### Customize Display Format

```json
{
  "urls-le.statusBar.format": "compact"
}
```

**Options**:

- `compact`: Minimal information
- `detailed`: Full statistics
- `progress`: Show progress indicators
- `custom`: User-defined format

## Implementation

### Status Bar Service

```typescript
export interface StatusBarService {
  showIdle(): void
  showExtracting(): void
  showValidating(): void
  showAnalyzing(): void
  showSuccess(count: number): void
  showError(message: string): void
  showWarning(message: string): void
  showProgress(current: number, total: number): void
  hide(): void
  dispose(): void
}

export function createStatusBarService(context: vscode.ExtensionContext): StatusBarService {
  const mainItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1000)

  const countItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 999)

  context.subscriptions.push(mainItem, countItem)

  return {
    showIdle() {
      mainItem.text = 'URLs-LE: Ready'
      mainItem.color = undefined
      mainItem.tooltip = 'Click to extract URLs from current document'
      mainItem.command = 'urls-le.extractUrls'
      mainItem.show()
    },

    showExtracting() {
      mainItem.text = 'URLs-LE: Extracting...'
      mainItem.color = 'blue'
      mainItem.tooltip = 'Extracting URLs from current document'
      mainItem.command = undefined
      mainItem.show()
    },

    showValidating() {
      mainItem.text = 'URLs-LE: Validating...'
      mainItem.color = 'yellow'
      mainItem.tooltip = 'Validating extracted URLs'
      mainItem.command = undefined
      mainItem.show()
    },

    showAnalyzing() {
      mainItem.text = 'URLs-LE: Analyzing...'
      mainItem.color = 'purple'
      mainItem.tooltip = 'Analyzing URL patterns and domains'
      mainItem.command = undefined
      mainItem.show()
    },

    showSuccess(count: number) {
      mainItem.text = `URLs-LE: ${count} URLs found`
      mainItem.color = 'green'
      mainItem.tooltip = 'Click to view extracted URLs'
      mainItem.command = 'urls-le.showResults'
      mainItem.show()
    },

    showError(message: string) {
      mainItem.text = 'URLs-LE: Error'
      mainItem.color = 'red'
      mainItem.tooltip = `Error: ${message}`
      mainItem.command = 'urls-le.showError'
      mainItem.show()
    },

    showWarning(message: string) {
      mainItem.text = 'URLs-LE: Warning'
      mainItem.color = 'orange'
      mainItem.tooltip = `Warning: ${message}`
      mainItem.command = 'urls-le.showWarning'
      mainItem.show()
    },

    showProgress(current: number, total: number) {
      const percentage = Math.round((current / total) * 100)
      mainItem.text = `URLs-LE: ${current}/${total} (${percentage}%)`
      mainItem.color = 'blue'
      mainItem.tooltip = `Processing ${current} of ${total} URLs`
      mainItem.command = undefined
      mainItem.show()
    },

    hide() {
      mainItem.hide()
      countItem.hide()
    },

    dispose() {
      mainItem.dispose()
      countItem.dispose()
    },
  }
}
```

### Count Display Service

```typescript
export interface CountDisplayService {
  updateCount(count: number): void
  updateValidation(valid: number, invalid: number): void
  updateAnalysis(domains: number, issues: number): void
  updateProgress(current: number, total: number): void
  hide(): void
  show(): void
}

export function createCountDisplayService(): CountDisplayService {
  const countItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 999)

  return {
    updateCount(count: number) {
      countItem.text = `URLs: ${count}`
      countItem.tooltip = `${count} URLs found in current document`
      countItem.show()
    },

    updateValidation(valid: number, invalid: number) {
      countItem.text = `URLs: ${valid + invalid} (${valid} valid, ${invalid} invalid)`
      countItem.tooltip = `Validation results: ${valid} valid, ${invalid} invalid URLs`
      countItem.show()
    },

    updateAnalysis(domains: number, issues: number) {
      countItem.text = `URLs: 15 | Domains: ${domains} | Issues: ${issues}`
      countItem.tooltip = `Analysis results: ${domains} domains, ${issues} issues found`
      countItem.show()
    },

    updateProgress(current: number, total: number) {
      const percentage = Math.round((current / total) * 100)
      countItem.text = `URLs: ${current}/${total} (${percentage}%)`
      countItem.tooltip = `Processing ${current} of ${total} URLs`
      countItem.show()
    },

    hide() {
      countItem.hide()
    },

    show() {
      countItem.show()
    },
  }
}
```

## Commands Integration

### Status Bar Commands

```typescript
// Register status bar commands
export function registerStatusBarCommands(
  context: vscode.ExtensionContext,
  statusBar: StatusBarService,
): void {
  // Main extraction command
  const extractCommand = vscode.commands.registerCommand('urls-le.extractUrls', async () => {
    // Implementation
  })

  // Show results command
  const showResultsCommand = vscode.commands.registerCommand('urls-le.showResults', async () => {
    // Implementation
  })

  // Show error command
  const showErrorCommand = vscode.commands.registerCommand('urls-le.showError', async () => {
    // Implementation
  })

  // Show warning command
  const showWarningCommand = vscode.commands.registerCommand('urls-le.showWarning', async () => {
    // Implementation
  })

  context.subscriptions.push(
    extractCommand,
    showResultsCommand,
    showErrorCommand,
    showWarningCommand,
  )
}
```

## Best Practices

### Visual Design

- **Consistent colors**: Use standard VS Code color scheme
- **Clear text**: Keep text concise and readable
- **Appropriate icons**: Use meaningful icons when available
- **Tooltip information**: Provide helpful tooltips

### Performance

- **Minimal updates**: Avoid frequent status bar updates
- **Debounced updates**: Group rapid changes
- **Efficient rendering**: Cache status bar items
- **Memory management**: Dispose of unused items

### User Experience

- **Intuitive actions**: Make clickable items obvious
- **Contextual information**: Show relevant details
- **Progress feedback**: Provide operation progress
- **Error handling**: Show clear error states

## Testing

### Manual Testing

1. **Test all states**: Verify each status bar state
2. **Test interactions**: Click on status bar items
3. **Test tooltips**: Verify tooltip information
4. **Test colors**: Check color coding
5. **Test performance**: Monitor update frequency

### Automated Testing

```typescript
describe('Status Bar', () => {
  it('should show idle state initially', () => {
    const statusBar = createStatusBarService(context)

    statusBar.showIdle()

    expect(mainItem.text).toBe('URLs-LE: Ready')
    expect(mainItem.color).toBeUndefined()
    expect(mainItem.command).toBe('urls-le.extractUrls')
  })

  it('should show extracting state during extraction', () => {
    const statusBar = createStatusBarService(context)

    statusBar.showExtracting()

    expect(mainItem.text).toBe('URLs-LE: Extracting...')
    expect(mainItem.color).toBe('blue')
    expect(mainItem.command).toBeUndefined()
  })

  it('should show success state with count', () => {
    const statusBar = createStatusBarService(context)

    statusBar.showSuccess(15)

    expect(mainItem.text).toBe('URLs-LE: 15 URLs found')
    expect(mainItem.color).toBe('green')
    expect(mainItem.command).toBe('urls-le.showResults')
  })
})
```

## Troubleshooting

### Common Issues

**Status bar not showing**

- Check if status bar is enabled in settings
- Verify extension activation
- Check for workspace trust issues

**Status bar not updating**

- Check for extension errors
- Verify status bar service initialization
- Check for command registration issues

**Status bar performance issues**

- Reduce update frequency
- Check for memory leaks
- Verify proper disposal

### Debug Mode

Enable debug mode for detailed status bar logging:

```json
{
  "urls-le.debug": true,
  "urls-le.statusBar.enabled": true
}
```

This will log all status bar updates and interactions to the output channel.

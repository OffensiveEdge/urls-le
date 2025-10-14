# URLs-LE Configuration

## Overview

URLs-LE provides focused configuration options to customize behavior, safety, and user experience. All settings include detailed descriptions, default values, and validation rules.

## Configuration Categories

### Output Settings

Core functionality for extraction results handling.

### Notification Settings

Control notification verbosity and feedback.

### Safety Settings

Resource limits and safety checks to prevent performance issues.

### UI Settings

Status bar and visual interface options.

### Advanced Settings

Telemetry and diagnostic options.

---

## Output Settings

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

---

### `urls-le.dedupeEnabled`

**Type**: `boolean`  
**Default**: `false`  
**Description**: Enable automatic deduplication of extracted URLs.

**Usage**:

```json
{
  "urls-le.dedupeEnabled": true
}
```

**Benefits**:

- Cleaner results without duplicates
- Easier to scan unique URLs
- Reduced output size

---

### `urls-le.postProcess.openInNewFile`

**Type**: `boolean`  
**Default**: `false`  
**Description**: Open extraction results in a new editor window.

**Usage**:

```json
{
  "urls-le.postProcess.openInNewFile": true
}
```

**Benefits**:

- Keep source file open
- Easy comparison between source and results
- Non-intrusive workflow

---

### `urls-le.openResultsSideBySide`

**Type**: `boolean`  
**Default**: `false`  
**Description**: Open extraction results in an editor to the side.

**Usage**:

```json
{
  "urls-le.openResultsSideBySide": true
}
```

**Benefits**:

- View source and results simultaneously
- Easier to reference URLs
- Better for large extractions

---

## Notification Settings

### `urls-le.notificationsLevel`

**Type**: `string`  
**Default**: `"silent"`  
**Options**: `"all"`, `"important"`, `"silent"`  
**Description**: Controls the verbosity of notifications.

**Usage**:

```json
{
  "urls-le.notificationsLevel": "important"
}
```

**Options**:

- `"all"` - Show all notifications including informational messages
- `"important"` - Show only warnings and errors
- `"silent"` - Suppress all notifications (errors still logged to Output panel)

---

### `urls-le.showParseErrors`

**Type**: `boolean`  
**Default**: `false`  
**Description**: Show parse errors as VS Code notifications when parsing fails.

**Usage**:

```json
{
  "urls-le.showParseErrors": true
}
```

**Benefits**:

- Immediate feedback on parsing issues
- Helpful for debugging
- Identify problematic files

---

## Safety Settings

### `urls-le.safety.enabled`

**Type**: `boolean`  
**Default**: `true`  
**Description**: Enable safety checks for large files and operations.

**Usage**:

```json
{
  "urls-le.safety.enabled": true
}
```

**Benefits**:

- Prevents performance issues
- Warns before processing large files
- Protects against memory issues

**Recommendation**: Keep enabled unless processing known large files regularly.

---

### `urls-le.safety.fileSizeWarnBytes`

**Type**: `number`  
**Default**: `1000000` (1 MB)  
**Minimum**: `1000`  
**Description**: Warn when input file size exceeds this threshold in bytes.

**Usage**:

```json
{
  "urls-le.safety.fileSizeWarnBytes": 5000000
}
```

**Guidelines**:

- 1 MB (1000000) - Default, suitable for most files
- 5 MB (5000000) - For larger documentation files
- 10 MB (10000000) - For processing large logs or datasets

---

### `urls-le.safety.largeOutputLinesThreshold`

**Type**: `number`  
**Default**: `50000`  
**Minimum**: `100`  
**Description**: Warn before opening/copying when result lines exceed this threshold.

**Usage**:

```json
{
  "urls-le.safety.largeOutputLinesThreshold": 100000
}
```

**Guidelines**:

- 10000 - For conservative memory usage
- 50000 - Default, balanced
- 100000+ - For processing large URL lists

---

### `urls-le.safety.manyDocumentsThreshold`

**Type**: `number`  
**Default**: `8`  
**Minimum**: `1`  
**Description**: Warn before opening multiple result documents when count exceeds this threshold.

**Usage**:

```json
{
  "urls-le.safety.manyDocumentsThreshold": 5
}
```

**Benefits**:

- Prevents accidentally opening too many editors
- Protects editor performance
- User confirmation for large operations

---

## UI Settings

### `urls-le.statusBar.enabled`

**Type**: `boolean`  
**Default**: `true`  
**Description**: Show URLs-LE status bar entry for quick access.

**Usage**:

```json
{
  "urls-le.statusBar.enabled": true
}
```

**Benefits**:

- Quick access to settings
- Visual feedback during extraction
- Click to open extension settings

---

## Advanced Settings

### `urls-le.telemetryEnabled`

**Type**: `boolean`  
**Default**: `false`  
**Description**: Enable local-only telemetry logs to the Output panel.

**Usage**:

```json
{
  "urls-le.telemetryEnabled": true
}
```

**Privacy**:

- **Local only** - No data sent off your machine
- Logs to VS Code Output panel only
- Helpful for debugging and troubleshooting

**Note**: This is NOT cloud telemetry. All logs stay on your machine.

---

## Configuration Presets

### Minimal (Silent Mode)

```json
{
  "urls-le.notificationsLevel": "silent",
  "urls-le.statusBar.enabled": false,
  "urls-le.safety.enabled": false
}
```

### Balanced (Default)

```json
{
  "urls-le.copyToClipboardEnabled": false,
  "urls-le.dedupeEnabled": false,
  "urls-le.notificationsLevel": "silent",
  "urls-le.postProcess.openInNewFile": false,
  "urls-le.safety.enabled": true,
  "urls-le.statusBar.enabled": true
}
```

### Maximum Productivity

```json
{
  "urls-le.copyToClipboardEnabled": true,
  "urls-le.dedupeEnabled": true,
  "urls-le.notificationsLevel": "important",
  "urls-le.postProcess.openInNewFile": true,
  "urls-le.openResultsSideBySide": true,
  "urls-le.statusBar.enabled": true
}
```

### Development/Debugging

```json
{
  "urls-le.notificationsLevel": "all",
  "urls-le.showParseErrors": true,
  "urls-le.telemetryEnabled": true,
  "urls-le.safety.enabled": true
}
```

---

## Best Practices

### For Web Developers

```json
{
  "urls-le.dedupeEnabled": true,
  "urls-le.postProcess.openInNewFile": true,
  "urls-le.openResultsSideBySide": true
}
```

### For Documentation Writers

```json
{
  "urls-le.copyToClipboardEnabled": true,
  "urls-le.dedupeEnabled": true,
  "urls-le.notificationsLevel": "important"
}
```

### For Large Projects

```json
{
  "urls-le.safety.enabled": true,
  "urls-le.safety.fileSizeWarnBytes": 10000000,
  "urls-le.safety.largeOutputLinesThreshold": 100000,
  "urls-le.notificationsLevel": "important"
}
```

---

## Configuration Tips

### Accessing Settings

1. **VS Code Settings UI**: `Ctrl/Cmd + ,` → Search "URLs-LE"
2. **Command Palette**: `URLs-LE: Open Settings`
3. **settings.json**: Add configurations directly

### Setting Scope

Settings can be configured at:

- **User level**: Applies to all workspaces
- **Workspace level**: Applies to current workspace only
- **Folder level**: Applies to specific folder in multi-root workspace

### Validation

All settings include validation:

- Type checking (boolean, number, string, enum)
- Range validation (minimum values)
- Enum validation (allowed values)

Invalid values will fall back to defaults with a warning.

---

## Troubleshooting

### Settings Not Taking Effect

1. Reload VS Code window: `Developer: Reload Window`
2. Check for syntax errors in settings.json
3. Verify setting names (case-sensitive)
4. Check workspace vs user settings precedence

### Performance Issues

1. Enable safety checks:

   ```json
   {
     "urls-le.safety.enabled": true
   }
   ```

2. Lower thresholds:
   ```json
   {
     "urls-le.safety.fileSizeWarnBytes": 500000,
     "urls-le.safety.largeOutputLinesThreshold": 10000
   }
   ```

### Too Many Notifications

```json
{
  "urls-le.notificationsLevel": "silent"
}
```

---

## Migration Notes

If upgrading from a previous version, note that the following settings have been removed:

- `urls-le.analysis.*` - Analysis features removed in v1.0.2
- `urls-le.validation.*` - Validation features removed in v1.0.2
- `urls-le.keyboard.*` - Keyboard shortcut settings removed in v1.0.2
- `urls-le.presets.*` - Preset system removed in v1.0.2
- `urls-le.performance.*` - Performance settings removed in v1.0.2

The extension now focuses on core URL extraction with simplified configuration.

---

**Last Updated**: 2025-10-14  
**Version**: 1.0.2

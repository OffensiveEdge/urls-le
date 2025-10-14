# URLs-LE Commands

## Overview

URLs-LE provides two focused commands for URL extraction and settings management. Both commands are designed to be lightweight, unobtrusive, and focused on developer productivity.

## Commands

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
Extracted URLs
--------------
Line 5: https://example.com
Line 12: https://api.example.com
Line 18: https://cdn.example.com/image.png

Total: 15 URLs
```

### Open Settings (`urls-le.openSettings`)

**Purpose**: Open the URLs-LE extension settings in VS Code.

**Usage**:

- Command Palette: `URLs-LE: Open Settings`
- Status Bar: Click on URLs-LE status

**Features**:

- Direct access to all extension settings
- Organized by category (Extraction, Output, Performance)
- Real-time preview of changes
- Reset to defaults option

**Settings Categories**:

- **Extraction**: URL types to extract (HTTP, FTP, mailto, tel, file)
- **Output**: Clipboard, deduplication, notifications
- **Performance**: File size limits, processing thresholds

## Error Handling

### Common Errors

- **No Active Editor**: User must open a file first
- **Unsupported Format**: File type not supported for extraction
- **Large File**: File exceeds safety limits (warn before processing)
- **Parse Errors**: Invalid file format or syntax

### Error Messages

- Clear, actionable descriptions
- Suggestions for resolution
- Context-specific help

## Keyboard Shortcuts

### Default Shortcuts

- `Ctrl+Alt+U` (Windows/Linux) / `Cmd+Alt+U` (macOS): Extract URLs

### Customizable Shortcuts

All commands can be assigned custom keyboard shortcuts through VS Code's keyboard shortcuts editor.

## Context Menu Integration

### Supported File Types

- Markdown (`.md`, `.markdown`)
- HTML (`.html`, `.htm`)
- CSS (`.css`)
- JavaScript/TypeScript (`.js`, `.ts`, `.jsx`, `.tsx`)
- JSON (`.json`)
- YAML (`.yml`, `.yaml`)

### Context Menu Items

- Extract URLs (right-click in supported file types)

## Command Palette Integration

### Command Categories

- **URLs-LE**: All extension commands
  - `URLs-LE: Extract URLs`
  - `URLs-LE: Open Settings`

### Search Features

- Fuzzy search support
- Command descriptions
- Keyboard shortcuts display

This command reference provides documentation for all URLs-LE commands, ensuring developers can effectively use the extension for URL extraction tasks.

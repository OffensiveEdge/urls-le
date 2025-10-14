# URLs-LE Commands

## Overview

URLs-LE provides **5 commands** for URL extraction, post-processing, and settings management. All commands are designed to be lightweight, unobtrusive, and focused on developer productivity.

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

## Post-Processing Commands

### Deduplicate URLs (`urls-le.postProcess.dedupe`)

**Purpose**: Remove duplicate URLs from the current document while preserving the original order.

**Usage**:

- Command Palette: `URLs-LE: Deduplicate URLs`

**Features**:

- Removes duplicate URL entries while maintaining first occurrence
- Preserves original URL order
- Works on any text document with URLs (one per line)
- Shows count of removed duplicates
- Provides clear feedback on completion

**Example**:

```
Before:
https://example.com
https://api.example.com
https://example.com
https://cdn.example.com

After:
https://example.com
https://api.example.com
https://cdn.example.com
```

### Sort URLs (`urls-le.postProcess.sort`)

**Purpose**: Sort URLs in the current document with multiple sort modes.

**Usage**:

- Command Palette: `URLs-LE: Sort URLs`

**Sort Modes**:

1. **Alphabetical (A → Z)** - Sort URLs as strings, A to Z
2. **Alphabetical (Z → A)** - Sort URLs as strings, Z to A
3. **By Domain** - Sort by hostname (smart parsing)
4. **By Length (Short → Long)** - Sort by URL length, shortest first
5. **By Length (Long → Short)** - Sort by URL length, longest first

**Features**:

- Interactive sort mode selection via quick pick
- Smart domain extraction for domain-based sorting
- Handles invalid URLs gracefully (alphabetical fallback)
- Works with any URL format
- Shows count of sorted URLs
- Provides clear feedback on completion

**Example**:

```
Before:
https://example.com/very/long/path/to/resource
https://api.example.com
https://example.com

After (Alphabetical A→Z):
https://api.example.com
https://example.com
https://example.com/very/long/path/to/resource
```

## Settings & Help Commands

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

### Help & Troubleshooting (`urls-le.help`)

**Purpose**: Display comprehensive help and troubleshooting information.

**Usage**:

- Command Palette: `URLs-LE: Help & Troubleshooting`

**Help Sections**:

- **Command Overview**: Description of all commands
- **Supported Formats**: List of supported URL schemes and file types
- **Features**: Detailed feature descriptions
- **Common Issues**: Troubleshooting guide
- **Configuration**: Settings explanations
- **Performance Tips**: Optimization suggestions

**Features**:

- Opens in a new editor tab
- Markdown formatted for readability
- Searchable content
- External links to documentation and GitHub

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

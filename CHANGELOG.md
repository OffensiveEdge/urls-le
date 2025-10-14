# Changelog

All notable changes to URLs-LE will be documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-10-14

### Added

- **Command parity achievement** - Full parity with other LE extraction extensions
- **Help command** - Added `urls-le.help` with comprehensive documentation and troubleshooting
- **Deduplicate command** - Added `urls-le.postProcess.dedupe` to remove duplicate URLs while preserving order
- **Sort command** - Added `urls-le.postProcess.sort` with 5 interactive sort modes:
  - Alphabetical (A → Z)
  - Alphabetical (Z → A)
  - By Domain (smart hostname extraction)
  - By Length (Short → Long)
  - By Length (Long → Short)
- **Comprehensive documentation** - Added complete command list to README with examples
- **Extended COMMANDS.md** - Full documentation for all post-processing and help commands
- **i18n support** - Localized command titles for dedupe, sort, and help

### Changed

- **Infrastructure completion** - Fixed activation events and command registry for all commands
- **Command count** - Increased from 2 to 5 commands (Extract, Dedupe, Sort, Settings, Help)
- **Documentation updates** - Updated all docs to reflect command parity achievement

### Fixed

- **Linting issues** - Resolved formatting and code style warnings

## [1.0.6] - 2025-10-14

### Added

- **Help command** - Added comprehensive help and troubleshooting documentation
- **Command palette entry** - "URLs-LE: Help & Troubleshooting" accessible from command palette
- **In-editor docs** - Opens formatted markdown help in new editor tab with URL formats, use cases, and performance tips

### Changed

- **Command count** - Increased from 2 to 3 commands for better user support

## [1.0.5] - 2025-10-14

### Fixed

- **VSCode engine version requirement** - Changed from `^1.105.0` to `^1.70.0` for better compatibility with current VSCode versions

## [1.0.4] - 2025-10-14

### Fixed

- **Excluded sample folder from package** - Added `sample/` to `.vscodeignore` to prevent sample files from being included in VSIX package, fixing CI security warnings

## [1.0.3] - 2025-10-14

### Fixed

#### Critical Issues

- **Notifier now respects notificationsLevel setting** - Info messages only show when level is 'all', warnings show for 'all' or 'important', errors always show
- **Removed unused config properties** - Cleaned up 13 unused settings (analysis, validation, performance) that were removed from package.json but still in code

#### High Priority Issues

- **Fixed memory leak** - Registered errorHandler as disposable to prevent memory leaks on extension reload
- **Cancellation token support** - Added cancellation token parameter to extractUrls() function with checks before expensive operations
- **Dynamic telemetry** - Telemetry now checks config on each event() call and creates output channel lazily
- **JSON.stringify error handling** - Added try-catch to handle circular references and unserializable values in telemetry

#### Medium Priority Issues

- **WorkspaceEdit validation** - Now checks success after applyEdit() and shows error notification if edit fails
- **Clipboard size calculation** - Changed from character count to actual byte size using TextEncoder for accurate 1MB limit
- **URL validation** - Enhanced filtering for url.value existence and type checking

#### Code Quality

- **Removed dead code** - Deleted unused StatusBar methods (showValidating, showAnalyzing)
- **Removed unused dependencies** - Cleaned up Localizer, PerformanceMonitor, and ErrorHandler from command registration
- **Fixed analysis.ts** - Now always includes security and accessibility analysis
- **Fixed validation.ts** - Uses default timeout values instead of removed config properties

### Added

- **Complete i18n support** - Added 30+ runtime localization strings for all user-facing messages
- **Localized extract command** - All hardcoded strings now use localize() function with proper placeholders
- **Enhanced error messages** - Added localized error suggestions for better user guidance

### Changed

- **Updated Configuration interface** - Removed unused properties to match actual available settings
- **Simplified config validation** - Removed validation for deleted configuration properties
- **Test updates** - Updated all tests to match new Configuration interface

### Testing

- All 102 tests passing
- Test coverage generated and verified
- No linter errors

## [1.0.2] - 2025-10-14

### Changed

- Simplified to 2 core commands: Extract URLs (`Ctrl+Alt+U`) and Open Settings
- Removed validation, analysis, accessibility, and help commands
- Streamlined for production-ready v1.0 release focused on core extraction

### Added

- Sample test files (HTML, Markdown, JavaScript)

### Documentation

- Updated README to remove references to removed features
- Updated COMMANDS.md to reflect streamlined command set
- Clarified focus on URL extraction without analysis features

## [1.0.1] - 2025-10-14

### Fixed

- Fixed duplicate URL extraction in HTML, Markdown, and JavaScript parsers
- Added global deduplication to prevent same URL from being extracted multiple times
- Fixed all failing tests (35 → 0 failures)

### Documentation

- Added accurate test coverage metrics: 102 passing tests across 7 test suites with 33.43% overall coverage
- Updated LE family cross-linking with published apps
- Marked Colors-LE and Dates-LE as "Coming Soon"

## [1.0.0] - 2025-08-17

### ✨ Initial Release

**URLs-LE** - Zero Hassle URL Extraction from Documentation, Configs, and Code.

#### **Core Functionality**

- **Multi-format support**: HTTP, HTTPS, FTP, mailto, tel, file, and relative URLs.
- **One-command extraction**: `Ctrl+Alt+U` (`Cmd+Alt+U` on macOS) or Command Palette.
- **Multiple access methods**: Context menu, status bar, Quick Fix (Code Actions).

#### **Advanced Features**

- **Smart analysis & insights**: Detailed reports on URL usage patterns, domain analysis, and security validation.
- **Web development support**: Perfect for analyzing API endpoints, asset references, and external links.
- **Safety guardrails**: Warnings for large files and operations.

#### **Enterprise Ready**

- **Internationalization**: Full localization support.
- **Virtual workspace support**: Compatible with GitHub Codespaces, Gitpod.
- **Untrusted workspace handling**: Safe operation in restricted environments.

#### **Supported File Formats**

- **Web**: HTML, CSS, JavaScript, TypeScript
- **Data**: JSON, YAML, Markdown
- **Configuration**: Config files, documentation

#### **URL Types**

- **Web**: HTTP, HTTPS
- **File Transfer**: FTP
- **Communication**: mailto, tel
- **Local**: file:// URLs
- **Relative**: Path-based URLs

#### **Analysis Features**

- **Domain analysis**: Distribution, subdomains, TLD analysis
- **Security analysis**: Suspicious patterns, mixed content detection
- **Accessibility analysis**: Alt text, descriptive links, contrast analysis
- **Validation**: Format validation, protocol validation, domain validation

#### **Performance**

- **Small files (< 1MB)**: < 100ms extraction
- **Medium files (1-10MB)**: < 500ms extraction
- **Large files (> 10MB)**: < 2s with streaming
- **Memory usage**: < 50MB for typical operations

#### **Configuration**

- **Safety settings**: File size limits, operation timeouts
- **Analysis settings**: Security, accessibility, pattern detection
- **Validation settings**: Network request configuration
- **UI settings**: Status bar, notifications, clipboard integration

#### **Commands**

- **Extract URLs**: Main extraction command with format detection
- **Validate URLs**: URL validation and security checking
- **Analyze URLs**: Domain and pattern analysis
- **Open Settings**: Quick access to configuration
- **Help & Troubleshooting**: Comprehensive help system
- **Export/Import Settings**: Configuration management

#### **Quality Features**

- **Error handling**: Graceful error recovery and user feedback
- **Progress indicators**: Real-time progress for large operations
- **Cancellation support**: User can cancel long-running operations
- **Memory management**: Efficient memory usage and cleanup
- **Performance monitoring**: Built-in performance tracking and optimization

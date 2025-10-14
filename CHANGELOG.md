# Changelog

All notable changes to URLs-LE will be documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

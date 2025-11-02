# Changelog

All notable changes to URLs-LE will be documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.8.1] - 2025-11-02

### Documentation

- **LE Family Updates** - Added Regex-LE and Secrets-LE to the "More from the LE Family" section in README

## [1.8.0] - 2025-10-26

### Security & Enterprise Readiness

- **URL Injection Prevention** - Added 83 comprehensive security tests covering:
  - JavaScript protocol injection (`javascript:`, `data:`, `vbscript:`)
  - SSRF prevention (internal networks, cloud metadata endpoints)
  - File protocol exploitation (`file://`)
  - Browser extension protocol abuse
  - URL encoding attack vectors
  - Open redirect prevention
  - CRLF injection protection
- **Edge Case Hardening** - Added 71 tests for production reliability:
  - Content size limits (prevents memory exhaustion)
  - URL count limits (prevents DoS)
  - Cancellation token support
  - Malformed input handling
  - Performance edge cases
- **Test Suite Expansion** - Increased from 193 to 347 unit tests (+80%)
  - 95% function coverage, 86% line coverage
  - Zero critical vulnerabilities
  - Enterprise-grade reliability

### Quality Improvements

- **Type Safety** - 100% TypeScript strict mode compliance
- **Immutability** - All exports frozen with `Object.freeze()`
- **Dependency Security** - Zero vulnerabilities in dependency chain

## [1.7.0] - 2025-01-27

### Initial Public Release

URLs-LE brings zero-hassle URL extraction to VS Code. Simple, reliable, focused.

#### Supported File Types

- **HTML** - Web pages and templates
- **CSS** - Stylesheets with asset references
- **JavaScript** - JS files with API calls and imports
- **TypeScript** - TS files with API calls and imports
- **JSON** - API responses and configuration files
- **YAML** - Configuration and data files
- **XML** - Structured data and metadata
- **TOML** - Configuration files
- **INI** - Configuration files
- **Properties** - Java properties files
- **Markdown** - Documentation and README files

#### Features

- **Multi-language support** - Comprehensive localization for 12+ languages
- **Intelligent URL detection** - Detects HTTP/HTTPS URLs while filtering out `data:` URIs and `javascript:` pseudo-protocols
- **Automatic cleanup built-in**:
  - **Sort** for stable analysis and reviews
  - **Dedupe** to eliminate noise
  - **Filter** by protocol or domain
- **Stream processing** - Work with large numbers of URLs without locking VS Code
- **High-performance** - Benchmarked for 10,000+ URLs per second
- **One-command extraction** - `Ctrl+Alt+U` (`Cmd+Alt+U` on macOS)
- **Developer-friendly** - 193 passing tests (94.99% function coverage, 85.94% line coverage), TypeScript strict mode, functional programming, MIT licensed

#### Use Cases

- **Web Auditing** - Extract all links and resources from HTML/CSS for validation
- **API Documentation** - Pull API endpoints from docs and code for cataloging
- **Link Validation** - Find all external URLs for broken link checking
- **Resource Tracking** - Audit CDN and asset URLs across your project

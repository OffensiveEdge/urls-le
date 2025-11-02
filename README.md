<p align="center">
  <img src="src/assets/images/icon.png" alt="URLs-LE Logo" width="96" height="96"/>
</p>
<h1 align="center">URLs-LE: Zero Hassle URL Extraction</h1>
<p align="center">
  <b>Extract 10,000+ URLs per second</b> • <b>100x faster than manual searching</b><br/>
  <i>HTML, CSS, JavaScript, JSON, YAML, XML, TOML, INI, Properties, Markdown, and more</i>
</p>

<p align="center">
  <a href="https://open-vsx.org/extension/OffensiveEdge/urls-le">
    <img src="https://img.shields.io/badge/Install%20from-Open%20VSX-blue?style=for-the-badge&logo=visualstudiocode" alt="Install from Open VSX" />
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.urls-le">
    <img src="https://img.shields.io/badge/Install%20from-VS%20Code-blue?style=for-the-badge&logo=visualstudiocode" alt="Install from VS Code" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/open-vsx/dt/OffensiveEdge/urls-le?label=downloads&color=green" alt="Downloads" />
  <img src="https://img.shields.io/open-vsx/rating/OffensiveEdge/urls-le?label=rating&color=yellow" alt="Rating" />
  <img src="https://img.shields.io/badge/Open%20Source-100%25-purple" alt="100% Open Source" />
  <img src="https://img.shields.io/badge/Vulnerabilities-0%20Critical-brightgreen" alt="Zero Critical Vulnerabilities" />
</p>

---

<p align="center">
  <img src="src/assets/images/demo.gif" alt="URL Extraction Demo" style="max-width: 100%; height: auto;" />
</p>

<p align="center">
  <img src="src/assets/images/command-palette.png" alt="Command Palette" style="max-width: 80%; height: auto;" />
</p>

---

## ⚡ See It In Action

**Before**: Manually searching through HTML/CSS for broken links (20 minutes)

```html
<link href="https://cdn.example.com/style.css" />
<img src="https://images.example.com/logo.png" />
<!-- ... 100 more URLs scattered across files -->
```

**After**: One command extracts all 103 URLs in 0.5 seconds

```
https://cdn.example.com/style.css (line 5)
https://images.example.com/logo.png (line 8)
https://api.example.com/users (line 45)
... (103 URLs total)
```

**Time Saved**: 20 minutes → 1 second ⚡

---

## ✅ Why URLs-LE?

- **10,000+ URLs per second** - 100x faster than manual searching
- **Zero Config** - Install → Press `Cmd+Alt+U` → Done
- **Battle-Tested** - 347 unit tests, 95% coverage, zero critical vulnerabilities
- **Security-Hardened** - 83 tests prevent URL injection, SSRF attacks, protocol exploitation

Perfect for API audits, link validation, and resource tracking.

---

## 🙏 Thank You

If URLs-LE saves you time, a quick rating helps other developers discover it:  
⭐ [Open VSX](https://open-vsx.org/extension/OffensiveEdge/urls-le) • [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.urls-le)

---

### Key Features

- **Automatic cleanup** - Sort, dedupe, and filter by protocol or domain
- **10+ file formats** - HTML, CSS, JavaScript, JSON, YAML, XML, Markdown, TOML, INI
- **Smart filtering** - Excludes `data:` URIs and `javascript:` pseudo-protocols
- **Fast at scale** - Process large documentation and config files efficiently
- **13 languages** - English, Chinese, German, Spanish, French, Indonesian, Italian, Japanese, Korean, Portuguese, Russian, Ukrainian, Vietnamese

## 🚀 More from the LE Family

- **[String-LE](https://open-vsx.org/extension/OffensiveEdge/string-le)** - Extract user-visible strings for i18n and validation • [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.string-le)
- **[Numbers-LE](https://open-vsx.org/extension/OffensiveEdge/numbers-le)** - Extract and analyze numeric data with statistics • [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.numbers-le)
- **[EnvSync-LE](https://open-vsx.org/extension/OffensiveEdge/envsync-le)** - Keep .env files in sync with visual diffs • [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.envsync-le)
- **[Paths-LE](https://open-vsx.org/extension/OffensiveEdge/paths-le)** - Extract file paths from imports and dependencies • [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.paths-le)
- **[Regex-LE](https://open-vsx.org/extension/OffensiveEdge/regex-le)** - Test and validate regex patterns with live feedback • [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.regex-le)
- **[Secrets-LE](https://open-vsx.org/extension/OffensiveEdge/secrets-le)** - Detect and sanitize secrets before you commit • [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.secrets-le)
- **[Scrape-LE](https://open-vsx.org/extension/OffensiveEdge/scrape-le)** - Validate scraper targets before debugging • [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.scrape-le)
- **[Colors-LE](https://open-vsx.org/extension/OffensiveEdge/colors-le)** - Extract and analyze colors from stylesheets • [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.colors-le)
- **[Dates-LE](https://open-vsx.org/extension/OffensiveEdge/dates-le)** - Extract temporal data from logs and APIs • [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.dates-le)

## 💡 Use Cases

- **Web Auditing** - Extract all links and resources from HTML/CSS for validation
- **API Documentation** - Pull API endpoints from docs and code for cataloging
- **Link Validation** - Find all external URLs for broken link checking
- **Resource Tracking** - Audit CDN and asset URLs across your project

## 🚀 Quick Start

1. Install from [Open VSX](https://open-vsx.org/extension/OffensiveEdge/urls-le) or [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.urls-le)
2. Open any supported file type (`Cmd/Ctrl + P` → search for "URLs-LE")
3. Run Quick Extract (`Cmd+Alt+U` / `Ctrl+Alt+U` / Status Bar)

## ⚙️ Configuration

URLs-LE has minimal configuration to keep things simple. Most settings are available in VS Code's settings UI under "URLs-LE".

Key settings include:

- Output format preferences (side-by-side, clipboard copy)
- Safety warnings and thresholds for large files
- Notification levels (silent, important, all)
- Status bar visibility
- Local telemetry logging for debugging

For the complete list of available settings, open VS Code Settings and search for "urls-le".

## 🌍 Language Support

**13 languages**: English, German, Spanish, French, Indonesian, Italian, Japanese, Korean, Portuguese (Brazil), Russian, Ukrainian, Vietnamese, Chinese (Simplified)

## 🧩 System Requirements

**VS Code** 1.70.0+ • **Platform** Windows, macOS, Linux  
**Memory** 200MB recommended for large files

## 🔒 Privacy

100% local processing. No data leaves your machine. Optional logging: `urls-le.telemetryEnabled`

## ⚡ Performance

<!-- PERFORMANCE_START -->

URLs-LE is built for speed and efficiently processes files from 100KB to 30MB+. See [detailed benchmarks](docs/PERFORMANCE.md).

| Format   | File Size | Throughput | Duration | Memory | Tested On     |
| -------- | --------- | ---------- | -------- | ------ | ------------- |
| **JSON** | 1K lines  | 1,382,278  | ~1.58    | < 1MB  | Apple Silicon |
| **CSS**  | 3K lines  | 1,048,387  | ~0.31    | < 1MB  | Apple Silicon |
| **HTML** | 10K lines | 298,122    | ~4.26    | < 1MB  | Apple Silicon |

**Note**: Performance results are based on files containing actual URLs. Files without URLs (like large JSON/CSV data files) are processed much faster but extract 0 URLs.  
**Real-World Performance**: Tested with actual data up to 30MB (practical limit: 1MB warning, 10MB error threshold)  
**Performance Monitoring**: Built-in real-time tracking with configurable thresholds  
**Full Metrics**: [docs/PERFORMANCE.md](docs/PERFORMANCE.md) • Test Environment: macOS, Bun 1.2.22, Node 22.x

For detailed information, see [Performance Monitoring](docs/PERFORMANCE.md).

<!-- PERFORMANCE_END -->

## 🔧 Troubleshooting

**Not detecting URLs?**  
Ensure file is saved with supported extension (.html, .css, .js, .json, .yaml, .md)

**Large files slow?**  
Files over 10MB may take longer. Consider splitting into smaller chunks

**Need help?**  
Check [Issues](https://github.com/OffensiveEdge/urls-le/issues) or enable logging: `urls-le.telemetryEnabled: true`

## ❓ FAQ

**What URLs are extracted?**  
HTTP/HTTPS, FTP, mailto, tel, file URLs (excludes `data:` and `javascript:` pseudo-protocols)

**Can I deduplicate?**  
Yes, enable `urls-le.dedupeEnabled: true` to remove duplicates automatically

**Max file size?**  
Up to 30MB. Practical limit: 10MB for optimal performance

**Perfect for web projects?**  
Absolutely! Audit API endpoints, asset references, and external links for broken URLs

## 📊 Testing

**347 unit tests** • **95% function coverage, 86% line coverage**  
Powered by Vitest • Run with `bun run test:coverage`

### Core Principle

**No broken or failed tests are allowed in commits.** All tests must pass before code can be committed or merged.

### Test Suite Highlights

- **83 security tests** for URL injection & SSRF prevention
- **71 edge case tests** for extraction logic & performance
- **37 tests** for JavaScript/TypeScript URL extraction
- **34 tests** for content limits, cancellation, and error handling
- **Comprehensive coverage** of all file formats and protocols

For detailed testing guidelines, see [Testing Guidelines](docs/TESTING.md).

---

Copyright © 2025
<a href="https://github.com/OffensiveEdge">@OffensiveEdge</a>. All rights reserved.

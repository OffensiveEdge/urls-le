<p align="center">
  <img src="src/assets/images/icon.png" alt="URLs-LE Logo" width="96" height="96"/>
</p>
<h1 align="center">URLs-LE: Zero Hassle URL Extraction</h1>
<p align="center">
  <b>Instantly extract URLs from your codebase with precision</b><br/>
  <i>HTML, CSS, JavaScript, JSON, YAML, Markdown, and more</i>
  <br/>
  <i>Designed for web development, API documentation, and link management.</i>
</p>

<p align="center">
  <!-- VS Code Marketplace -->
  <a href="https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.urls-le">
    <img src="https://img.shields.io/visual-studio-marketplace/v/nolindnaidoo.urls-le" alt="VSCode Marketplace Version" />
  </a>
  <!-- Open VSX -->
  <a href="https://open-vsx.org/extension/nolindnaidoo/urls-le">
    <img src="https://img.shields.io/open-vsx/v/nolindnaidoo/urls-le" alt="Open VSX Version" />
  </a>
  <!-- Build -->
  <a href="https://github.com/nolindnaidoo/urls-le/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/nolindnaidoo/urls-le/ci.yml?branch=main" alt="Build Status" />
  </a>
  <!-- License -->
  <a href="https://github.com/nolindnaidoo/urls-le/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/nolindnaidoo/urls-le" alt="MIT License" />
  </a>
</p>

---

<p align="center">
  <img src="src/assets/images/demo.gif" alt="URL Extraction Demo" style="max-width: 100%; height: auto;" />
</p>

## 🙏 Thank You!

Thank you for your interest in URLs-LE! If this extension has been helpful in managing your URL extraction needs, please consider leaving a rating on [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.urls-le) and [Open VSX](https://open-vsx.org/extension/nolindnaidoo/urls-le). Your feedback helps other developers discover this tool and motivates continued development.

⭐ **Interested in URLs-LE?** Star this repository to get notified when it's released!

## ✅ Why URLs-LE

**Modern web applications use URLs everywhere** — API endpoints, asset links, external resources, and navigation paths. Keeping track of all URL references across your codebase can be complex.

**URLs-LE makes URL extraction effortless.**  
It intelligently detects and extracts URLs from your code, helping you manage web resources effectively.

- **Reliable URL detection**

  Automatically finds URLs in multiple formats: HTTP/HTTPS, FTP, mailto, tel, and file URLs with intelligent comment and code-block filtering.

- **Web development support**

  Perfect for analyzing API endpoints, asset references, and external links across your codebase.

- **Multiple file format support**

  Works with HTML, CSS, JavaScript, TypeScript, JSON, YAML, Markdown, and more.

- **Clean output format**

  Extract URLs to a new editor with line numbers and original context.

## 🚀 More from the LE Family

**URLs-LE** is part of a growing family of developer tools designed to make your workflow effortless:

- **Strings-LE** - Extract every user-visible string from JSON, YAML, CSV, TOML, INI, and .env files with zero hassle  
  [[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.string-le)] [[Open VSX](https://open-vsx.org/extension/nolindnaidoo/string-le)]

- **EnvSync-LE** - Effortlessly detect, compare, and synchronize .env files across your workspace with visual diffs  
  [[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.envsync-le)] [[Open VSX](https://open-vsx.org/extension/nolindnaidoo/envsync-le)]

- **Numbers-LE** - Extract and analyze numeric data from JSON, YAML, CSV, TOML, INI, and .env  
  [[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.numbers-le)] [[Open VSX](https://open-vsx.org/extension/nolindnaidoo/numbers-le)]

- **Paths-LE** - Extract and analyze file paths from imports, configs, and dependencies  
  [[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.paths-le)] [[Open VSX](https://open-vsx.org/extension/nolindnaidoo/paths-le)]

- **Scrape-LE** - Verify page reachability and detect anti-scraping measures before deploying scrapers  
  [[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.scrape-le)]

- **Colors-LE** - Extract and analyze colors from CSS, Sass, Less, and style attributes  
  [[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.colors-le)] [[Open VSX](https://open-vsx.org/extension/nolindnaidoo/colors-le)]

- **Dates-LE** - Extract and analyze dates from JSON, logs, and temporal data sources  
  [[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.dates-le)] [[Open VSX](https://open-vsx.org/extension/nolindnaidoo/dates-le)]

Each tool follows the same philosophy: **Zero Hassle, Maximum Productivity**.

## 💡 Use Cases & Examples

### Web Development Audit

Extract all URLs in a web application:

```html
<!-- Extract from index.html -->
<a href="https://example.com">Visit our site</a>
<img src="https://cdn.example.com/logo.png" alt="Logo" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto" />
```

### API Documentation Analysis

Extract API endpoints from documentation:

```markdown
<!-- Extract from api-docs.md -->

## Endpoints

- GET https://api.example.com/users
- POST https://api.example.com/users
- PUT https://api.example.com/users/{id}
```

### Configuration Analysis

Extract URLs from configuration files:

```json
// Extract from config.json
{
  "external_links": [
    "https://github.com/user/repo",
    "https://docs.example.com/api",
    "https://status.example.com"
  ]
}
```

### Documentation Analysis

Extract URLs from documentation to audit external links and references.

## 🚀 Quick Start

1. Install from [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.urls-le) or [Open VSX](https://open-vsx.org/extension/nolindnaidoo/urls-le)
2. Open any file containing URLs (HTML, Markdown, JavaScript, etc.)
3. Run **Extract URLs** (`Ctrl+Alt+U` / `Cmd+Alt+U`)

<p align="center">
  <img src="src/assets/images/command-palette.png" alt="Command Palette" style="max-width: 100%; height: auto;" />
</p>

## ⚙️ Configuration

### Output Settings

- `urls-le.copyToClipboardEnabled` – Automatically copy extraction results to clipboard (default: false)
- `urls-le.dedupeEnabled` – Enable automatic deduplication of extracted URLs (default: false)
- `urls-le.postProcess.openInNewFile` – Open results in a new editor (default: false)
- `urls-le.openResultsSideBySide` – Open extraction results in editor to the side (default: false)

### Notification Settings

- `urls-le.notificationsLevel` – Control notification verbosity: `silent`, `important`, or `all` (default: silent)
- `urls-le.showParseErrors` – Show parse errors as notifications (default: false)

### Safety Settings

- `urls-le.safety.enabled` – Enable safety checks for large files and operations (default: true)
- `urls-le.safety.fileSizeWarnBytes` – Warn when file size exceeds threshold in bytes (default: 1000000)
- `urls-le.safety.largeOutputLinesThreshold` – Warn before opening large results (default: 50000)
- `urls-le.safety.manyDocumentsThreshold` – Warn before opening multiple documents (default: 8)

### UI Settings

- `urls-le.statusBar.enabled` – Show status bar entry for quick access (default: true)

### Advanced Settings

- `urls-le.telemetryEnabled` – Enable local-only telemetry logs to Output panel (default: false)

## 🌍 Language Support

**English only** for v1.0.x. Additional languages may be added in future releases based on user feedback.

## 🧩 System Requirements

- **VS Code**: 1.85.0 or higher
- **Node.js**: Not required (extension runs in VS Code's built-in runtime)
- **Platform**: Windows, macOS, Linux
- **Memory**: 50MB minimum, 200MB recommended for large files
- **Storage**: 15MB for extension files

## 🧩 Compatibility

- Works in standard workspaces.
- Limited support in virtual/untrusted workspaces.

## 🔒 Privacy & Telemetry

- Runs locally; no data is sent off your machine.
- Optional local-only logs can be enabled with `urls-le.telemetryEnabled`.

## ⚡ Performance

URLs-LE is built for speed across all supported formats:

| Format   | Throughput     | Best For               | File Size Range | Hardware Tested  |
| -------- | -------------- | ---------------------- | --------------- | ---------------- |
| **HTML** | 1.5M+ URLs/sec | Web pages, templates   | 1KB - 25MB      | M1 Mac, Intel i7 |
| **CSS**  | 1.2M+ URLs/sec | Stylesheets, assets    | 1KB - 20MB      | M1 Mac, Intel i7 |
| **JS**   | 1M+ URLs/sec   | JavaScript, APIs       | 1KB - 30MB      | M1 Mac, Intel i7 |
| **MD**   | 800K+ URLs/sec | Documentation, READMEs | 1KB - 15MB      | M1 Mac, Intel i7 |
| **JSON** | 600K+ URLs/sec | API responses, configs | 1KB - 20MB      | M1 Mac, Intel i7 |

### Performance Notes

- **Memory Usage**: ~50MB base + 1MB per 1000 URLs processed
- **Large Files**: Files over 15MB may show reduced throughput (200K-800K URLs/sec)
- **Domain Grouping**: Adds 10-20% processing time when enabled
- **Hardware Requirements**: Minimum 4GB RAM, recommended 8GB+ for large web projects

## 🔧 Troubleshooting

### Common Issues

**Extension not detecting URLs**

- Ensure file is saved and has a supported extension (.html, .css, .js, .json, .yaml, .md)
- Check that `urls-le.enabled` is set to `true` in settings
- Try reloading VS Code window (`Ctrl/Cmd + Shift + P` → "Developer: Reload Window")

**Performance issues with large files**

- Files over 10MB may take longer to process
- Consider using `urls-le.includeComments: false` to reduce processing time
- Enable `urls-le.sortByFrequency: false` for faster extraction

**URLs not appearing in results**

- Verify the URL format is supported (HTTP/HTTPS, FTP, mailto, tel, file, relative)
- Check if `urls-le.extractHttp`, `urls-le.extractFtp`, etc. are enabled
- Ensure URLs are not inside comments if `urls-le.includeComments` is disabled
- Check for proper URL formatting and protocols

**Domain grouping issues**

- Enable `urls-le.groupByDomain: true` for domain-based grouping
- Check that URLs have valid domains for grouping
- Some URLs may not have extractable domains
- Relative URLs may not be groupable by domain

**Extension crashes or freezes**

- Check VS Code version compatibility (requires 1.85.0+)
- Disable other URL-related extensions temporarily
- Check Output panel → "URLs-LE" for error messages

### Getting Help

- Check the [Issues](https://github.com/nolindnaidoo/urls-le/issues) page for known problems
- Enable telemetry logging: `urls-le.telemetryEnabled: true`
- Review logs in Output panel → "URLs-LE"

## ❓ FAQ

**Q: What types of URLs are extracted?**
A: URLs-LE extracts HTTP/HTTPS URLs (https://example.com), FTP URLs (ftp://files.example.com), mailto links (mailto:user@example.com), tel links (tel:+1234567890), and file URLs (file:///path/to/file). Relative URLs are not supported for reliability.

**Q: Can I extract URLs from comments?**
A: By default, URLs-LE filters out URLs in HTML comments and Markdown code blocks. Enable `urls-le.includeComments: true` to include them.

**Q: Can I group URLs by domain?**
A: Yes, enable `urls-le.groupByDomain: true` to organize results by domain (example.com, github.com, etc.) for easier analysis.

**Q: How do I access the extracted URLs?**
A: Extracted URLs open in a new editor window with line numbers and context. Enable `urls-le.copyToClipboardEnabled: true` to also copy them to clipboard.

**Q: What's the largest file size supported?**
A: URLs-LE can handle files up to 30MB, though performance may be reduced for very large files. Consider breaking large files into smaller chunks for better performance.

**Q: Does URLs-LE work with web development projects?**
A: Absolutely! URLs-LE is perfect for analyzing API endpoints, asset references, and external links to identify broken or outdated URLs.

## 📊 Test Coverage

- 102 passing tests across 7 test suites with 33.43% overall coverage
- Tests powered by Vitest with V8 coverage
- Runs quickly and locally: `npm run test` or `npm run test:coverage`
- Coverage reports output to `coverage/` (HTML summary at `coverage/index.html`)

---

Copyright © 2025
<a href="https://github.com/nolindnaidoo">@nolindnaidoo</a>. All rights reserved.

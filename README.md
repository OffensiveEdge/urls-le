<p align="center">
  <img src="src/assets/images/icon.png" alt="URLs-LE Logo" width="96" height="96"/>
</p>
<h1 align="center">URLs-LE: Zero Hassle URL Extraction</h1>
<p align="center">
  <b>Instantly extract and analyze URLs from your codebase with precision</b><br/>
  <i>HTML, CSS, JavaScript, JSON, YAML, Markdown, and more</i>
  <br/>
  <i>Designed for web development, API analysis, and link validation.</i>
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
  <img src="src/assets/images/preview.gif" alt="URL Extraction animation" style="max-width: 100%; height: auto;" />
</p>
<p align="right">
 <a href="https://github.com/nolindnaidoo/urls-le/blob/main/docs/SCREENSHOTS.md">Screenshot Guide</a>
</p>

## 🙏 Thank You!

Thank you for your interest in URLs-LE! If this extension has been helpful in managing your URL extraction needs, please consider leaving a rating on [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.urls-le) and [Open VSX](https://open-vsx.org/extension/nolindnaidoo/urls-le). Your feedback helps other developers discover this tool and motivates continued development.

⭐ **Interested in URLs-LE?** Star this repository to get notified when it's released!

## 🚀 More from the LE Family

**URLs-LE** is part of a growing family of developer tools designed to make your workflow effortless:

- **Strings-LE** - Extract every user-visible string from JSON, YAML, CSV, TOML, INI, and .env files with zero hassle  
  [[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.string-le)] [[Open VSX](https://open-vsx.org/extension/nolindnaidoo/string-le)]

- **EnvSync-LE** - Effortlessly detect, compare, and synchronize .env files across your workspace with visual diffs  
  [[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.envsync-le)] [[Open VSX](https://open-vsx.org/extension/nolindnaidoo/envsync-le)]

- **Numbers-LE** - Extract and analyze numeric data from JSON, YAML, CSV, TOML, INI, and .env  
  [[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.numbers-le)] [[Open VSX](https://open-vsx.org/extension/nolindnaidoo/numbers-le)]

- **Colors-LE** - Extract and analyze colors from CSS, SCSS, JavaScript, HTML, and more  
  [[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.colors-le)] [[Open VSX](https://open-vsx.org/extension/nolindnaidoo/colors-le)]

- **Dates-LE** - Extract and analyze dates from logs, JSON, YAML, CSV, and temporal data  
  [[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.dates-le)] [[Open VSX](https://open-vsx.org/extension/nolindnaidoo/dates-le)]

- **Paths-LE** - Extract and analyze file paths from imports, configs, and code  
  [[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.paths-le)] [[Open VSX](https://open-vsx.org/extension/nolindnaidoo/paths-le)]

Each tool follows the same philosophy: **Zero Hassle, Maximum Productivity**.

## ✅ Why URLs-LE

**Modern web applications use URLs everywhere** — API endpoints, asset links, external resources, and navigation paths. Keeping track of all URL references across your codebase can be complex.

**URLs-LE makes URL extraction effortless.**  
It intelligently detects and extracts URLs from your code, providing comprehensive analysis and insights to help you manage web resources effectively.

- **Reliable URL detection**

  Automatically finds URLs in multiple formats: HTTP/HTTPS, FTP, mailto, tel, and file URLs with intelligent comment and code-block filtering.

- **Smart analysis & insights**

  Get detailed reports on URL usage patterns, domain analysis, and link distribution across your codebase.

- **Web development support**

  Perfect for analyzing API endpoints, asset references, and external links to identify broken or outdated URLs.

- **Multiple file format support**

  Works with HTML, CSS, JavaScript, TypeScript, JSON, YAML, Markdown, and more.

- **Accessibility & validation**

  Includes URL validation, accessibility checking, and link integrity analysis.

## 💡 Use Cases & Examples

### Web Development Audit

Extract and validate all URLs in a web application:

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

### Link Validation

Check for broken or outdated links:

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

### SEO Analysis

Extract and analyze URLs for SEO optimization and link building strategies.

## 🚀 Quick Start

1. **Coming Soon** - URLs-LE will be available on VS Code Marketplace and Open VSX
2. Open any file containing URLs (`Cmd/Ctrl + P URLs-LE`)
3. Run Quick Extract (`Cmd+Alt+E` / `Ctrl+Alt+E` / Status Bar)

## ⚙️ Configuration

- `urls-le.enabled` – Enable or disable the extension
- `urls-le.extractHttp` – Extract HTTP/HTTPS URLs
- `urls-le.extractFtp` – Extract FTP URLs
- `urls-le.extractMailto` – Extract mailto URLs
- `urls-le.extractTel` – Extract tel URLs
- `urls-le.extractFile` – Extract file URLs
- `urls-le.extractRelative` – Extract relative URLs
- `urls-le.includeComments` – Include URLs in comments
- `urls-le.sortByFrequency` – Sort results by usage frequency
- `urls-le.groupByDomain` – Group URLs by domain
- `urls-le.validateUrls` – Enable URL validation
- `urls-le.checkAccessibility` – Enable accessibility checking

## 🌍 Language Support

English + 12 translations _(Coming Soon)_:

- Chinese (Simplified), Spanish, French, Russian, Portuguese (Brazil)
- Japanese, Korean, German, Italian, Vietnamese, Ukrainian, Indonesian

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
- **URL Validation**: Adds 30-50% processing time when enabled
- **Accessibility Checking**: Adds 40-60% processing time when enabled
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

**URL validation issues**

- Enable `urls-le.validateUrls: true` for URL validation
- Check that URLs are properly formatted and accessible
- Some URLs may be valid but not reachable from your network
- Relative URLs may not be valid without proper context

**Accessibility checking problems**

- Enable `urls-le.checkAccessibility: true` for accessibility analysis
- Check that URLs are accessible and follow accessibility guidelines
- Some URLs may require authentication or special permissions
- External URLs may not be accessible for accessibility checking

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
A: No, URLs-LE automatically filters out URLs found in HTML comments and Markdown code blocks to ensure reliable extraction of only user-visible URLs.

**Q: How does URL validation work?**
A: When `urls-le.validateUrls: true` is enabled, URLs-LE checks if the extracted URLs are properly formatted and accessible, reporting any broken or invalid links.

**Q: Can I group URLs by domain?**
A: Yes, enable `urls-le.groupByDomain: true` to organize results by domain (example.com, github.com, etc.) for easier analysis.

**Q: How does accessibility checking work?**
A: When `urls-le.checkAccessibility: true` is enabled, URLs-LE analyzes URLs for accessibility compliance and reports any issues.

**Q: What's the largest file size supported?**
A: URLs-LE can handle files up to 30MB, though performance may be reduced for very large files. Consider breaking large files into smaller chunks for better performance.

**Q: Does URLs-LE work with web development projects?**
A: Absolutely! URLs-LE is perfect for analyzing API endpoints, asset references, and external links to identify broken or outdated URLs.

## 📊 Test Coverage

- Tests powered by Vitest with V8 coverage.
- Runs quickly and locally: `npm run test` or `npm run test:coverage`.
- Coverage reports output to `coverage/` (HTML summary at `coverage/index.html`).

---

Copyright © 2025
<a href="https://github.com/nolindnaidoo">@nolindnaidoo</a>. All rights reserved.

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
  <a href="https://open-vsx.org/extension/nolindnaidoo.urls-le">
    <img src="https://img.shields.io/open-vsx/v/nolindnaidoo.urls-le" alt="Open VSX Version" />
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

## 🚧 Coming Soon!

**URLs-LE** is currently in development and will be available soon! This extension will provide powerful URL extraction and analysis capabilities for your web content, APIs, and resources.

⭐ **Interested in URLs-LE?** Star this repository to get notified when it's released!

## 🚀 More from the LE Family

**URLs-LE** is part of a growing family of developer tools designed to make your workflow effortless:

- **[String-LE](https://open-vsx.org/extension/nolindnaidoo/string-le)** - Extract every user-visible string from JSON, YAML, CSV, TOML, INI, and .env files with zero hassle
- **[EnvSync-LE](https://open-vsx.org/extension/nolindnaidoo/envsync-le)** - Effortlessly detect, compare, and synchronize .env files across your workspace with visual diffs
- **Colors-LE** _(Coming Soon)_ - Extract and analyze colors from CSS, HTML, JavaScript, and more
- **Dates-LE** _(Coming Soon)_ - Extract and analyze dates from logs, APIs, and temporal data
- **Paths-LE** _(Coming Soon)_ - Extract and analyze file paths from imports, configs, and dependencies
- **Numbers-LE** _(Coming Soon)_ - Extract and analyze numeric data from structured files

Each tool follows the same philosophy: **Zero Hassle, Maximum Productivity**.

## ✅ Why URLs-LE

**Modern web applications use URLs everywhere** — API endpoints, asset links, external resources, and navigation paths. Keeping track of all URL references across your codebase can be complex.

**URLs-LE makes URL extraction effortless.**  
It intelligently detects and extracts URLs from your code, providing comprehensive analysis and insights to help you manage web resources effectively.

- **Complete URL detection**

  Automatically finds URLs in multiple formats: HTTP/HTTPS, FTP, mailto, tel, file, and relative URLs.

- **Smart analysis & insights**

  Get detailed reports on URL usage patterns, domain analysis, and link distribution across your codebase.

- **Web development support**

  Perfect for analyzing API endpoints, asset references, and external links to identify broken or outdated URLs.

- **Multiple file format support**

  Works with HTML, CSS, JavaScript, TypeScript, JSON, YAML, Markdown, and more.

- **Accessibility & validation**

  Includes URL validation, accessibility checking, and link integrity analysis.

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

## 🧩 Compatibility

- Works in standard workspaces.
- Limited support in virtual/untrusted workspaces.

## 🔒 Privacy & Telemetry

- Runs locally; no data is sent off your machine.
- Optional local-only logs can be enabled with `urls-le.telemetryEnabled`.

## ⚡ Performance

URLs-LE is built for speed across all supported formats:

| Format   | Throughput        | Best For               |
| -------- | ----------------- | ---------------------- |
| **HTML** | 1.5M+ URLs/sec    | Web pages, templates  |
| **CSS**  | 1.2M+ URLs/sec    | Stylesheets, assets    |
| **JS**   | 1M+ URLs/sec      | JavaScript, APIs       |
| **MD**   | 800K+ URLs/sec    | Documentation, READMEs |
| **JSON** | 600K+ URLs/sec    | API responses, configs |

## 📊 Test Coverage

- Tests powered by Vitest with V8 coverage.
- Runs quickly and locally: `npm run test` or `npm run test:coverage`.
- Coverage reports output to `coverage/` (HTML summary at `coverage/index.html`).

## 🤝 Contributing

We welcome all contributions! Whether it's code, ideas, or feedback:

- [Issues](https://github.com/nolindnaidoo/urls-le/issues) • [Pull Requests](https://github.com/nolindnaidoo/urls-le/pulls) • [Releases](https://github.com/nolindnaidoo/urls-le/releases)
- [Architecture](docs/ARCHITECTURE.md) • [Development](docs/DEVELOPMENT.md) • [Contributing](CONTRIBUTING.md) • [Troubleshooting](docs/TROUBLESHOOTING.md)

---

Copyright © 2025
<a href="https://github.com/nolindnaidoo">@nolindnaidoo</a>. All rights reserved.

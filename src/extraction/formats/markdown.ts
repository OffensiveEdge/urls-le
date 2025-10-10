import type { Url } from '../../types'
import { detectUrlProtocol, extractUrlComponents, isValidUrl } from '../../utils/urlValidation'

// Regex patterns for different URL formats in Markdown
const URL_PATTERN = /(https?:\/\/[^\s<>"{}|\\^`[\]]+)/g
const FTP_PATTERN = /(ftp:\/\/[^\s<>"{}|\\^`[\]]+)/g
const MAILTO_PATTERN = /(mailto:[^\s<>"{}|\\^`[\]]+)/g
const TEL_PATTERN = /(tel:[^\s<>"{}|\\^`[\]]+)/g
const FILE_PATTERN = /(file:\/\/[^\s<>"{}|\\^`[\]]+)/g

// Markdown link patterns
const MARKDOWN_LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g

export function extractFromMarkdown(content: string): Url[] {
  const urls: Url[] = []
  const lines = content.split('\n')

  lines.forEach((line, lineIndex) => {
    // Extract HTTP/HTTPS URLs
    let match
    while ((match = URL_PATTERN.exec(line)) !== null) {
      const urlValue = match[0]
      const components = extractUrlComponents(urlValue)
      urls.push({
        value: urlValue,
        protocol: detectUrlProtocol(urlValue),
        domain: components?.domain,
        path: components?.path,
        position: { line: lineIndex + 1, column: (match.index ?? 0) + 1 },
        context: line.trim(),
      })
    }

    // Extract FTP URLs
    while ((match = FTP_PATTERN.exec(line)) !== null) {
      const urlValue = match[0]
      const components = extractUrlComponents(urlValue)
      urls.push({
        value: urlValue,
        protocol: detectUrlProtocol(urlValue),
        domain: components?.domain,
        path: components?.path,
        position: { line: lineIndex + 1, column: (match.index ?? 0) + 1 },
        context: line.trim(),
      })
    }

    // Extract mailto URLs
    while ((match = MAILTO_PATTERN.exec(line)) !== null) {
      const urlValue = match[0]
      urls.push({
        value: urlValue,
        protocol: detectUrlProtocol(urlValue),
        position: { line: lineIndex + 1, column: (match.index ?? 0) + 1 },
        context: line.trim(),
      })
    }

    // Extract tel URLs
    while ((match = TEL_PATTERN.exec(line)) !== null) {
      const urlValue = match[0]
      urls.push({
        value: urlValue,
        protocol: detectUrlProtocol(urlValue),
        position: { line: lineIndex + 1, column: (match.index ?? 0) + 1 },
        context: line.trim(),
      })
    }

    // Extract file URLs
    while ((match = FILE_PATTERN.exec(line)) !== null) {
      const urlValue = match[0]
      urls.push({
        value: urlValue,
        protocol: detectUrlProtocol(urlValue),
        position: { line: lineIndex + 1, column: (match.index ?? 0) + 1 },
        context: line.trim(),
      })
    }

    // Extract URLs from Markdown links
    while ((match = MARKDOWN_LINK_PATTERN.exec(line)) !== null) {
      const url = match[2]
      if (url && isValidUrl(url)) {
        const components = extractUrlComponents(url)
        urls.push({
          value: url,
          protocol: detectUrlProtocol(url),
          domain: components?.domain,
          path: components?.path,
          position: { line: lineIndex + 1, column: (match.index ?? 0) + 1 },
          context: line.trim(),
        })
      }
    }
  })

  return urls
}

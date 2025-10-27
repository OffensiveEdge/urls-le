import { describe, expect, it } from 'vitest';
import {
	detectUrlProtocol,
	extractUrlComponents,
	getDomainFromUrl,
	isAccessibleUrl,
	isSecureUrl,
	isSuspiciousUrl,
	isValidUrl,
	normalizeUrl,
	validateUrl,
} from './urlValidation';

describe('URL Security Tests', () => {
	describe('JavaScript Protocol Injection', () => {
		it('should reject javascript: protocol', () => {
			const url = 'javascript:alert(1)';
			expect(isValidUrl(url)).toBe(false);
		});

		it('should reject javascript: with encoded characters', () => {
			const url = 'javascript:alert%281%29';
			expect(isValidUrl(url)).toBe(false);
		});

		it('should reject javascript: with mixed case', () => {
			const url = 'JaVaScRiPt:alert(1)';
			expect(isValidUrl(url)).toBe(false);
		});

		it('should reject javascript: with whitespace', () => {
			const url = 'javascript: alert(1)';
			expect(isValidUrl(url)).toBe(false);
		});

		it('should reject javascript: with newlines', () => {
			const url = 'javascript:\nalert(1)';
			expect(isValidUrl(url)).toBe(false);
		});

		it('should detect javascript: as inaccessible', () => {
			const url = 'javascript:alert(1)';
			expect(isAccessibleUrl(url)).toBe(false);
		});
	});

	describe('Data URI Injection', () => {
		it('should reject data: protocol', () => {
			const url = 'data:text/html,<script>alert(1)</script>';
			expect(isValidUrl(url)).toBe(false);
		});

		it('should reject data: with base64', () => {
			const url = 'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==';
			expect(isValidUrl(url)).toBe(false);
		});

		it('should reject data: with image', () => {
			const url = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA';
			expect(isValidUrl(url)).toBe(false);
		});

		it('should detect data: as inaccessible', () => {
			const url = 'data:text/html,<h1>Test</h1>';
			expect(isAccessibleUrl(url)).toBe(false);
		});
	});

	describe('File Protocol (SSRF Prevention)', () => {
		it('should accept file: protocol (but validate path)', () => {
			const url = 'file:///home/user/document.pdf';
			expect(isValidUrl(url)).toBe(true);
		});

		it('should reject file: with empty path', () => {
			const url = 'file://';
			expect(isValidUrl(url)).toBe(false);
		});

		it('should reject file: with only slash', () => {
			const url = 'file:///';
			expect(isValidUrl(url)).toBe(false);
		});

		it('should accept file: with Windows path', () => {
			const url = 'file:///C:/Users/user/document.pdf';
			expect(isValidUrl(url)).toBe(true);
		});

		it('should detect file: protocol correctly', () => {
			const url = 'file:///home/user/document.pdf';
			expect(detectUrlProtocol(url)).toBe('file');
		});
	});

	describe('SSRF Prevention (Internal Network)', () => {
		it('should accept localhost URLs (validation is format-only)', () => {
			const url = 'http://localhost:8080/admin';
			expect(isValidUrl(url)).toBe(true);
		});

		it('should accept 127.0.0.1 URLs', () => {
			const url = 'http://127.0.0.1:8080/admin';
			expect(isValidUrl(url)).toBe(true);
		});

		it('should accept private IP range 10.x.x.x', () => {
			const url = 'http://10.0.0.1/admin';
			expect(isValidUrl(url)).toBe(true);
		});

		it('should accept private IP range 192.168.x.x', () => {
			const url = 'http://192.168.1.1/admin';
			expect(isValidUrl(url)).toBe(true);
		});

		it('should accept private IP range 172.16-31.x.x', () => {
			const url = 'http://172.16.0.1/admin';
			expect(isValidUrl(url)).toBe(true);
		});

		it('should accept metadata service URL (169.254.169.254)', () => {
			const url = 'http://169.254.169.254/latest/meta-data/';
			expect(isValidUrl(url)).toBe(true);
		});

		// Note: In a production environment, you'd want to add runtime checks
		// to prevent SSRF attacks by blocking these URLs during actual HTTP requests
	});

	describe('Browser Extension Protocols', () => {
		it('should reject chrome-extension: protocol', () => {
			const url = 'chrome-extension://abcdefghijklmnop/popup.html';
			expect(isValidUrl(url)).toBe(false);
		});

		it('should reject moz-extension: protocol', () => {
			const url =
				'moz-extension://abcdefgh-1234-5678-90ab-cdef12345678/popup.html';
			expect(isValidUrl(url)).toBe(false);
		});

		it('should reject chrome: protocol', () => {
			const url = 'chrome://settings';
			expect(isValidUrl(url)).toBe(false);
		});

		it('should reject about: protocol', () => {
			const url = 'about:blank';
			expect(isValidUrl(url)).toBe(false);
		});

		it('should detect chrome-extension: as inaccessible', () => {
			const url = 'chrome-extension://abcdefghijklmnop/popup.html';
			expect(isAccessibleUrl(url)).toBe(false);
		});

		it('should detect moz-extension: as inaccessible', () => {
			const url =
				'moz-extension://abcdefgh-1234-5678-90ab-cdef12345678/popup.html';
			expect(isAccessibleUrl(url)).toBe(false);
		});
	});

	describe('Blob Protocol', () => {
		it('should reject blob: protocol', () => {
			const url =
				'blob:https://example.com/550e8400-e29b-41d4-a716-446655440000';
			expect(isValidUrl(url)).toBe(false);
		});

		it('should detect blob: as inaccessible', () => {
			const url =
				'blob:https://example.com/550e8400-e29b-41d4-a716-446655440000';
			expect(isAccessibleUrl(url)).toBe(false);
		});
	});

	describe('URL Encoding Attacks', () => {
		it('should handle URL-encoded slashes', () => {
			const url = 'https://example.com/path%2Fto%2Fresource';
			expect(isValidUrl(url)).toBe(true);
		});

		it('should handle URL-encoded special characters', () => {
			const url =
				'https://example.com/search?q=%3Cscript%3Ealert(1)%3C%2Fscript%3E';
			expect(isValidUrl(url)).toBe(true);
		});

		it('should handle double-encoded URLs', () => {
			const url = 'https://example.com/path%252F..%252F..%252Fetc%252Fpasswd';
			expect(isValidUrl(url)).toBe(true);
		});

		it('should handle Unicode characters', () => {
			const url = 'https://example.com/path/文件';
			expect(isValidUrl(url)).toBe(true);
		});
	});

	describe('Open Redirect Prevention', () => {
		it('should accept URLs with redirect parameters', () => {
			const url = 'https://example.com/redirect?url=https://evil.com';
			expect(isValidUrl(url)).toBe(true);
		});

		it('should accept URLs with return parameters', () => {
			const url = 'https://example.com/login?return=https://evil.com';
			expect(isValidUrl(url)).toBe(true);
		});

		it('should accept URLs with next parameters', () => {
			const url = 'https://example.com/auth?next=https://evil.com';
			expect(isValidUrl(url)).toBe(true);
		});

		// Note: Open redirect prevention should be handled at the application level,
		// not at the URL validation level. These tests verify that the URLs are
		// syntactically valid, but the application should validate redirect targets.
	});

	describe('Suspicious URL Detection', () => {
		it('should detect bit.ly as suspicious', () => {
			const url = 'https://bit.ly/abc123';
			expect(isSuspiciousUrl(url)).toBe(true);
		});

		it('should detect tinyurl as suspicious', () => {
			const url = 'https://tinyurl.com/abc123';
			expect(isSuspiciousUrl(url)).toBe(true);
		});

		it('should detect t.co as suspicious', () => {
			const url = 'https://t.co/abc123';
			expect(isSuspiciousUrl(url)).toBe(true);
		});

		it('should not detect normal URLs as suspicious', () => {
			const url = 'https://example.com/path';
			expect(isSuspiciousUrl(url)).toBe(false);
		});

		it('should validate suspicious URLs but mark them', async () => {
			const url = 'https://bit.ly/abc123';
			const result = await validateUrl(url, {
				timeout: 5000,
				followRedirects: true,
			});
			expect(result.status).toBe('error');
			expect(result.error).toBeTruthy();
		});
	});

	describe('HTTPS Enforcement', () => {
		it('should detect HTTPS URLs as secure', () => {
			const url = 'https://example.com';
			expect(isSecureUrl(url)).toBe(true);
		});

		it('should detect HTTP URLs as insecure', () => {
			const url = 'http://example.com';
			expect(isSecureUrl(url)).toBe(false);
		});

		it('should detect FTP URLs as insecure', () => {
			const url = 'ftp://ftp.example.com';
			expect(isSecureUrl(url)).toBe(false);
		});

		it('should detect file: URLs as insecure', () => {
			const url = 'file:///home/user/document.pdf';
			expect(isSecureUrl(url)).toBe(false);
		});
	});

	describe('Domain Extraction', () => {
		it('should extract domain from HTTPS URL', () => {
			const url = 'https://example.com/path';
			expect(getDomainFromUrl(url)).toBe('example.com');
		});

		it('should extract domain from HTTP URL', () => {
			const url = 'http://example.com/path';
			expect(getDomainFromUrl(url)).toBe('example.com');
		});

		it('should extract domain with subdomain', () => {
			const url = 'https://api.example.com/v1/endpoint';
			expect(getDomainFromUrl(url)).toBe('api.example.com');
		});

		it('should extract domain with port', () => {
			const url = 'https://example.com:8080/path';
			expect(getDomainFromUrl(url)).toBe('example.com');
		});

		it('should return null for mailto URLs', () => {
			const url = 'mailto:user@example.com';
			expect(getDomainFromUrl(url)).toBe(null);
		});

		it('should return null for tel URLs', () => {
			const url = 'tel:+1234567890';
			expect(getDomainFromUrl(url)).toBe(null);
		});

		it('should return null for file URLs', () => {
			const url = 'file:///home/user/document.pdf';
			expect(getDomainFromUrl(url)).toBe(null);
		});
	});

	describe('URL Normalization', () => {
		it('should remove trailing slash', () => {
			const url = 'https://example.com/path/';
			expect(normalizeUrl(url)).toBe('https://example.com/path');
		});

		it('should preserve query parameters', () => {
			const url = 'https://example.com/path?q=test';
			expect(normalizeUrl(url)).toBe('https://example.com/path?q=test');
		});

		it('should preserve fragments', () => {
			const url = 'https://example.com/path#section';
			expect(normalizeUrl(url)).toBe('https://example.com/path#section');
		});

		it('should handle invalid URLs gracefully', () => {
			const url = 'not-a-url';
			expect(normalizeUrl(url)).toBe('not-a-url');
		});
	});

	describe('URL Component Extraction', () => {
		it('should extract components from HTTPS URL', () => {
			const url = 'https://example.com/path/to/resource?q=test#section';
			const components = extractUrlComponents(url);
			expect(components).toEqual({
				protocol: 'https',
				domain: 'example.com',
				path: '/path/to/resource?q=test#section',
			});
		});

		it('should extract components from HTTP URL', () => {
			const url = 'http://example.com/path';
			const components = extractUrlComponents(url);
			expect(components).toEqual({
				protocol: 'http',
				domain: 'example.com',
				path: '/path',
			});
		});

		it('should extract components from FTP URL', () => {
			const url = 'ftp://ftp.example.com/file.txt';
			const components = extractUrlComponents(url);
			expect(components).toEqual({
				protocol: 'ftp',
				domain: 'ftp.example.com',
				path: '/file.txt',
			});
		});

		it('should extract components from mailto URL', () => {
			const url = 'mailto:user@example.com';
			const components = extractUrlComponents(url);
			expect(components?.protocol).toBe('mailto');
		});

		it('should extract components from tel URL', () => {
			const url = 'tel:+1234567890';
			const components = extractUrlComponents(url);
			expect(components?.protocol).toBe('tel');
		});

		it('should return null for invalid URLs', () => {
			const url = 'not-a-url';
			const components = extractUrlComponents(url);
			expect(components).toBe(null);
		});
	});

	describe('Protocol Detection', () => {
		it('should detect http protocol', () => {
			const url = 'http://example.com';
			expect(detectUrlProtocol(url)).toBe('http');
		});

		it('should detect https protocol', () => {
			const url = 'https://example.com';
			expect(detectUrlProtocol(url)).toBe('https');
		});

		it('should detect ftp protocol', () => {
			const url = 'ftp://ftp.example.com';
			expect(detectUrlProtocol(url)).toBe('ftp');
		});

		it('should detect file protocol', () => {
			const url = 'file:///home/user/document.pdf';
			expect(detectUrlProtocol(url)).toBe('file');
		});

		it('should detect mailto protocol', () => {
			const url = 'mailto:user@example.com';
			expect(detectUrlProtocol(url)).toBe('mailto');
		});

		it('should detect tel protocol', () => {
			const url = 'tel:+1234567890';
			expect(detectUrlProtocol(url)).toBe('tel');
		});

		it('should return unknown for invalid URLs', () => {
			const url = 'not-a-url';
			expect(detectUrlProtocol(url)).toBe('unknown');
		});

		it('should return unknown for unsupported protocols', () => {
			const url = 'gopher://example.com';
			expect(detectUrlProtocol(url)).toBe('unknown');
		});
	});

	describe('Edge Cases', () => {
		it('should handle empty string', () => {
			expect(isValidUrl('')).toBe(false);
		});

		it('should handle whitespace-only string', () => {
			expect(isValidUrl('   ')).toBe(false);
		});

		it('should handle very long URLs', () => {
			const url = `https://example.com/${'a'.repeat(2000)}`;
			expect(isValidUrl(url)).toBe(true);
		});

		it('should handle URLs with special characters in query', () => {
			const url =
				'https://example.com/search?q=hello+world&filter=type:article';
			expect(isValidUrl(url)).toBe(true);
		});

		it('should handle URLs with authentication', () => {
			const url = 'https://user:pass@example.com/path';
			expect(isValidUrl(url)).toBe(true);
		});

		it('should handle URLs with IPv6 addresses', () => {
			const url = 'http://[2001:db8::1]/path';
			expect(isValidUrl(url)).toBe(true);
		});

		it('should handle URLs with multiple subdomains', () => {
			const url = 'https://api.v2.staging.example.com/endpoint';
			expect(isValidUrl(url)).toBe(true);
		});

		it('should handle URLs with non-ASCII characters', () => {
			const url = 'https://例え.jp/パス';
			expect(isValidUrl(url)).toBe(true);
		});
	});

	describe('Security Attack Vectors', () => {
		it('should handle null byte injection', () => {
			const url = 'https://example.com/path\0.html';
			// Node.js URL parser accepts null bytes (they're part of the path)
			expect(isValidUrl(url)).toBe(true);
			// Note: Applications should sanitize paths before use
		});

		it('should handle CRLF injection attempts', () => {
			const url = 'https://example.com/path\r\nSet-Cookie: evil=true';
			// Node.js URL parser accepts CRLF (they're part of the path)
			expect(isValidUrl(url)).toBe(true);
			// Note: HTTP libraries should sanitize headers before sending requests
		});

		it('should handle homograph attacks (punycode)', () => {
			const url = 'https://xn--e1afmkfd.xn--p1ai'; // пример.рф
			expect(isValidUrl(url)).toBe(true);
		});

		it('should handle URLs with excessive dots', () => {
			const url = 'https://example.com/path/../../../../../../etc/passwd';
			expect(isValidUrl(url)).toBe(true);
			// Note: Path traversal should be handled by the server, not URL validation
		});

		it('should handle URLs with backslashes', () => {
			const url = 'https://example.com\\path\\to\\resource';
			// URL parser normalizes backslashes to forward slashes
			expect(isValidUrl(url)).toBe(true);
		});
	});
});

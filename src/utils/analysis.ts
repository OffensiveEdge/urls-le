import type { AnalysisResult, Configuration, UrlProtocol } from '../types'
import {
	detectUrlProtocol,
	getDomainFromUrl,
	isAccessibleUrl,
	isExpiredDomain,
	isSecureUrl,
	isSuspiciousUrl,
} from './urlValidation'

export function analyzeUrls(lines: string[], config: Configuration): AnalysisResult {
	const urls = lines.filter((line) => line.trim().length > 0)
	const uniqueUrls = new Set(urls)

	const protocols: Record<UrlProtocol, number> = {
		http: 0,
		https: 0,
		ftp: 0,
		file: 0,
		mailto: 0,
		tel: 0,
		unknown: 0,
	}

	urls.forEach((url) => {
		const protocol = detectUrlProtocol(url)
		protocols[protocol]++
	})

	const result: AnalysisResult = {
		count: urls.length,
		protocols,
		unique: uniqueUrls.size,
		duplicates: urls.length - uniqueUrls.size,
	}

	if (config.analysisIncludeSecurity) {
		result.security = analyzeSecurity(urls)
	}

	if (config.analysisIncludeAccessibility) {
		result.accessibility = analyzeAccessibility(urls)
	}

	result.domains = analyzeDomains(urls)

	return result
}

function analyzeSecurity(urls: string[]) {
	const secure = urls.filter((url) => isSecureUrl(url)).length
	const insecure = urls.filter((url) => url.startsWith('http://')).length
	const suspicious = urls.filter((url) => isSuspiciousUrl(url)).length

	const issues: Array<{
		url: string
		issue: string
		severity: 'warning' | 'error'
	}> = []

	urls.forEach((url) => {
		if (isSuspiciousUrl(url)) {
			issues.push({
				url,
				issue: 'Suspicious URL detected',
				severity: 'warning',
			})
		}
		if (url.startsWith('http://')) {
			issues.push({
				url,
				issue: 'Insecure HTTP protocol',
				severity: 'warning',
			})
		}
	})

	return {
		secure,
		insecure,
		suspicious,
		issues,
	}
}

function analyzeAccessibility(urls: string[]) {
	const accessible = urls.filter((url) => isAccessibleUrl(url)).length
	const inaccessible = urls.length - accessible

	const issues: Array<{
		url: string
		issue: string
		severity: 'warning' | 'error'
	}> = []

	urls.forEach((url) => {
		if (!isAccessibleUrl(url)) {
			issues.push({
				url,
				issue: 'URL may not be accessible',
				severity: 'warning',
			})
		}
	})

	return {
		accessible,
		inaccessible,
		issues,
	}
}

function analyzeDomains(urls: string[]) {
	const domainCounts: Record<string, number> = {}
	const domains: string[] = []

	urls.forEach((url) => {
		const domain = getDomainFromUrl(url)
		if (domain) {
			domainCounts[domain] = (domainCounts[domain] || 0) + 1
			domains.push(domain)
		}
	})

	const uniqueDomains = new Set(domains).size
	const commonDomains = Object.entries(domainCounts)
		.map(([domain, count]) => ({
			domain,
			count,
			percentage: (count / urls.length) * 100,
		}))
		.sort((a, b) => b.count - a.count)
		.slice(0, 10)

	const expiredDomains = domains.filter((domain) => isExpiredDomain(domain))
	const suspiciousDomains = domains.filter((domain) => isSuspiciousUrl(`https://${domain}`))

	return {
		uniqueDomains,
		commonDomains,
		expiredDomains,
		suspiciousDomains,
	}
}

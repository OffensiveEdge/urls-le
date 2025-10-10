export interface ExtractionResult {
	success: boolean;
	urls: readonly Url[];
	errors: readonly ParseError[];
}

export interface ParseError {
	type: 'parse-error' | 'validation-error';
	message: string;
	filepath?: string;
}

export interface Url {
	readonly value: string;
	readonly protocol: UrlProtocol;
	readonly domain?: string;
	readonly path?: string;
	readonly position?: {
		readonly line: number;
		readonly column: number;
	};
	readonly context?: string;
}

export type UrlProtocol =
	| 'http'
	| 'https'
	| 'ftp'
	| 'file'
	| 'mailto'
	| 'tel'
	| 'unknown';

export interface AnalysisResult {
	count: number;
	protocols: Record<UrlProtocol, number>;
	unique: number;
	duplicates: number;
	security?: SecurityAnalysis;
	accessibility?: AccessibilityAnalysis;
	domains?: DomainAnalysis;
}

export interface SecurityAnalysis {
	readonly secure: number;
	readonly insecure: number;
	readonly suspicious: number;
	readonly issues: readonly SecurityIssue[];
}

export interface SecurityIssue {
	readonly url: string;
	readonly issue: string;
	readonly severity: 'warning' | 'error';
}

export interface AccessibilityAnalysis {
	readonly accessible: number;
	readonly inaccessible: number;
	readonly issues: readonly AccessibilityIssue[];
}

export interface AccessibilityIssue {
	readonly url: string;
	readonly issue: string;
	readonly severity: 'warning' | 'error';
}

export interface DomainAnalysis {
	readonly uniqueDomains: number;
	readonly commonDomains: readonly CommonDomain[];
	readonly expiredDomains: readonly string[];
	readonly suspiciousDomains: readonly string[];
}

export interface CommonDomain {
	readonly domain: string;
	readonly count: number;
	readonly percentage: number;
}

export interface ValidationResult {
	readonly url: string;
	readonly status: 'valid' | 'invalid' | 'timeout' | 'error';
	readonly statusCode?: number;
	readonly redirects?: readonly string[];
	readonly error?: string;
}

export type FileType =
	| 'markdown'
	| 'html'
	| 'css'
	| 'javascript'
	| 'typescript'
	| 'json'
	| 'yaml'
	| 'yml'
	| 'unknown';

export interface Configuration {
	readonly copyToClipboardEnabled: boolean;
	readonly dedupeEnabled: boolean;
	readonly notificationsLevel: 'all' | 'important' | 'silent';
	readonly postProcessOpenInNewFile: boolean;
	readonly openResultsSideBySide: boolean;
	readonly safetyEnabled: boolean;
	readonly safetyFileSizeWarnBytes: number;
	readonly safetyLargeOutputLinesThreshold: number;
	readonly safetyManyDocumentsThreshold: number;
	readonly showParseErrors: boolean;
	readonly statusBarEnabled: boolean;
	readonly telemetryEnabled: boolean;
	readonly analysisEnabled: boolean;
	readonly analysisIncludeSecurity: boolean;
	readonly analysisIncludeAccessibility: boolean;
	readonly validationEnabled: boolean;
	readonly validationTimeout: number;
	readonly validationFollowRedirects: boolean;
}

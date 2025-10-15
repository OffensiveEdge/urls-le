import { describe, expect, it } from 'vitest';
import {
	formatComplianceStatus,
	formatProtocolDistribution,
	formatUrlAnalysis,
	formatUrlStatistics,
} from './localization';

describe('Localization Utils', () => {
	describe('formatUrlStatistics', () => {
		it('formats basic URL statistics', () => {
			const stats = {
				total: 10,
				unique: 8,
				duplicates: 2,
				protocols: { https: 6, http: 2, ftp: 2 },
				domains: { 'example.com': 4, 'test.com': 3, 'other.com': 3 },
				avgLength: 25.5,
				maxLength: 45,
				minLength: 15,
			};

			const formatted = formatUrlStatistics(stats);

			expect(formatted).toContain('Total: 10');
			expect(formatted).toContain('Unique: 8');
			expect(formatted).toContain('Duplicates: 2');
			expect(formatted).toContain('Average length: 25.5');
		});

		it('handles zero statistics', () => {
			const stats = {
				total: 0,
				unique: 0,
				duplicates: 0,
				protocols: {},
				domains: {},
				avgLength: 0,
				maxLength: 0,
				minLength: 0,
			};

			const formatted = formatUrlStatistics(stats);

			expect(formatted).toContain('Total: 0');
			expect(formatted).toContain('Unique: 0');
			expect(formatted).toContain('Duplicates: 0');
		});

		it('formats protocol distribution', () => {
			const stats = {
				total: 5,
				unique: 5,
				duplicates: 0,
				protocols: { https: 3, http: 1, ftp: 1 },
				domains: {},
				avgLength: 20,
				maxLength: 30,
				minLength: 10,
			};

			const formatted = formatUrlStatistics(stats);

			expect(formatted).toContain('https: 3');
			expect(formatted).toContain('http: 1');
			expect(formatted).toContain('ftp: 1');
		});

		it('formats domain distribution', () => {
			const stats = {
				total: 6,
				unique: 6,
				duplicates: 0,
				protocols: {},
				domains: { 'example.com': 3, 'test.com': 2, 'other.com': 1 },
				avgLength: 20,
				maxLength: 30,
				minLength: 10,
			};

			const formatted = formatUrlStatistics(stats);

			expect(formatted).toContain('example.com: 3');
			expect(formatted).toContain('test.com: 2');
			expect(formatted).toContain('other.com: 1');
		});
	});

	describe('formatProtocolDistribution', () => {
		it('formats protocol distribution with counts', () => {
			const protocols = { https: 5, http: 3, ftp: 2 };
			const formatted = formatProtocolDistribution(protocols);

			expect(formatted).toContain('https: 5');
			expect(formatted).toContain('http: 3');
			expect(formatted).toContain('ftp: 2');
		});

		it('handles empty protocol distribution', () => {
			const protocols = {};
			const formatted = formatProtocolDistribution(protocols);

			expect(formatted).toContain('No protocols');
		});

		it('sorts protocols by count descending', () => {
			const protocols = { ftp: 1, https: 10, http: 5 };
			const formatted = formatProtocolDistribution(protocols);

			const httpsIndex = formatted.indexOf('https: 10');
			const httpIndex = formatted.indexOf('http: 5');
			const ftpIndex = formatted.indexOf('ftp: 1');

			expect(httpsIndex).toBeLessThan(httpIndex);
			expect(httpIndex).toBeLessThan(ftpIndex);
		});

		it('handles single protocol', () => {
			const protocols = { https: 1 };
			const formatted = formatProtocolDistribution(protocols);

			expect(formatted).toBe('https: 1');
		});
	});

	describe('formatComplianceStatus', () => {
		it('formats fully compliant status', () => {
			const status = formatComplianceStatus(1.0);
			expect(status).toContain('Fully compliant');
		});

		it('formats mostly compliant status', () => {
			const status = formatComplianceStatus(0.85);
			expect(status).toContain('Mostly compliant');
		});

		it('formats partially compliant status', () => {
			const status = formatComplianceStatus(0.65);
			expect(status).toContain('Partially compliant');
		});

		it('formats non-compliant status', () => {
			const status = formatComplianceStatus(0.45);
			expect(status).toContain('Non-compliant');
		});

		it('handles edge cases', () => {
			expect(formatComplianceStatus(0.8)).toContain('Mostly compliant');
			expect(formatComplianceStatus(0.6)).toContain('Partially compliant');
			expect(formatComplianceStatus(0.5)).toContain('Non-compliant');
		});

		it('handles invalid values', () => {
			expect(formatComplianceStatus(-0.1)).toContain('Non-compliant');
			expect(formatComplianceStatus(1.1)).toContain('Fully compliant');
			expect(formatComplianceStatus(NaN)).toContain('Non-compliant');
		});
	});

	describe('formatUrlAnalysis', () => {
		it('formats complete URL analysis', () => {
			const analysis = {
				security: {
					score: 0.9,
					issues: ['Insecure HTTP protocol'],
				},
				accessibility: {
					score: 0.8,
					issues: ['URL may not be accessible'],
				},
				performance: {
					score: 0.95,
					issues: [],
				},
				compliance: {
					score: 0.85,
					issues: ['Minor compliance issue'],
				},
			};

			const formatted = formatUrlAnalysis(analysis);

			expect(formatted).toContain('Security: Mostly compliant');
			expect(formatted).toContain('Accessibility: Mostly compliant');
			expect(formatted).toContain('Performance: Fully compliant');
			expect(formatted).toContain('Compliance: Mostly compliant');
		});

		it('includes issues in analysis', () => {
			const analysis = {
				security: {
					score: 0.7,
					issues: ['Insecure HTTP protocol', 'Suspicious URL detected'],
				},
				accessibility: {
					score: 0.9,
					issues: [],
				},
				performance: {
					score: 0.8,
					issues: ['Slow response time'],
				},
				compliance: {
					score: 0.6,
					issues: [],
				},
			};

			const formatted = formatUrlAnalysis(analysis);

			expect(formatted).toContain('Insecure HTTP protocol');
			expect(formatted).toContain('Suspicious URL detected');
			expect(formatted).toContain('Slow response time');
		});

		it('handles analysis with no issues', () => {
			const analysis = {
				security: { score: 1.0, issues: [] },
				accessibility: { score: 1.0, issues: [] },
				performance: { score: 1.0, issues: [] },
				compliance: { score: 1.0, issues: [] },
			};

			const formatted = formatUrlAnalysis(analysis);

			expect(formatted).toContain('Security: Fully compliant');
			expect(formatted).toContain('Accessibility: Fully compliant');
			expect(formatted).toContain('Performance: Fully compliant');
			expect(formatted).toContain('Compliance: Fully compliant');
		});

		it('handles partial analysis data', () => {
			const analysis = {
				security: { score: 0.8, issues: [] },
				accessibility: { score: 0.7, issues: ['Access issue'] },
			};

			const formatted = formatUrlAnalysis(analysis as any);

			expect(formatted).toContain('Security: Mostly compliant');
			expect(formatted).toContain('Accessibility: Partially compliant');
			expect(formatted).toContain('Access issue');
		});
	});

	describe('edge cases and error handling', () => {
		it('handles null and undefined inputs', () => {
			expect(() => formatUrlStatistics(null as any)).not.toThrow();
			expect(() => formatProtocolDistribution(null as any)).not.toThrow();
			expect(() => formatComplianceStatus(null as any)).not.toThrow();
			expect(() => formatUrlAnalysis(null as any)).not.toThrow();
		});

		it('handles empty objects', () => {
			const emptyStats = {
				total: 0,
				unique: 0,
				duplicates: 0,
				protocols: {},
				domains: {},
				avgLength: 0,
				maxLength: 0,
				minLength: 0,
			};

			expect(() => formatUrlStatistics(emptyStats)).not.toThrow();
			expect(() => formatProtocolDistribution({})).not.toThrow();
			expect(() => formatUrlAnalysis({})).not.toThrow();
		});

		it('handles malformed data gracefully', () => {
			const malformedStats = {
				total: 'invalid',
				protocols: 'not an object',
				domains: null,
			};

			expect(() => formatUrlStatistics(malformedStats as any)).not.toThrow();
		});

		it('handles very large numbers', () => {
			const largeStats = {
				total: 1000000,
				unique: 999999,
				duplicates: 1,
				protocols: { https: 1000000 },
				domains: { 'example.com': 1000000 },
				avgLength: 999.99,
				maxLength: 9999,
				minLength: 1,
			};

			const formatted = formatUrlStatistics(largeStats);
			expect(formatted).toContain('1000000');
		});
	});
});

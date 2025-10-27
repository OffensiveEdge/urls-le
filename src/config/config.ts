import * as vscode from 'vscode';
import type { Configuration } from '../types';

export type NotificationLevel = 'all' | 'important' | 'silent';

const CONFIG_NAMESPACE = 'urls-le';

const DEFAULTS = Object.freeze({
	copyToClipboardEnabled: false,
	dedupeEnabled: false,
	notificationsLevel: 'silent' as NotificationLevel,
	postProcessOpenInNewFile: false,
	openResultsSideBySide: false,
	safetyEnabled: true,
	safetyFileSizeWarnBytes: 1_000_000,
	safetyLargeOutputLinesThreshold: 50_000,
	safetyManyDocumentsThreshold: 8,
	showParseErrors: false,
	statusBarEnabled: true,
	telemetryEnabled: false,
});

const CONSTRAINTS = Object.freeze({
	minFileSizeBytes: 1000,
	minLargeOutputLines: 100,
	minDocumentsThreshold: 1,
});

export function getConfiguration(): Configuration {
	const config = vscode.workspace.getConfiguration(CONFIG_NAMESPACE);

	return Object.freeze({
		copyToClipboardEnabled: getBooleanConfig(config, 'copyToClipboardEnabled'),
		dedupeEnabled: getBooleanConfig(config, 'dedupeEnabled'),
		notificationsLevel: getNotificationLevel(config),
		postProcessOpenInNewFile: getBooleanConfig(
			config,
			'postProcess.openInNewFile',
		),
		openResultsSideBySide: getBooleanConfig(config, 'openResultsSideBySide'),
		safetyEnabled: getBooleanConfig(config, 'safety.enabled', true),
		safetyFileSizeWarnBytes: getConstrainedNumber(
			config,
			'safety.fileSizeWarnBytes',
			DEFAULTS.safetyFileSizeWarnBytes,
			CONSTRAINTS.minFileSizeBytes,
		),
		safetyLargeOutputLinesThreshold: getConstrainedNumber(
			config,
			'safety.largeOutputLinesThreshold',
			DEFAULTS.safetyLargeOutputLinesThreshold,
			CONSTRAINTS.minLargeOutputLines,
		),
		safetyManyDocumentsThreshold: getConstrainedNumber(
			config,
			'safety.manyDocumentsThreshold',
			DEFAULTS.safetyManyDocumentsThreshold,
			CONSTRAINTS.minDocumentsThreshold,
		),
		showParseErrors: getBooleanConfig(config, 'showParseErrors'),
		statusBarEnabled: getBooleanConfig(config, 'statusBar.enabled', true),
		telemetryEnabled: getBooleanConfig(config, 'telemetryEnabled'),
	});
}

function getBooleanConfig(
	config: vscode.WorkspaceConfiguration,
	key: string,
	defaultValue = false,
): boolean {
	return Boolean(config.get(key, defaultValue));
}

function getConstrainedNumber(
	config: vscode.WorkspaceConfiguration,
	key: string,
	defaultValue: number,
	minValue: number,
): number {
	const value = Number(config.get(key, defaultValue));
	return Math.max(minValue, value);
}

function getNotificationLevel(
	config: vscode.WorkspaceConfiguration,
): NotificationLevel {
	// Backward-compat: support both `notificationLevel` (preferred) and legacy `notificationsLevel`
	const notifRaw = config.get(
		'notificationLevel',
		config.get('notificationsLevel', DEFAULTS.notificationsLevel),
	) as unknown;

	return isValidNotificationLevel(notifRaw)
		? notifRaw
		: DEFAULTS.notificationsLevel;
}

export function isValidNotificationLevel(v: unknown): v is NotificationLevel {
	return v === 'all' || v === 'important' || v === 'silent';
}

import * as dotenv from 'dotenv';
import * as path from 'path';

// This module is the sole owner of local environment-file loading. Shell and
// CI values take precedence because dotenv does not override existing values.
dotenv.config({ path: path.resolve(__dirname, '.env'), quiet: true });

export function getRequiredEnv(key: string): string {
    const value = process.env[key];
    if (value === undefined || value.trim() === '') {
        throw new Error(`Environment variable ${key} is required.`);
    }
    return value;
}

export function getOptionalEnv(key: string, fallback?: string): string | undefined {
    const value = process.env[key]?.trim();
    return value || fallback;
}

export const ENV = {
    BASE_URL: getOptionalEnv('BASE_URL'),
    LOG_LEVEL: getOptionalEnv('LOG_LEVEL', 'info')!,
};

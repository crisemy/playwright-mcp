import * as winston from 'winston';
import { ENV } from '../config/env.config';

const { combine, errors, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

export const logger = winston.createLogger({
    level: ENV.LOG_LEVEL,
    transports: [
        new winston.transports.Console({
            format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat)
        }),
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: combine(errors({ stack: true }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat)
        }),
        new winston.transports.File({
            filename: 'logs/combined.log',
            format: combine(errors({ stack: true }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat)
        })
    ],
});

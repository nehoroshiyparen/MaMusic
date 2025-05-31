import winston from 'winston'
import { v4 as uuidv4 } from 'uuid'
import DailyRotateFile from 'winston-daily-rotate-file'
import { ApiError } from '../ApiError/api-error';

const { combine, timestamp, printf, errors } = winston.format

const logFormat = printf(({ 
  level, 
  message, 
  timestamp, 
  correlationId, 
  stack, 
  accessToken
}) => {
  return `${timestamp} [${level}]  ${correlationId ? `[CorrelationId: ${correlationId}] ` : ''}  ${message}  ${accessToken && typeof accessToken === 'string' ? `[Token: ${accessToken.substring(0, 8)}] ` : ''}  ${stack || ''}`;
});

const dailyRotateTransport = (filename: string, level: string) =>
  new DailyRotateFile({
    filename: `logs/${filename}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    level,
    zippedArchive: false,
    maxSize: '20m',       // максимум 20 MB на файл
    maxFiles: '14d'       // хранить только 14 последних дней
  })

const logger = winston.createLogger({
    level: 'info',
    levels: winston.config.npm.levels,
    format: combine(
        timestamp(),
        errors({ stack: true }),
        logFormat
    ),
    transports: [
        new winston.transports.Console(),
        dailyRotateTransport('app', 'info'),
        dailyRotateTransport('error', 'error'),
    ]
})

const logInfo = (message: string, correlationId?: string, accessToken?: string) => {
  logger.info(message, { correlationId, accessToken });
};

const logError = (message: string, error: unknown, correlationId?: string, accessToken?: string) => {
  if (error instanceof ApiError) {
    logger.error(error.message, { correlationId, stack: error.stack, accessToken });
  } else if (error instanceof Error) {
    logger.error(message, { correlationId, stack: error.stack, accessToken })
  }
};

const logWarn = (message: string, correlationId?: string, accessToken?: string) => {
  logger.warn(message, { correlationId, accessToken });
};

const logDebug = (message: string, correlationId?: string, accessToken?: string) => {
  logger.debug(message, { correlationId, accessToken });
};
  
export { logger, logInfo, logError, logWarn, logDebug };
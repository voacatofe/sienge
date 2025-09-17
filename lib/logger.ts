/**
 * Logger centralizado para toda a aplicação
 * Substitui console.log com estrutura padronizada
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  data?: any;
  error?: Error;
}

class Logger {
  private static instance: Logger;
  private isDevelopment = process.env.NODE_ENV === 'development';
  private logLevel = process.env.LOG_LEVEL || 'info';

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    const currentLevelIndex = levels.indexOf(this.logLevel as LogLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= currentLevelIndex;
  }

  private formatLog(entry: LogEntry): string {
    if (this.isDevelopment) {
      // Formato legível para desenvolvimento
      const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.context}]`;
      let output = `${prefix} ${entry.message}`;

      if (entry.data) {
        output += '\n' + JSON.stringify(entry.data, null, 2);
      }

      if (entry.error) {
        output += '\n' + entry.error.stack;
      }

      return output;
    } else {
      // Formato JSON para produção
      return JSON.stringify({
        ...entry,
        error: entry.error ? {
          message: entry.error.message,
          stack: entry.error.stack,
          name: entry.error.name
        } : undefined
      });
    }
  }

  private log(level: LogLevel, context: string, message: string, data?: any, error?: Error) {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      context,
      message,
      data: this.sanitizeData(data),
      error
    };

    const formatted = this.formatLog(entry);

    switch (level) {
      case LogLevel.ERROR:
        console.error(formatted);
        break;
      case LogLevel.WARN:
        console.warn(formatted);
        break;
      case LogLevel.DEBUG:
        if (this.isDevelopment) console.debug(formatted);
        break;
      default:
        console.log(formatted);
    }
  }

  private sanitizeData(data: any): any {
    if (!data) return data;

    // Remove informações sensíveis
    const sanitized = JSON.parse(JSON.stringify(data));
    const sensitiveKeys = ['password', 'senha', 'apiPasswordHash', 'token', 'secret', 'key', 'auth'];

    const sanitizeObject = (obj: any) => {
      for (const key in obj) {
        if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
          obj[key] = '***REDACTED***';
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitizeObject(obj[key]);
        }
      }
    };

    if (typeof sanitized === 'object') {
      sanitizeObject(sanitized);
    }

    return sanitized;
  }

  debug(context: string, message: string, data?: any) {
    this.log(LogLevel.DEBUG, context, message, data);
  }

  info(context: string, message: string, data?: any) {
    this.log(LogLevel.INFO, context, message, data);
  }

  warn(context: string, message: string, data?: any) {
    this.log(LogLevel.WARN, context, message, data);
  }

  error(context: string, message: string, error?: Error | any, data?: any) {
    if (error instanceof Error) {
      this.log(LogLevel.ERROR, context, message, data, error);
    } else {
      this.log(LogLevel.ERROR, context, message, { ...data, error });
    }
  }

  // Métrica de API para compatibilidade
  api(method: string, endpoint: string, status: number, duration: number, data?: any) {
    this.info('API', `${method} ${endpoint}`, {
      status,
      duration: `${duration}ms`,
      ...data
    });
  }

  // Log de sincronização
  sync(entity: string, action: string, result: any) {
    this.info('SYNC', `${action} ${entity}`, result);
  }

  // Log de banco de dados
  db(operation: string, model: string, data?: any) {
    this.debug('DB', `${operation} ${model}`, data);
  }
}

// Exportar instância singleton
export const logger = Logger.getInstance();

// Exportar função helper para contextos específicos
export function createContextLogger(context: string) {
  return {
    debug: (message: string, data?: any) => logger.debug(context, message, data),
    info: (message: string, data?: any) => logger.info(context, message, data),
    warn: (message: string, data?: any) => logger.warn(context, message, data),
    error: (message: string, error?: Error | any, data?: any) => logger.error(context, message, error, data),
  };
}
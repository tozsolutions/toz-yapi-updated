import chalk from 'chalk';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success';

/**
 * Logger utility for consistent logging across the application
 */
export class Logger {
  private verbose: boolean;

  constructor(verbose = false) {
    this.verbose = verbose;
  }

  /**
   * Debug logging (only shown in verbose mode)
   */
  debug(message: string, ...args: unknown[]): void {
    if (this.verbose) {
      console.log(chalk.gray(`[DEBUG] ${message}`), ...args);
    }
  }

  /**
   * Info logging
   */
  info(message: string, ...args: unknown[]): void {
    console.log(chalk.blue(`[INFO] ${message}`), ...args);
  }

  /**
   * Warning logging
   */
  warn(message: string, ...args: unknown[]): void {
    console.warn(chalk.yellow(`[WARN] ${message}`), ...args);
  }

  /**
   * Error logging
   */
  error(message: string, ...args: unknown[]): void {
    console.error(chalk.red(`[ERROR] ${message}`), ...args);
  }

  /**
   * Success logging
   */
  success(message: string, ...args: unknown[]): void {
    console.log(chalk.green(`[SUCCESS] ${message}`), ...args);
  }

  /**
   * Log with custom color
   */
  log(level: LogLevel, message: string, ...args: unknown[]): void {
    switch (level) {
      case 'debug':
        this.debug(message, ...args);
        break;
      case 'info':
        this.info(message, ...args);
        break;
      case 'warn':
        this.warn(message, ...args);
        break;
      case 'error':
        this.error(message, ...args);
        break;
      case 'success':
        this.success(message, ...args);
        break;
      default:
        console.log(message, ...args);
    }
  }

  /**
   * Set verbose mode
   */
  setVerbose(verbose: boolean): void {
    this.verbose = verbose;
  }

  /**
   * Create a scoped logger with prefix
   */
  scope(prefix: string): Logger {
    const scopedLogger = new Logger(this.verbose);
    
    // Override methods to include prefix
    const originalMethods = ['debug', 'info', 'warn', 'error', 'success'] as const;
    
    originalMethods.forEach(method => {
      const originalMethod = scopedLogger[method].bind(scopedLogger);
      scopedLogger[method] = (message: string, ...args: unknown[]) => {
        originalMethod(`[${prefix}] ${message}`, ...args);
      };
    });

    return scopedLogger;
  }

  /**
   * Log table data
   */
  table(data: Record<string, unknown>[]): void {
    console.table(data);
  }

  /**
   * Log separator line
   */
  separator(): void {
    console.log(chalk.gray('─'.repeat(50)));
  }

  /**
   * Log box with message
   */
  box(message: string, color: 'red' | 'green' | 'blue' | 'yellow' | 'cyan' = 'blue'): void {
    const lines = message.split('\n');
    const maxLength = Math.max(...lines.map(line => line.length));
    const border = '─'.repeat(maxLength + 4);
    
    console.log(chalk[color](`┌${border}┐`));
    lines.forEach(line => {
      const padding = ' '.repeat(maxLength - line.length);
      console.log(chalk[color](`│  ${line}${padding}  │`));
    });
    console.log(chalk[color](`└${border}┘`));
  }
}
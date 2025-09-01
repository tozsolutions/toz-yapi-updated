import { describe, it, expect, vi, beforeEach } from 'vitest';
import chalk from 'chalk';

import { Logger } from '../src/utils/Logger.js';

// Mock console methods
const mockConsole = {
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  table: vi.fn(),
};

vi.stubGlobal('console', mockConsole);

describe('Logger', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger();
    vi.clearAllMocks();
  });

  describe('basic logging', () => {
    it('should log info messages', () => {
      logger.info('Test info message');

      expect(mockConsole.log).toHaveBeenCalledWith(
        chalk.blue('[INFO] Test info message')
      );
    });

    it('should log warning messages', () => {
      logger.warn('Test warning message');

      expect(mockConsole.warn).toHaveBeenCalledWith(
        chalk.yellow('[WARN] Test warning message')
      );
    });

    it('should log error messages', () => {
      logger.error('Test error message');

      expect(mockConsole.error).toHaveBeenCalledWith(
        chalk.red('[ERROR] Test error message')
      );
    });

    it('should log success messages', () => {
      logger.success('Test success message');

      expect(mockConsole.log).toHaveBeenCalledWith(
        chalk.green('[SUCCESS] Test success message')
      );
    });
  });

  describe('debug logging', () => {
    it('should not log debug messages by default', () => {
      logger.debug('Test debug message');

      expect(mockConsole.log).not.toHaveBeenCalled();
    });

    it('should log debug messages in verbose mode', () => {
      const verboseLogger = new Logger(true);
      verboseLogger.debug('Test debug message');

      expect(mockConsole.log).toHaveBeenCalledWith(
        chalk.gray('[DEBUG] Test debug message')
      );
    });
  });

  describe('setVerbose', () => {
    it('should enable debug logging when set to true', () => {
      logger.setVerbose(true);
      logger.debug('Test debug message');

      expect(mockConsole.log).toHaveBeenCalledWith(
        chalk.gray('[DEBUG] Test debug message')
      );
    });

    it('should disable debug logging when set to false', () => {
      logger.setVerbose(true);
      logger.setVerbose(false);
      logger.debug('Test debug message');

      expect(mockConsole.log).not.toHaveBeenCalled();
    });
  });

  describe('log method', () => {
    it('should route to appropriate method based on level', () => {
      logger.log('info', 'Info message');
      logger.log('warn', 'Warning message');
      logger.log('error', 'Error message');
      logger.log('success', 'Success message');

      expect(mockConsole.log).toHaveBeenCalledWith(
        chalk.blue('[INFO] Info message')
      );
      expect(mockConsole.warn).toHaveBeenCalledWith(
        chalk.yellow('[WARN] Warning message')
      );
      expect(mockConsole.error).toHaveBeenCalledWith(
        chalk.red('[ERROR] Error message')
      );
      expect(mockConsole.log).toHaveBeenCalledWith(
        chalk.green('[SUCCESS] Success message')
      );
    });
  });

  describe('scoped logger', () => {
    it('should create scoped logger with prefix', () => {
      const scopedLogger = logger.scope('TEST');
      scopedLogger.info('Scoped message');

      expect(mockConsole.log).toHaveBeenCalledWith(
        chalk.blue('[INFO] [TEST] Scoped message')
      );
    });

    it('should inherit verbose setting from parent', () => {
      logger.setVerbose(true);
      const scopedLogger = logger.scope('TEST');
      scopedLogger.debug('Debug message');

      expect(mockConsole.log).toHaveBeenCalledWith(
        chalk.gray('[DEBUG] [TEST] Debug message')
      );
    });
  });

  describe('table method', () => {
    it('should call console.table', () => {
      const data = [{ name: 'test', value: 123 }];
      logger.table(data);

      expect(mockConsole.table).toHaveBeenCalledWith(data);
    });
  });

  describe('separator method', () => {
    it('should log separator line', () => {
      logger.separator();

      expect(mockConsole.log).toHaveBeenCalledWith(
        chalk.gray('─'.repeat(50))
      );
    });
  });

  describe('box method', () => {
    it('should log boxed message with default blue color', () => {
      logger.box('Test message');

      // Check that console.log was called multiple times for the box
      expect(mockConsole.log).toHaveBeenCalledTimes(3);
      
      // Verify the box structure (top, content, bottom)
      const calls = mockConsole.log.mock.calls;
      expect(calls[0][0]).toContain('┌');
      expect(calls[1][0]).toContain('│  Test message  │');
      expect(calls[2][0]).toContain('└');
    });

    it('should log boxed message with specified color', () => {
      logger.box('Test message', 'red');

      const calls = mockConsole.log.mock.calls;
      expect(calls.length).toBeGreaterThan(0);
      // The exact color testing would require more complex chalk mocking
    });

    it('should handle multi-line messages', () => {
      logger.box('Line 1\nLine 2');

      // Should have 4 calls: top border, line 1, line 2, bottom border
      expect(mockConsole.log).toHaveBeenCalledTimes(4);
    });
  });

  describe('with additional arguments', () => {
    it('should pass additional arguments to console methods', () => {
      const obj = { key: 'value' };
      const num = 42;
      
      logger.info('Message with args', obj, num);

      expect(mockConsole.log).toHaveBeenCalledWith(
        chalk.blue('[INFO] Message with args'),
        obj,
        num
      );
    });
  });
});
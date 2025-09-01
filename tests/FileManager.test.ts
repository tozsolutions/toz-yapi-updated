import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { tmpdir } from 'os';

import { FileManager } from '../src/utils/FileManager.js';

describe('FileManager', () => {
  let fileManager: FileManager;
  let testDir: string;

  beforeEach(async () => {
    fileManager = new FileManager();
    testDir = path.join(tmpdir(), `toz-yapi-test-${Date.now()}`);
    await fs.mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    try {
      await fs.rmdir(testDir, { recursive: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('exists', () => {
    it('should return true for existing file', async () => {
      const testFile = path.join(testDir, 'test.txt');
      await fs.writeFile(testFile, 'test content');

      const exists = await fileManager.exists(testFile);
      expect(exists).toBe(true);
    });

    it('should return false for non-existing file', async () => {
      const testFile = path.join(testDir, 'non-existing.txt');

      const exists = await fileManager.exists(testFile);
      expect(exists).toBe(false);
    });
  });

  describe('ensureDir', () => {
    it('should create directory if it does not exist', async () => {
      const newDir = path.join(testDir, 'new-dir');

      await fileManager.ensureDir(newDir);

      const exists = await fileManager.exists(newDir);
      expect(exists).toBe(true);
    });

    it('should not throw if directory already exists', async () => {
      const existingDir = path.join(testDir, 'existing-dir');
      await fs.mkdir(existingDir);

      await expect(fileManager.ensureDir(existingDir)).resolves.not.toThrow();
    });
  });

  describe('writeFile', () => {
    it('should write file with content', async () => {
      const testFile = path.join(testDir, 'write-test.txt');
      const content = 'Hello, World!';

      await fileManager.writeFile(testFile, content);

      const writtenContent = await fs.readFile(testFile, 'utf8');
      expect(writtenContent).toBe(content);
    });

    it('should create directory structure if it does not exist', async () => {
      const testFile = path.join(testDir, 'nested', 'dir', 'test.txt');
      const content = 'Nested content';

      await fileManager.writeFile(testFile, content);

      const writtenContent = await fs.readFile(testFile, 'utf8');
      expect(writtenContent).toBe(content);
    });
  });

  describe('readFile', () => {
    it('should read file content', async () => {
      const testFile = path.join(testDir, 'read-test.txt');
      const content = 'Test content to read';
      await fs.writeFile(testFile, content);

      const readContent = await fileManager.readFile(testFile);
      expect(readContent).toBe(content);
    });

    it('should throw error for non-existing file', async () => {
      const testFile = path.join(testDir, 'non-existing.txt');

      await expect(fileManager.readFile(testFile)).rejects.toThrow();
    });
  });

  describe('copyFile', () => {
    it('should copy file from source to destination', async () => {
      const sourceFile = path.join(testDir, 'source.txt');
      const destFile = path.join(testDir, 'dest.txt');
      const content = 'Content to copy';
      await fs.writeFile(sourceFile, content);

      await fileManager.copyFile(sourceFile, destFile);

      const copiedContent = await fs.readFile(destFile, 'utf8');
      expect(copiedContent).toBe(content);
    });

    it('should create destination directory if it does not exist', async () => {
      const sourceFile = path.join(testDir, 'source.txt');
      const destFile = path.join(testDir, 'nested', 'dest.txt');
      const content = 'Content to copy';
      await fs.writeFile(sourceFile, content);

      await fileManager.copyFile(sourceFile, destFile);

      const copiedContent = await fs.readFile(destFile, 'utf8');
      expect(copiedContent).toBe(content);
    });
  });

  describe('readDir', () => {
    it('should list directory contents', async () => {
      await fs.writeFile(path.join(testDir, 'file1.txt'), 'content1');
      await fs.writeFile(path.join(testDir, 'file2.txt'), 'content2');
      await fs.mkdir(path.join(testDir, 'subdir'));

      const contents = await fileManager.readDir(testDir);

      expect(contents).toContain('file1.txt');
      expect(contents).toContain('file2.txt');
      expect(contents).toContain('subdir');
    });
  });

  describe('getStats', () => {
    it('should return file stats', async () => {
      const testFile = path.join(testDir, 'stats-test.txt');
      const content = 'Test content';
      await fs.writeFile(testFile, content);

      const stats = await fileManager.getStats(testFile);

      expect(stats.isFile).toBe(true);
      expect(stats.isDirectory).toBe(false);
      expect(stats.size).toBe(content.length);
    });

    it('should return directory stats', async () => {
      const stats = await fileManager.getStats(testDir);

      expect(stats.isFile).toBe(false);
      expect(stats.isDirectory).toBe(true);
    });
  });

  describe('findFiles', () => {
    it('should find files matching pattern', async () => {
      await fs.writeFile(path.join(testDir, 'test1.js'), 'content');
      await fs.writeFile(path.join(testDir, 'test2.ts'), 'content');
      await fs.writeFile(path.join(testDir, 'test3.js'), 'content');
      await fs.writeFile(path.join(testDir, 'readme.md'), 'content');

      const jsFiles = await fileManager.findFiles(testDir, /\.js$/);

      expect(jsFiles).toHaveLength(2);
      expect(jsFiles.some(file => file.includes('test1.js'))).toBe(true);
      expect(jsFiles.some(file => file.includes('test3.js'))).toBe(true);
    });

    it('should find files in nested directories', async () => {
      const nestedDir = path.join(testDir, 'nested');
      await fs.mkdir(nestedDir);
      await fs.writeFile(path.join(nestedDir, 'nested.ts'), 'content');
      await fs.writeFile(path.join(testDir, 'root.ts'), 'content');

      const tsFiles = await fileManager.findFiles(testDir, /\.ts$/);

      expect(tsFiles).toHaveLength(2);
      expect(tsFiles.some(file => file.includes('nested.ts'))).toBe(true);
      expect(tsFiles.some(file => file.includes('root.ts'))).toBe(true);
    });
  });
});
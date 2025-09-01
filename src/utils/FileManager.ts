import { promises as fs } from 'fs';
import path from 'path';

/**
 * File management utilities
 */
export class FileManager {
  /**
   * Check if a file or directory exists
   */
  async exists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Ensure directory exists, create if it doesn't
   */
  async ensureDir(dirPath: string): Promise<void> {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code !== 'EEXIST') {
        throw error;
      }
    }
  }

  /**
   * Write file with content
   */
  async writeFile(filePath: string, content: string, encoding: BufferEncoding = 'utf8'): Promise<void> {
    const dir = path.dirname(filePath);
    await this.ensureDir(dir);
    await fs.writeFile(filePath, content, encoding);
  }

  /**
   * Read file content
   */
  async readFile(filePath: string, encoding: BufferEncoding = 'utf8'): Promise<string> {
    return fs.readFile(filePath, encoding);
  }

  /**
   * Copy file
   */
  async copyFile(src: string, dest: string): Promise<void> {
    const dir = path.dirname(dest);
    await this.ensureDir(dir);
    await fs.copyFile(src, dest);
  }

  /**
   * List directory contents
   */
  async readDir(dirPath: string): Promise<string[]> {
    return fs.readdir(dirPath);
  }

  /**
   * Get file stats
   */
  async getStats(filePath: string): Promise<{ isDirectory: boolean; isFile: boolean; size: number }> {
    const stats = await fs.stat(filePath);
    return {
      isDirectory: stats.isDirectory(),
      isFile: stats.isFile(),
      size: stats.size,
    };
  }

  /**
   * Remove file or directory
   */
  async remove(filePath: string): Promise<void> {
    const stats = await this.getStats(filePath);
    if (stats.isDirectory) {
      await fs.rmdir(filePath, { recursive: true });
    } else {
      await fs.unlink(filePath);
    }
  }

  /**
   * Find files matching pattern
   */
  async findFiles(dirPath: string, pattern: RegExp): Promise<string[]> {
    const files: string[] = [];
    
    async function searchDir(currentPath: string): Promise<void> {
      const items = await fs.readdir(currentPath);
      
      for (const item of items) {
        const fullPath = path.join(currentPath, item);
        const stats = await fs.stat(fullPath);
        
        if (stats.isDirectory()) {
          await searchDir(fullPath);
        } else if (pattern.test(item)) {
          files.push(fullPath);
        }
      }
    }
    
    await searchDir(dirPath);
    return files;
  }
}
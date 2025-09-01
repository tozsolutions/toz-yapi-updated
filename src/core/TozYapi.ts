import path from 'path';
import { promises as fs } from 'fs';
import chalk from 'chalk';
import ora from 'ora';

import type { ProjectConfig, CommandOptions, ValidationResult } from '../types/index.js';
import { FileManager } from '../utils/FileManager.js';
import { Logger } from '../utils/Logger.js';
import { TemplateManager } from './TemplateManager.js';
import { Validator } from './Validator.js';

/**
 * Core class for Toz Yapı operations
 */
export class TozYapi {
  private fileManager: FileManager;
  private logger: Logger;
  private templateManager: TemplateManager;
  private validator: Validator;
  private config: Partial<ProjectConfig>;

  constructor(config?: Partial<ProjectConfig>) {
    this.config = config ?? {};
    this.fileManager = new FileManager();
    this.logger = new Logger();
    this.templateManager = new TemplateManager();
    this.validator = new Validator();
  }

  /**
   * Create a new project
   */
  async createProject(
    name: string,
    options?: {
      template?: string;
      path?: string;
      force?: boolean;
    }
  ): Promise<void> {
    const spinner = ora(`Creating project ${chalk.cyan(name)}`).start();

    try {
      const projectPath = path.resolve(options?.path ?? process.cwd(), name);
      
      // Check if directory exists
      if (!options?.force && await this.fileManager.exists(projectPath)) {
        throw new Error(`Directory ${projectPath} already exists. Use --force to overwrite.`);
      }

      // Create project directory
      await this.fileManager.ensureDir(projectPath);

      // Load template
      const template = await this.templateManager.loadTemplate(options?.template ?? 'default');

      // Generate project files
      await this.templateManager.generateProject({
        projectName: name,
        projectPath,
        template,
        options: options ?? {},
        structure: {
          directories: [],
          files: [],
        },
      });

      spinner.succeed(`Project ${chalk.cyan(name)} created successfully!`);
      
      this.logger.info(`
Next steps:
  ${chalk.cyan('cd')} ${name}
  ${chalk.cyan('npm install')}
  ${chalk.cyan('npm run dev')}
      `);

    } catch (error) {
      spinner.fail(`Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  /**
   * Update existing project
   */
  async updateProject(projectPath?: string): Promise<void> {
    const targetPath = projectPath ?? process.cwd();
    const spinner = ora(`Updating project at ${chalk.cyan(targetPath)}`).start();

    try {
      // Validate that this is a valid project
      const isValid = await this.validator.isValidProject(targetPath);
      if (!isValid) {
        throw new Error('Not a valid project directory');
      }

      // Update project structure
      await this.templateManager.updateProject(targetPath);

      spinner.succeed('Project updated successfully!');
    } catch (error) {
      spinner.fail(`Failed to update project: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  /**
   * Validate project structure
   */
  async validateProject(projectPath?: string): Promise<boolean> {
    const targetPath = projectPath ?? process.cwd();
    
    this.logger.info(`Validating project at ${chalk.cyan(targetPath)}`);

    try {
      const result: ValidationResult = await this.validator.validateProject(targetPath);

      if (result.valid) {
        this.logger.success('✅ Project validation passed!');
      } else {
        this.logger.error('❌ Project validation failed!');
        
        if (result.errors.length > 0) {
          this.logger.error('\nErrors:');
          result.errors.forEach(error => {
            this.logger.error(`  • ${error.message} ${error.file ? `(${error.file})` : ''}`);
          });
        }

        if (result.warnings.length > 0) {
          this.logger.warn('\nWarnings:');
          result.warnings.forEach(warning => {
            this.logger.warn(`  • ${warning.message} ${warning.file ? `(${warning.file})` : ''}`);
          });
        }
      }

      return result.valid;
    } catch (error) {
      this.logger.error(`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }

  /**
   * Generate scaffolding
   */
  async scaffold(type: string, name: string, targetPath?: string): Promise<void> {
    const spinner = ora(`Scaffolding ${chalk.cyan(type)} ${chalk.green(name)}`).start();

    try {
      await this.templateManager.scaffold({
        type: type as 'component' | 'service' | 'module' | 'test' | 'config',
        name,
        path: targetPath,
      });

      spinner.succeed(`${type} ${chalk.green(name)} scaffolded successfully!`);
    } catch (error) {
      spinner.fail(`Failed to scaffold ${type}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }
}
import path from 'path';

import type { ValidationResult, ValidationError, ValidationWarning, ProjectStructure } from '../types/index.js';
import { FileManager } from '../utils/FileManager.js';
import { Logger } from '../utils/Logger.js';

/**
 * Project validation utilities
 */
export class Validator {
  private fileManager: FileManager;
  private logger: Logger;

  constructor() {
    this.fileManager = new FileManager();
    this.logger = new Logger().scope('Validator');
  }

  /**
   * Check if directory is a valid project
   */
  async isValidProject(projectPath: string): Promise<boolean> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    return this.fileManager.exists(packageJsonPath);
  }

  /**
   * Validate project structure and configuration
   */
  async validateProject(projectPath: string): Promise<ValidationResult> {
    this.logger.debug(`Validating project at: ${projectPath}`);

    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    try {
      // Check basic project structure
      await this.validateBasicStructure(projectPath, errors, warnings);

      // Check package.json
      await this.validatePackageJson(projectPath, errors, warnings);

      // Check TypeScript configuration
      await this.validateTypeScript(projectPath, errors, warnings);

      // Check linting configuration
      await this.validateLinting(projectPath, errors, warnings);

      // Check testing setup
      await this.validateTesting(projectPath, errors, warnings);

      // Check CI/CD setup
      await this.validateCICD(projectPath, errors, warnings);

      // Check security configuration
      await this.validateSecurity(projectPath, errors, warnings);

      // Check documentation
      await this.validateDocumentation(projectPath, errors, warnings);

    } catch (error) {
      errors.push({
        code: 'VALIDATION_ERROR',
        message: `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error',
      });
    }

    const valid = errors.length === 0;

    this.logger.debug(`Validation completed. Valid: ${valid}, Errors: ${errors.length}, Warnings: ${warnings.length}`);

    return {
      valid,
      errors,
      warnings,
    };
  }

  /**
   * Analyze project structure
   */
  async analyzeProjectStructure(projectPath: string): Promise<ProjectStructure> {
    const structure: ProjectStructure = {
      directories: [],
      files: [],
      hasTypeScript: false,
      hasTests: false,
      hasLinting: false,
      hasCI: false,
      hasDocker: false,
    };

    try {
      // Get all items in project directory
      const items = await this.fileManager.readDir(projectPath);

      for (const item of items) {
        const itemPath = path.join(projectPath, item);
        const stats = await this.fileManager.getStats(itemPath);

        if (stats.isDirectory) {
          structure.directories.push(item);
        } else {
          structure.files.push(item);
        }
      }

      // Check for specific files and directories
      structure.hasTypeScript = structure.files.includes('tsconfig.json');
      structure.hasTests = structure.directories.includes('tests') || 
                          structure.directories.includes('test') ||
                          structure.files.some(file => file.includes('.test.') || file.includes('.spec.'));
      structure.hasLinting = structure.files.some(file => file.startsWith('.eslintrc'));
      structure.hasCI = structure.directories.includes('.github');
      structure.hasDocker = structure.files.includes('Dockerfile') || structure.files.includes('docker-compose.yml');

      // Load package.json if it exists
      if (structure.files.includes('package.json')) {
        try {
          const packageJsonContent = await this.fileManager.readFile(path.join(projectPath, 'package.json'));
          structure.packageJson = JSON.parse(packageJsonContent);
        } catch {
          // Ignore package.json parsing errors
        }
      }

    } catch (error) {
      this.logger.warn(`Failed to analyze project structure: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return structure;
  }

  /**
   * Validate basic project structure
   */
  private async validateBasicStructure(
    projectPath: string,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): Promise<void> {
    const requiredFiles = ['package.json', 'README.md'];
    const recommendedFiles = ['LICENSE', '.gitignore', 'CONTRIBUTING.md'];
    const recommendedDirs = ['src', 'tests'];

    // Check required files
    for (const file of requiredFiles) {
      const filePath = path.join(projectPath, file);
      if (!(await this.fileManager.exists(filePath))) {
        errors.push({
          code: 'MISSING_REQUIRED_FILE',
          message: `Required file missing: ${file}`,
          file,
          severity: 'error',
        });
      }
    }

    // Check recommended files
    for (const file of recommendedFiles) {
      const filePath = path.join(projectPath, file);
      if (!(await this.fileManager.exists(filePath))) {
        warnings.push({
          code: 'MISSING_RECOMMENDED_FILE',
          message: `Recommended file missing: ${file}`,
          file,
          fixable: true,
        });
      }
    }

    // Check recommended directories
    for (const dir of recommendedDirs) {
      const dirPath = path.join(projectPath, dir);
      if (!(await this.fileManager.exists(dirPath))) {
        warnings.push({
          code: 'MISSING_RECOMMENDED_DIR',
          message: `Recommended directory missing: ${dir}`,
          file: dir,
          fixable: true,
        });
      }
    }
  }

  /**
   * Validate package.json
   */
  private async validatePackageJson(
    projectPath: string,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): Promise<void> {
    const packageJsonPath = path.join(projectPath, 'package.json');

    if (!(await this.fileManager.exists(packageJsonPath))) {
      return; // Already handled in basic structure validation
    }

    try {
      const packageJsonContent = await this.fileManager.readFile(packageJsonPath);
      const packageJson = JSON.parse(packageJsonContent);

      // Check required fields
      const requiredFields = ['name', 'version', 'description'];
      for (const field of requiredFields) {
        if (!packageJson[field]) {
          errors.push({
            code: 'MISSING_PACKAGE_FIELD',
            message: `Required package.json field missing: ${field}`,
            file: 'package.json',
            severity: 'error',
          });
        }
      }

      // Check recommended fields
      const recommendedFields = ['author', 'license', 'repository', 'keywords'];
      for (const field of recommendedFields) {
        if (!packageJson[field]) {
          warnings.push({
            code: 'MISSING_RECOMMENDED_PACKAGE_FIELD',
            message: `Recommended package.json field missing: ${field}`,
            file: 'package.json',
            fixable: true,
          });
        }
      }

      // Check scripts
      const recommendedScripts = ['build', 'test', 'lint'];
      for (const script of recommendedScripts) {
        if (!packageJson.scripts?.[script]) {
          warnings.push({
            code: 'MISSING_RECOMMENDED_SCRIPT',
            message: `Recommended npm script missing: ${script}`,
            file: 'package.json',
            fixable: true,
          });
        }
      }

    } catch (error) {
      errors.push({
        code: 'INVALID_PACKAGE_JSON',
        message: `Invalid package.json: ${error instanceof Error ? error.message : 'Unknown error'}`,
        file: 'package.json',
        severity: 'error',
      });
    }
  }

  /**
   * Validate TypeScript configuration
   */
  private async validateTypeScript(
    projectPath: string,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): Promise<void> {
    const tsconfigPath = path.join(projectPath, 'tsconfig.json');

    if (!(await this.fileManager.exists(tsconfigPath))) {
      warnings.push({
        code: 'MISSING_TYPESCRIPT_CONFIG',
        message: 'TypeScript configuration missing (tsconfig.json)',
        file: 'tsconfig.json',
        fixable: true,
      });
      return;
    }

    try {
      const tsconfigContent = await this.fileManager.readFile(tsconfigPath);
      const tsconfig = JSON.parse(tsconfigContent);

      // Check compiler options
      const recommendedOptions = {
        strict: true,
        noImplicitAny: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
      };

      for (const [option, expectedValue] of Object.entries(recommendedOptions)) {
        if (tsconfig.compilerOptions?.[option] !== expectedValue) {
          warnings.push({
            code: 'SUBOPTIMAL_TYPESCRIPT_CONFIG',
            message: `Recommended TypeScript option: ${option} should be ${expectedValue}`,
            file: 'tsconfig.json',
            fixable: true,
          });
        }
      }

    } catch (error) {
      errors.push({
        code: 'INVALID_TYPESCRIPT_CONFIG',
        message: `Invalid tsconfig.json: ${error instanceof Error ? error.message : 'Unknown error'}`,
        file: 'tsconfig.json',
        severity: 'error',
      });
    }
  }

  /**
   * Validate linting configuration
   */
  private async validateLinting(
    projectPath: string,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): Promise<void> {
    const eslintFiles = ['.eslintrc.js', '.eslintrc.json', '.eslintrc.yml', '.eslintrc.yaml'];
    const prettierFiles = ['.prettierrc', '.prettierrc.js', '.prettierrc.json', '.prettierrc.yml'];

    let hasEslint = false;
    let hasPrettier = false;

    // Check for ESLint configuration
    for (const file of eslintFiles) {
      if (await this.fileManager.exists(path.join(projectPath, file))) {
        hasEslint = true;
        break;
      }
    }

    // Check for Prettier configuration
    for (const file of prettierFiles) {
      if (await this.fileManager.exists(path.join(projectPath, file))) {
        hasPrettier = true;
        break;
      }
    }

    if (!hasEslint) {
      warnings.push({
        code: 'MISSING_ESLINT_CONFIG',
        message: 'ESLint configuration missing',
        fixable: true,
      });
    }

    if (!hasPrettier) {
      warnings.push({
        code: 'MISSING_PRETTIER_CONFIG',
        message: 'Prettier configuration missing',
        fixable: true,
      });
    }
  }

  /**
   * Validate testing setup
   */
  private async validateTesting(
    projectPath: string,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): Promise<void> {
    const testFiles = await this.fileManager.findFiles(projectPath, /\.(test|spec)\.(js|ts|jsx|tsx)$/);
    const testDirs = ['tests', 'test', '__tests__'];

    let hasTests = testFiles.length > 0;
    
    if (!hasTests) {
      for (const dir of testDirs) {
        if (await this.fileManager.exists(path.join(projectPath, dir))) {
          hasTests = true;
          break;
        }
      }
    }

    if (!hasTests) {
      warnings.push({
        code: 'MISSING_TESTS',
        message: 'No test files or test directory found',
        fixable: true,
      });
    }

    // Check for test configuration
    const testConfigs = ['vitest.config.ts', 'jest.config.js', 'jest.config.ts'];
    let hasTestConfig = false;

    for (const config of testConfigs) {
      if (await this.fileManager.exists(path.join(projectPath, config))) {
        hasTestConfig = true;
        break;
      }
    }

    if (hasTests && !hasTestConfig) {
      warnings.push({
        code: 'MISSING_TEST_CONFIG',
        message: 'Test configuration missing (consider vitest.config.ts or jest.config.js)',
        fixable: true,
      });
    }
  }

  /**
   * Validate CI/CD setup
   */
  private async validateCICD(
    projectPath: string,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): Promise<void> {
    const githubWorkflowsPath = path.join(projectPath, '.github/workflows');
    
    if (!(await this.fileManager.exists(githubWorkflowsPath))) {
      warnings.push({
        code: 'MISSING_CI_CD',
        message: 'CI/CD configuration missing (.github/workflows)',
        fixable: true,
      });
      return;
    }

    const workflowFiles = await this.fileManager.readDir(githubWorkflowsPath);
    
    if (workflowFiles.length === 0) {
      warnings.push({
        code: 'EMPTY_CI_CD',
        message: 'CI/CD workflows directory is empty',
        fixable: true,
      });
    }
  }

  /**
   * Validate security configuration
   */
  private async validateSecurity(
    projectPath: string,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): Promise<void> {
    const gitignorePath = path.join(projectPath, '.gitignore');
    
    if (!(await this.fileManager.exists(gitignorePath))) {
      warnings.push({
        code: 'MISSING_GITIGNORE',
        message: '.gitignore file missing',
        fixable: true,
      });
      return;
    }

    try {
      const gitignoreContent = await this.fileManager.readFile(gitignorePath);
      const requiredPatterns = ['node_modules/', '*.log', '.env'];

      for (const pattern of requiredPatterns) {
        if (!gitignoreContent.includes(pattern)) {
          warnings.push({
            code: 'INCOMPLETE_GITIGNORE',
            message: `gitignore should include: ${pattern}`,
            file: '.gitignore',
            fixable: true,
          });
        }
      }

    } catch (error) {
      errors.push({
        code: 'INVALID_GITIGNORE',
        message: `Failed to read .gitignore: ${error instanceof Error ? error.message : 'Unknown error'}`,
        file: '.gitignore',
        severity: 'error',
      });
    }
  }

  /**
   * Validate documentation
   */
  private async validateDocumentation(
    projectPath: string,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): Promise<void> {
    const readmePath = path.join(projectPath, 'README.md');
    
    if (!(await this.fileManager.exists(readmePath))) {
      return; // Already handled in basic structure validation
    }

    try {
      const readmeContent = await this.fileManager.readFile(readmePath);
      const sections = ['installation', 'usage', 'api', 'contributing'];

      for (const section of sections) {
        if (!readmeContent.toLowerCase().includes(section)) {
          warnings.push({
            code: 'INCOMPLETE_README',
            message: `README.md should include ${section} section`,
            file: 'README.md',
            fixable: true,
          });
        }
      }

      // Check if README is too short
      if (readmeContent.length < 500) {
        warnings.push({
          code: 'SHORT_README',
          message: 'README.md appears to be too short and may lack important information',
          file: 'README.md',
          fixable: true,
        });
      }

    } catch (error) {
      errors.push({
        code: 'INVALID_README',
        message: `Failed to read README.md: ${error instanceof Error ? error.message : 'Unknown error'}`,
        file: 'README.md',
        severity: 'error',
      });
    }
  }
}
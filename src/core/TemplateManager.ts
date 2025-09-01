import path from 'path';

import type { TemplateConfig, GeneratorContext, ScaffoldOptions } from '../types/index.js';
import { FileManager } from '../utils/FileManager.js';
import { Logger } from '../utils/Logger.js';

/**
 * Template management and generation
 */
export class TemplateManager {
  private fileManager: FileManager;
  private logger: Logger;

  constructor() {
    this.fileManager = new FileManager();
    this.logger = new Logger().scope('TemplateManager');
  }

  /**
   * Load template configuration
   */
  async loadTemplate(templateName: string): Promise<TemplateConfig> {
    this.logger.debug(`Loading template: ${templateName}`);

    // For now, return a default template
    // In a real implementation, this would load from template files
    return {
      name: templateName,
      description: 'Default TypeScript project template',
      files: [],
      dependencies: [
        'chalk@^5.3.0',
        'commander@^11.1.0',
        'fs-extra@^11.2.0',
        'inquirer@^9.2.12',
        'ora@^7.0.1',
        'yargs@^17.7.2',
      ],
      devDependencies: [
        '@types/node@^20.10.0',
        '@typescript-eslint/eslint-plugin@^6.13.0',
        '@typescript-eslint/parser@^6.13.0',
        '@vitest/coverage-v8@^1.0.0',
        '@vitest/ui@^1.0.0',
        'eslint@^8.54.0',
        'eslint-config-prettier@^9.0.0',
        'eslint-plugin-import@^2.29.0',
        'eslint-plugin-prettier@^5.0.0',
        'husky@^8.0.3',
        'lint-staged@^15.1.0',
        'prettier@^3.1.0',
        'rimraf@^5.0.5',
        'tsx@^4.6.0',
        'typescript@^5.3.0',
        'vitest@^1.0.0',
      ],
      scripts: {
        dev: 'tsx watch src/index.ts',
        build: 'tsc',
        start: 'node dist/index.js',
        test: 'vitest',
        'test:watch': 'vitest --watch',
        'test:coverage': 'vitest --coverage',
        lint: 'eslint src tests --ext .ts,.tsx,.js,.jsx',
        'lint:fix': 'eslint src tests --ext .ts,.tsx,.js,.jsx --fix',
        format: 'prettier --write "src/**/*.{ts,tsx,js,jsx,json,md}" "tests/**/*.{ts,tsx,js,jsx,json,md}"',
        'format:check': 'prettier --check "src/**/*.{ts,tsx,js,jsx,json,md}" "tests/**/*.{ts,tsx,js,jsx,json,md}"',
        'type-check': 'tsc --noEmit',
        clean: 'rimraf dist coverage',
        prepare: 'husky install',
      },
    };
  }

  /**
   * Generate project from template
   */
  async generateProject(context: GeneratorContext): Promise<void> {
    this.logger.info(`Generating project: ${context.projectName}`);

    const { projectPath } = context;

    // Create basic directory structure
    const directories = [
      'src',
      'tests',
      'docs',
      'examples',
      '.github/workflows',
    ];

    for (const dir of directories) {
      await this.fileManager.ensureDir(path.join(projectPath, dir));
    }

    // Generate package.json
    await this.generatePackageJson(context);

    // Generate basic TypeScript files
    await this.generateTypeScriptConfig(context);
    await this.generateMainFiles(context);

    this.logger.success(`Project ${context.projectName} generated successfully`);
  }

  /**
   * Update existing project
   */
  async updateProject(projectPath: string): Promise<void> {
    this.logger.info('Updating project structure');

    // Check if package.json exists
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJsonExists = await this.fileManager.exists(packageJsonPath);

    if (!packageJsonExists) {
      throw new Error('package.json not found - not a valid Node.js project');
    }

    // Update dependencies and scripts
    const packageJson = JSON.parse(await this.fileManager.readFile(packageJsonPath));
    const template = await this.loadTemplate('default');

    // Merge scripts and dependencies
    packageJson.scripts = { ...packageJson.scripts, ...template.scripts };
    
    // Add missing dev dependencies
    if (template.devDependencies) {
      packageJson.devDependencies = packageJson.devDependencies || {};
      for (const dep of template.devDependencies) {
        const [name, version] = dep.split('@');
        if (!packageJson.devDependencies[name!]) {
          packageJson.devDependencies[name!] = `^${version}`;
        }
      }
    }

    await this.fileManager.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

    this.logger.success('Project updated successfully');
  }

  /**
   * Generate scaffolding
   */
  async scaffold(options: ScaffoldOptions): Promise<void> {
    this.logger.info(`Scaffolding ${options.type}: ${options.name}`);

    const targetPath = options.path || process.cwd();

    switch (options.type) {
      case 'component':
        await this.scaffoldComponent(options.name, targetPath);
        break;
      case 'service':
        await this.scaffoldService(options.name, targetPath);
        break;
      case 'module':
        await this.scaffoldModule(options.name, targetPath);
        break;
      case 'test':
        await this.scaffoldTest(options.name, targetPath);
        break;
      case 'config':
        await this.scaffoldConfig(options.name, targetPath);
        break;
      default:
        throw new Error(`Unknown scaffolding type: ${options.type}`);
    }

    this.logger.success(`${options.type} ${options.name} scaffolded successfully`);
  }

  /**
   * Generate package.json
   */
  private async generatePackageJson(context: GeneratorContext): Promise<void> {
    const packageJson = {
      name: context.projectName,
      version: '1.0.0',
      description: `Generated by Toz Yapı Updated`,
      main: 'dist/index.js',
      types: 'dist/index.d.ts',
      scripts: context.template.scripts,
      keywords: ['typescript', 'node', 'toz-yapi'],
      author: '',
      license: 'MIT',
      dependencies: context.template.dependencies?.reduce((acc, dep) => {
        const [name, version] = dep.split('@');
        acc[name!] = version!;
        return acc;
      }, {} as Record<string, string>),
      devDependencies: context.template.devDependencies?.reduce((acc, dep) => {
        const [name, version] = dep.split('@');
        acc[name!] = version!;
        return acc;
      }, {} as Record<string, string>),
    };

    await this.fileManager.writeFile(
      path.join(context.projectPath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
  }

  /**
   * Generate TypeScript configuration
   */
  private async generateTypeScriptConfig(context: GeneratorContext): Promise<void> {
    const tsConfig = {
      compilerOptions: {
        target: 'ES2022',
        module: 'NodeNext',
        moduleResolution: 'NodeNext',
        lib: ['ES2022'],
        outDir: './dist',
        rootDir: './src',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        declaration: true,
        declarationMap: true,
        sourceMap: true,
        removeComments: false,
      },
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist', 'tests'],
    };

    await this.fileManager.writeFile(
      path.join(context.projectPath, 'tsconfig.json'),
      JSON.stringify(tsConfig, null, 2)
    );
  }

  /**
   * Generate main application files
   */
  private async generateMainFiles(context: GeneratorContext): Promise<void> {
    const indexContent = `/**
 * ${context.projectName}
 * Generated by Toz Yapı Updated
 */

export class ${this.toPascalCase(context.projectName)} {
  private name: string;

  constructor(name = '${context.projectName}') {
    this.name = name;
  }

  /**
   * Get the application name
   */
  getName(): string {
    return this.name;
  }

  /**
   * Say hello
   */
  hello(): string {
    return \`Hello from \${this.name}!\`;
  }
}

export default ${this.toPascalCase(context.projectName)};
`;

    await this.fileManager.writeFile(
      path.join(context.projectPath, 'src/index.ts'),
      indexContent
    );
  }

  /**
   * Scaffold component
   */
  private async scaffoldComponent(name: string, targetPath: string): Promise<void> {
    const componentPath = path.join(targetPath, 'src/components');
    await this.fileManager.ensureDir(componentPath);

    const componentContent = `/**
 * ${name} Component
 * Generated by Toz Yapı Updated
 */

export interface ${this.toPascalCase(name)}Props {
  // Define component props here
}

export class ${this.toPascalCase(name)} {
  private props: ${this.toPascalCase(name)}Props;

  constructor(props: ${this.toPascalCase(name)}Props) {
    this.props = props;
  }

  render(): string {
    return \`<div class="${this.toKebabCase(name)}">${name} Component</div>\`;
  }
}

export default ${this.toPascalCase(name)};
`;

    await this.fileManager.writeFile(
      path.join(componentPath, `${this.toPascalCase(name)}.ts`),
      componentContent
    );
  }

  /**
   * Scaffold service
   */
  private async scaffoldService(name: string, targetPath: string): Promise<void> {
    const servicePath = path.join(targetPath, 'src/services');
    await this.fileManager.ensureDir(servicePath);

    const serviceContent = `/**
 * ${name} Service
 * Generated by Toz Yapı Updated
 */

export class ${this.toPascalCase(name)}Service {
  /**
   * Initialize the service
   */
  async initialize(): Promise<void> {
    // Initialization logic here
  }

  /**
   * Service method example
   */
  async process(data: unknown): Promise<unknown> {
    // Processing logic here
    return data;
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    // Cleanup logic here
  }
}

export default ${this.toPascalCase(name)}Service;
`;

    await this.fileManager.writeFile(
      path.join(servicePath, `${this.toPascalCase(name)}Service.ts`),
      serviceContent
    );
  }

  /**
   * Scaffold module
   */
  private async scaffoldModule(name: string, targetPath: string): Promise<void> {
    const modulePath = path.join(targetPath, 'src/modules', name);
    await this.fileManager.ensureDir(modulePath);

    const moduleContent = `/**
 * ${name} Module
 * Generated by Toz Yapı Updated
 */

export * from './types.js';
export * from './${this.toPascalCase(name)}.js';
`;

    const typesContent = `/**
 * ${name} Module Types
 */

export interface ${this.toPascalCase(name)}Config {
  // Module configuration
}

export interface ${this.toPascalCase(name)}Options {
  // Module options
}
`;

    const classContent = `import type { ${this.toPascalCase(name)}Config, ${this.toPascalCase(name)}Options } from './types.js';

/**
 * ${name} Module
 */
export class ${this.toPascalCase(name)} {
  private config: ${this.toPascalCase(name)}Config;

  constructor(config: ${this.toPascalCase(name)}Config) {
    this.config = config;
  }

  /**
   * Execute module functionality
   */
  async execute(options: ${this.toPascalCase(name)}Options): Promise<void> {
    // Module logic here
  }
}

export default ${this.toPascalCase(name)};
`;

    await this.fileManager.writeFile(path.join(modulePath, 'index.ts'), moduleContent);
    await this.fileManager.writeFile(path.join(modulePath, 'types.ts'), typesContent);
    await this.fileManager.writeFile(path.join(modulePath, `${this.toPascalCase(name)}.ts`), classContent);
  }

  /**
   * Scaffold test
   */
  private async scaffoldTest(name: string, targetPath: string): Promise<void> {
    const testPath = path.join(targetPath, 'tests');
    await this.fileManager.ensureDir(testPath);

    const testContent = `import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// Import the module you want to test
// import { ${this.toPascalCase(name)} } from '../src/${name}.js';

describe('${this.toPascalCase(name)}', () => {
  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    // Cleanup after each test
  });

  describe('functionality', () => {
    it('should work correctly', () => {
      // Your test here
      expect(true).toBe(true);
    });

    it('should handle edge cases', () => {
      // Edge case test
      expect(true).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should throw appropriate errors', () => {
      // Error handling test
      expect(() => {
        // Code that should throw
      }).toThrow();
    });
  });
});
`;

    await this.fileManager.writeFile(
      path.join(testPath, `${name}.test.ts`),
      testContent
    );
  }

  /**
   * Scaffold configuration
   */
  private async scaffoldConfig(name: string, targetPath: string): Promise<void> {
    const configPath = path.join(targetPath, 'config');
    await this.fileManager.ensureDir(configPath);

    const configContent = `/**
 * ${name} Configuration
 * Generated by Toz Yapı Updated
 */

export interface ${this.toPascalCase(name)}Config {
  // Configuration properties
  enabled: boolean;
  options: Record<string, unknown>;
}

export const default${this.toPascalCase(name)}Config: ${this.toPascalCase(name)}Config = {
  enabled: true,
  options: {},
};

export function load${this.toPascalCase(name)}Config(): ${this.toPascalCase(name)}Config {
  // Load configuration from environment, files, etc.
  return default${this.toPascalCase(name)}Config;
}

export default load${this.toPascalCase(name)}Config;
`;

    await this.fileManager.writeFile(
      path.join(configPath, `${name}.config.ts`),
      configContent
    );
  }

  /**
   * Convert string to PascalCase
   */
  private toPascalCase(str: string): string {
    return str
      .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
      .replace(/^./, char => char.toUpperCase());
  }

  /**
   * Convert string to kebab-case
   */
  private toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  }
}
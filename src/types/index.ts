/**
 * Project configuration interface
 */
export interface ProjectConfig {
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
  repository?: {
    type: string;
    url: string;
  };
  engines?: {
    node: string;
    npm: string;
  };
  keywords?: string[];
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

/**
 * Template configuration
 */
export interface TemplateConfig {
  name: string;
  description: string;
  files: TemplateFile[];
  dependencies?: string[];
  devDependencies?: string[];
  scripts?: Record<string, string>;
  postInstall?: string[];
}

/**
 * Template file definition
 */
export interface TemplateFile {
  path: string;
  content: string;
  encoding?: 'utf8' | 'binary';
  executable?: boolean;
}

/**
 * Scaffolding options
 */
export interface ScaffoldOptions {
  type: 'component' | 'service' | 'module' | 'test' | 'config';
  name: string;
  path?: string;
  template?: string;
  props?: Record<string, unknown>;
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

/**
 * Validation error
 */
export interface ValidationError {
  code: string;
  message: string;
  file?: string;
  line?: number;
  severity: 'error' | 'warning';
}

/**
 * Validation warning
 */
export interface ValidationWarning {
  code: string;
  message: string;
  file?: string;
  line?: number;
  fixable?: boolean;
}

/**
 * Build configuration
 */
export interface BuildConfig {
  entry: string;
  output: {
    path: string;
    filename: string;
  };
  target: 'node' | 'browser' | 'web';
  mode: 'development' | 'production';
  sourceMaps?: boolean;
  minify?: boolean;
}

/**
 * Command options for CLI
 */
export interface CommandOptions {
  force?: boolean;
  dryRun?: boolean;
  verbose?: boolean;
  silent?: boolean;
  template?: string;
  path?: string;
  config?: string;
}

/**
 * Project structure information
 */
export interface ProjectStructure {
  directories: string[];
  files: string[];
  packageJson?: ProjectConfig;
  hasTypeScript?: boolean;
  hasTests?: boolean;
  hasLinting?: boolean;
  hasCI?: boolean;
  hasDocker?: boolean;
}

/**
 * Generator context
 */
export interface GeneratorContext {
  projectName: string;
  projectPath: string;
  template: TemplateConfig;
  options: CommandOptions;
  structure: ProjectStructure;
}
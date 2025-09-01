import chalk from 'chalk';

import { TozYapi } from './core/TozYapi.js';
import type { ProjectConfig } from './types/index.js';

/**
 * Main entry point for the Toz Yapı Updated library
 */
export class TozYapiUpdated {
  private toz: TozYapi;

  constructor(config?: Partial<ProjectConfig>) {
    this.toz = new TozYapi(config);
  }

  /**
   * Create a new project
   */
  async createProject(name: string, options?: {
    template?: string;
    path?: string;
    force?: boolean;
  }): Promise<void> {
    return this.toz.createProject(name, options);
  }

  /**
   * Update existing project
   */
  async updateProject(path?: string): Promise<void> {
    return this.toz.updateProject(path);
  }

  /**
   * Validate project structure
   */
  async validateProject(path?: string): Promise<boolean> {
    return this.toz.validateProject(path);
  }

  /**
   * Generate scaffolding
   */
  async scaffold(type: string, name: string, path?: string): Promise<void> {
    return this.toz.scaffold(type, name, path);
  }
}

/**
 * Default export for convenience
 */
export default TozYapiUpdated;

/**
 * Re-export types
 */
export type * from './types/index.js';

/**
 * Version information
 */
export const version = '1.0.0';

/**
 * Welcome message
 */
export function welcome(): void {
  console.log(chalk.cyan(`
████████╗ ██████╗ ███████╗    ██╗   ██╗ █████╗ ██████╗ ██╗
╚══██╔══╝██╔═══██╗╚══███╔╝    ╚██╗ ██╔╝██╔══██╗██╔══██╗██║
   ██║   ██║   ██║  ███╔╝      ╚████╔╝ ███████║██████╔╝██║
   ██║   ██║   ██║ ███╔╝        ╚██╔╝  ██╔══██║██╔═══╝ ██║
   ██║   ╚██████╔╝███████╗       ██║   ██║  ██║██║     ██║
   ╚═╝    ╚═════╝ ╚══════╝       ╚═╝   ╚═╝  ╚═╝╚═╝     ╚═╝
  `));
  console.log(chalk.green('Modern, production-ready project scaffolding tool'));
  console.log(chalk.gray('Version:'), chalk.white(version));
  console.log('');
}
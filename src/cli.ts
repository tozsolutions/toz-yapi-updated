#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';

import { createProject } from './commands/create.js';
import { updateProject } from './commands/update.js';
import { validateProject } from './commands/validate.js';
import { scaffoldCommand } from './commands/scaffold.js';

const packageInfo = {
  name: 'toz-yapi-updated',
  version: '1.0.0',
  description: 'Modern, production-ready project scaffolding tool',
};

program
  .name(packageInfo.name)
  .description(packageInfo.description)
  .version(packageInfo.version);

program
  .command('create')
  .description('Create a new project with modern structure')
  .argument('<project-name>', 'Name of the project to create')
  .option('-t, --template <template>', 'Template to use', 'default')
  .option('-f, --force', 'Force overwrite existing directory')
  .option('--no-install', 'Skip npm install')
  .option('--no-git', 'Skip git initialization')
  .action(createProject);

program
  .command('update')
  .description('Update existing project structure')
  .option('-c, --config <path>', 'Path to config file')
  .option('--dry-run', 'Show what would be updated without making changes')
  .action(updateProject);

program
  .command('validate')
  .description('Validate project structure and configuration')
  .option('-f, --fix', 'Automatically fix issues where possible')
  .option('--strict', 'Use strict validation rules')
  .action(validateProject);

program
  .command('scaffold')
  .description('Add scaffolding to existing project')
  .argument('<type>', 'Type of scaffolding (component, service, etc.)')
  .argument('<name>', 'Name of the item to scaffold')
  .option('-p, --path <path>', 'Target path for scaffolding')
  .action(scaffoldCommand);

// Error handling
program.exitOverride();

try {
  program.parse();
} catch (err) {
  if (err instanceof Error) {
    console.error(chalk.red('Error:'), err.message);
    process.exit(1);
  }
}

export { program };
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';

import type { CommandOptions } from '../types/index.js';
import { TozYapi } from '../core/TozYapi.js';
import { welcome } from '../index.js';

/**
 * Create command implementation
 */
export async function createProject(
  projectName: string,
  options: CommandOptions
): Promise<void> {
  welcome();

  console.log(chalk.blue('🚀 Creating new project with Toz Yapı Updated\n'));

  // Validate project name
  if (!projectName || projectName.trim() === '') {
    console.error(chalk.red('❌ Project name is required'));
    process.exit(1);
  }

  // Sanitize project name
  const sanitizedName = projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  if (sanitizedName !== projectName) {
    console.log(chalk.yellow(`📝 Project name sanitized: ${chalk.cyan(sanitizedName)}`));
  }

  try {
    // Interactive prompts for additional options
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'description',
        message: 'Project description:',
        default: `A modern project created with Toz Yapı Updated`,
      },
      {
        type: 'input',
        name: 'author',
        message: 'Author name:',
        default: '',
      },
      {
        type: 'list',
        name: 'template',
        message: 'Choose a template:',
        choices: [
          { name: 'Default TypeScript', value: 'default' },
          { name: 'Library', value: 'library' },
          { name: 'CLI Tool', value: 'cli' },
          { name: 'Web API', value: 'api' },
        ],
        default: options.template || 'default',
      },
      {
        type: 'confirm',
        name: 'installDeps',
        message: 'Install dependencies after creation?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'initGit',
        message: 'Initialize git repository?',
        default: true,
      },
    ]);

    const toz = new TozYapi();
    
    // Create the project
    await toz.createProject(sanitizedName, {
      template: answers.template,
      path: options.path,
      force: options.force,
    });

    // Install dependencies if requested
    if (answers.installDeps) {
      const installSpinner = ora('Installing dependencies...').start();
      try {
        const { spawn } = await import('child_process');
        await new Promise<void>((resolve, reject) => {
          const npm = spawn('npm', ['install'], {
            cwd: sanitizedName,
            stdio: 'pipe',
          });

          npm.on('close', (code) => {
            if (code === 0) {
              installSpinner.succeed('Dependencies installed successfully!');
              resolve();
            } else {
              installSpinner.fail('Failed to install dependencies');
              reject(new Error(`npm install failed with code ${code}`));
            }
          });

          npm.on('error', (error) => {
            installSpinner.fail('Failed to install dependencies');
            reject(error);
          });
        });
      } catch (error) {
        console.log(chalk.yellow('\n⚠️  Failed to install dependencies automatically.'));
        console.log(chalk.gray('You can install them manually with:'));
        console.log(chalk.cyan(`  cd ${sanitizedName}`));
        console.log(chalk.cyan('  npm install'));
      }
    }

    // Initialize git repository if requested
    if (answers.initGit && !options.config?.includes('no-git')) {
      const gitSpinner = ora('Initializing git repository...').start();
      try {
        const { spawn } = await import('child_process');
        await new Promise<void>((resolve, reject) => {
          const git = spawn('git', ['init'], {
            cwd: sanitizedName,
            stdio: 'pipe',
          });

          git.on('close', (code) => {
            if (code === 0) {
              gitSpinner.succeed('Git repository initialized!');
              resolve();
            } else {
              gitSpinner.fail('Failed to initialize git repository');
              reject(new Error(`git init failed with code ${code}`));
            }
          });

          git.on('error', (error) => {
            gitSpinner.fail('Failed to initialize git repository');
            reject(error);
          });
        });
      } catch (error) {
        console.log(chalk.yellow('\n⚠️  Failed to initialize git repository.'));
        console.log(chalk.gray('You can initialize it manually with:'));
        console.log(chalk.cyan(`  cd ${sanitizedName}`));
        console.log(chalk.cyan('  git init'));
      }
    }

    // Success message
    console.log(chalk.green('\n✅ Project created successfully!\n'));
    
    console.log(chalk.blue('📋 Next steps:'));
    console.log(chalk.gray('  1.'), chalk.cyan(`cd ${sanitizedName}`));
    
    if (!answers.installDeps) {
      console.log(chalk.gray('  2.'), chalk.cyan('npm install'));
    }
    
    console.log(chalk.gray(answers.installDeps ? '  2.' : '  3.'), chalk.cyan('npm run dev'));
    console.log('');
    
    console.log(chalk.blue('📚 Available commands:'));
    console.log(chalk.gray('  •'), chalk.cyan('npm run build'), chalk.gray('- Build for production'));
    console.log(chalk.gray('  •'), chalk.cyan('npm test'), chalk.gray('- Run tests'));
    console.log(chalk.gray('  •'), chalk.cyan('npm run lint'), chalk.gray('- Check code quality'));
    console.log(chalk.gray('  •'), chalk.cyan('npm run format'), chalk.gray('- Format code'));
    console.log('');

  } catch (error) {
    console.error(chalk.red('\n❌ Failed to create project:'));
    console.error(chalk.red(error instanceof Error ? error.message : 'Unknown error'));
    process.exit(1);
  }
}
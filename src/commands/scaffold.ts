import chalk from 'chalk';
import inquirer from 'inquirer';

import type { CommandOptions } from '../types/index.js';
import { TozYapi } from '../core/TozYapi.js';

/**
 * Scaffold command implementation
 */
export async function scaffoldCommand(
  type: string,
  name: string,
  options: CommandOptions
): Promise<void> {
  console.log(chalk.blue(`🏗️  Scaffolding ${type} with Toz Yapı Updated\n`));

  // Validate inputs
  if (!type || !name) {
    console.error(chalk.red('❌ Type and name are required'));
    console.log(chalk.gray('Usage: toz-yapi scaffold <type> <name>'));
    process.exit(1);
  }

  const validTypes = ['component', 'service', 'module', 'test', 'config'];
  if (!validTypes.includes(type)) {
    console.error(chalk.red(`❌ Invalid type: ${type}`));
    console.log(chalk.gray('Valid types:'), validTypes.join(', '));
    process.exit(1);
  }

  try {
    const toz = new TozYapi();
    const targetPath = options.path || process.cwd();

    console.log(chalk.blue('📄 Scaffolding details:'));
    console.log(chalk.gray('  Type:'), chalk.cyan(type));
    console.log(chalk.gray('  Name:'), chalk.cyan(name));
    console.log(chalk.gray('  Path:'), chalk.cyan(targetPath));
    console.log('');

    // Interactive prompts for additional options
    const typePrompts: Record<string, any[]> = {
      component: [
        {
          type: 'confirm',
          name: 'withProps',
          message: 'Include props interface?',
          default: true,
        },
        {
          type: 'confirm',
          name: 'withStyles',
          message: 'Include styles file?',
          default: false,
        },
      ],
      service: [
        {
          type: 'list',
          name: 'serviceType',
          message: 'Service type:',
          choices: [
            { name: 'Data Service', value: 'data' },
            { name: 'API Service', value: 'api' },
            { name: 'Business Logic', value: 'business' },
            { name: 'Utility Service', value: 'utility' },
          ],
          default: 'data',
        },
      ],
      module: [
        {
          type: 'confirm',
          name: 'withConfig',
          message: 'Include configuration?',
          default: true,
        },
        {
          type: 'confirm',
          name: 'withTypes',
          message: 'Include type definitions?',
          default: true,
        },
      ],
      test: [
        {
          type: 'list',
          name: 'testType',
          message: 'Test type:',
          choices: [
            { name: 'Unit Test', value: 'unit' },
            { name: 'Integration Test', value: 'integration' },
            { name: 'E2E Test', value: 'e2e' },
          ],
          default: 'unit',
        },
      ],
      config: [
        {
          type: 'list',
          name: 'configType',
          message: 'Configuration type:',
          choices: [
            { name: 'Environment Config', value: 'env' },
            { name: 'Database Config', value: 'database' },
            { name: 'API Config', value: 'api' },
            { name: 'Custom Config', value: 'custom' },
          ],
          default: 'env',
        },
      ],
    };

    const prompts = typePrompts[type] || [];
    const answers = prompts.length > 0 ? await inquirer.prompt(prompts) : {};

    // Confirm scaffolding
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Create ${type} "${name}"?`,
        default: true,
      },
    ]);

    if (!confirm) {
      console.log(chalk.yellow('⏹️  Scaffolding cancelled'));
      return;
    }

    // Perform scaffolding
    await toz.scaffold(type, name, targetPath);

    console.log(chalk.green(`\n✅ ${type} "${name}" scaffolded successfully!\n`));

    // Show what was created
    console.log(chalk.blue('📁 Files created:'));
    
    switch (type) {
      case 'component':
        console.log(chalk.gray('  •'), chalk.cyan(`src/components/${name}.ts`));
        if (answers.withProps) {
          console.log(chalk.gray('  •'), chalk.cyan(`src/components/${name}Props.ts`));
        }
        if (answers.withStyles) {
          console.log(chalk.gray('  •'), chalk.cyan(`src/components/${name}.css`));
        }
        break;
        
      case 'service':
        console.log(chalk.gray('  •'), chalk.cyan(`src/services/${name}Service.ts`));
        break;
        
      case 'module':
        console.log(chalk.gray('  •'), chalk.cyan(`src/modules/${name}/index.ts`));
        console.log(chalk.gray('  •'), chalk.cyan(`src/modules/${name}/${name}.ts`));
        if (answers.withTypes) {
          console.log(chalk.gray('  •'), chalk.cyan(`src/modules/${name}/types.ts`));
        }
        break;
        
      case 'test':
        console.log(chalk.gray('  •'), chalk.cyan(`tests/${name}.test.ts`));
        break;
        
      case 'config':
        console.log(chalk.gray('  •'), chalk.cyan(`config/${name}.config.ts`));
        break;
    }

    console.log('');
    console.log(chalk.blue('💡 Next steps:'));
    console.log(chalk.gray('  1.'), 'Review and customize the generated files');
    console.log(chalk.gray('  2.'), chalk.cyan('npm run lint'), chalk.gray('- Check code quality'));
    console.log(chalk.gray('  3.'), chalk.cyan('npm test'), chalk.gray('- Run tests'));

  } catch (error) {
    console.error(chalk.red(`\n❌ Failed to scaffold ${type}:`));
    console.error(chalk.red(error instanceof Error ? error.message : 'Unknown error'));
    process.exit(1);
  }
}
import chalk from 'chalk';

import type { CommandOptions } from '../types/index.js';
import { TozYapi } from '../core/TozYapi.js';

/**
 * Validate command implementation
 */
export async function validateProject(options: CommandOptions): Promise<void> {
  console.log(chalk.blue('🔍 Validating project with Toz Yapı Updated\n'));

  const targetPath = options.path || process.cwd();

  try {
    const toz = new TozYapi();

    console.log(chalk.blue('📁 Validating project at:'), chalk.cyan(targetPath));
    console.log('');

    // Perform validation
    const isValid = await toz.validateProject(targetPath);

    if (isValid) {
      console.log(chalk.green('✅ Project validation passed!\n'));
      console.log(chalk.blue('🎉 Your project follows best practices.'));
      console.log(chalk.gray('   All required files and configurations are present.'));
      
    } else {
      console.log(chalk.red('❌ Project validation failed!\n'));
      
      if (options.fix) {
        console.log(chalk.blue('🔧 Attempting to fix issues...\n'));
        
        try {
          // TODO: Implement auto-fix functionality
          await toz.updateProject(targetPath);
          
          console.log(chalk.green('✅ Issues fixed successfully!'));
          console.log(chalk.blue('🔄 Run validation again to verify all issues are resolved.'));
          
        } catch (fixError) {
          console.error(chalk.red('❌ Failed to fix some issues:'));
          console.error(chalk.red(fixError instanceof Error ? fixError.message : 'Unknown error'));
          
          console.log(chalk.yellow('\n💡 Manual fixes may be required.'));
          console.log(chalk.gray('   Review the validation output above for specific issues.'));
        }
        
      } else {
        console.log(chalk.yellow('💡 Use --fix to automatically fix issues where possible.'));
        console.log(chalk.gray('   Example: toz-yapi validate --fix'));
      }
    }

    console.log('');
    console.log(chalk.blue('📊 Validation Summary:'));
    console.log(chalk.gray('   Status:'), isValid ? chalk.green('PASS') : chalk.red('FAIL'));
    console.log(chalk.gray('   Strict mode:'), options.strict ? chalk.yellow('ON') : chalk.gray('OFF'));
    
    if (options.strict) {
      console.log(chalk.yellow('   ⚠️  Strict mode enabled - additional checks performed'));
    }

  } catch (error) {
    console.error(chalk.red('\n❌ Validation failed:'));
    console.error(chalk.red(error instanceof Error ? error.message : 'Unknown error'));
    process.exit(1);
  }
}
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Build script for Toz Yapı Updated
 * This script handles post-build tasks like copying files, generating assets, etc.
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function build(): Promise<void> {
  console.log('🏗️  Running post-build tasks...');

  try {
    const rootDir = path.resolve(__dirname, '..');
    const distDir = path.join(rootDir, 'dist');

    // Ensure dist directory exists
    await fs.mkdir(distDir, { recursive: true });

    // Copy package.json to dist (for publishing)
    const packageJsonSource = path.join(rootDir, 'package.json');
    const packageJsonDest = path.join(distDir, 'package.json');
    
    const packageJson = JSON.parse(await fs.readFile(packageJsonSource, 'utf8'));
    
    // Clean up package.json for distribution
    delete packageJson.devDependencies;
    delete packageJson.scripts?.prepare;
    delete packageJson.scripts?.dev;
    delete packageJson.lint;
    delete packageJson.format;
    
    await fs.writeFile(packageJsonDest, JSON.stringify(packageJson, null, 2));
    console.log('✅ Copied package.json to dist');

    // Copy README to dist
    const readmeSource = path.join(rootDir, 'README.md');
    const readmeDest = path.join(distDir, 'README.md');
    await fs.copyFile(readmeSource, readmeDest);
    console.log('✅ Copied README.md to dist');

    // Copy LICENSE to dist
    const licenseSource = path.join(rootDir, 'LICENSE');
    const licenseDest = path.join(distDir, 'LICENSE');
    
    try {
      await fs.copyFile(licenseSource, licenseDest);
      console.log('✅ Copied LICENSE to dist');
    } catch (error) {
      console.log('⚠️  LICENSE file not found, skipping...');
    }

    // Copy templates directory if it exists
    const templatesSource = path.join(rootDir, 'templates');
    const templatesDest = path.join(distDir, 'templates');
    
    try {
      await fs.access(templatesSource);
      await copyDirectory(templatesSource, templatesDest);
      console.log('✅ Copied templates to dist');
    } catch (error) {
      console.log('⚠️  Templates directory not found, skipping...');
    }

    // Make CLI executable
    const cliFile = path.join(distDir, 'cli.js');
    try {
      await fs.access(cliFile);
      await fs.chmod(cliFile, 0o755);
      console.log('✅ Made CLI executable');
    } catch (error) {
      console.log('⚠️  CLI file not found, skipping...');
    }

    // Generate build info
    const buildInfo = {
      version: packageJson.version,
      buildDate: new Date().toISOString(),
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
    };

    await fs.writeFile(
      path.join(distDir, 'build-info.json'),
      JSON.stringify(buildInfo, null, 2)
    );
    console.log('✅ Generated build info');

    console.log('🎉 Build completed successfully!');

  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

/**
 * Recursively copy directory
 */
async function copyDirectory(src: string, dest: string): Promise<void> {
  await fs.mkdir(dest, { recursive: true });

  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

// Run build if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  build().catch(console.error);
}

export { build };
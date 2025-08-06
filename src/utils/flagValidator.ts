import { GenerateOptions } from '../types/index.js';
import { logger } from './logger.js';

export function validateFlags(options: GenerateOptions): void {
  const errors: string[] = [];

  // Validate Rails version
  if (options.railsVersion && !/^\d+\.\d+\.\d+$/.test(options.railsVersion)) {
    errors.push(`Invalid Rails version: ${options.railsVersion}. Expected format: x.y.z`);
  }

  // Validate React version
  if (options.reactVersion && !/^\d+\.\d+\.\d+$/.test(options.reactVersion)) {
    errors.push(`Invalid React version: ${options.reactVersion}. Expected format: x.y.z`);
  }

  // Validate database type
  if (options.database && !['postgresql', 'sqlite'].includes(options.database)) {
    errors.push(`Invalid database type: ${options.database}. Must be 'postgresql' or 'sqlite'`);
  }

  // Validate build tool
  if (options.buildTool && !['vite', 'webpack'].includes(options.buildTool)) {
    errors.push(`Invalid build tool: ${options.buildTool}. Must be 'vite' or 'webpack'`);
  }

  // Validate package manager
  if (options.packageManager && !['pnpm', 'npm', 'yarn'].includes(options.packageManager)) {
    errors.push(`Invalid package manager: ${options.packageManager}. Must be 'pnpm', 'npm', or 'yarn'`);
  }

  if (errors.length > 0) {
    logger.error('Invalid command-line options:');
    errors.forEach(error => logger.error(`  - ${error}`));
    logger.info('');
    logger.info('Use --help for more information about available options.');
    process.exit(1);
  }
}

export function showFlagUsage(): void {
  logger.info('Usage examples:');
  logger.info('');
  logger.info('Interactive mode:');
  logger.info('  rails-react-graphql generate');
  logger.info('  rails-react-graphql generate my-app');
  logger.info('');
  logger.info('Non-interactive mode with flags:');
  logger.info('  rails-react-graphql generate my-app --yes');
  logger.info('  rails-react-graphql generate my-app --rails-version 7.1.0 --react-version 18.2.0 --database postgresql');
  logger.info('');
  logger.info('Disable features:');
  logger.info('  rails-react-graphql generate my-app --no-typescript --no-testing --no-docker');
  logger.info('');
  logger.info('Custom configuration:');
  logger.info('  rails-react-graphql generate my-app --build-tool vite --package-manager pnpm');
}

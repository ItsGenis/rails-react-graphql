#!/usr/bin/env node

import { Command } from 'commander';
import { generateProject } from './cli.js';
import { logger } from './utils/logger.js';

const program = new Command();

// Set up the CLI program
program
  .name('rails-react-graphql')
  .description('CLI tool to generate boilerplate Rails React GraphQL projects')
  .version('1.0.0');

// Add the main generate command
program
  .command('generate')
  .alias('g')
  .description('Generate a new Rails React GraphQL project')
  .argument('[project-name]', 'Name of the project to generate')
  .option('-y, --yes', 'Skip interactive prompts and use defaults')
  .option('--rails-version <version>', 'Rails version to use', '7.1.0')
  .option('--react-version <version>', 'React version to use', '18.2.0')
  .option('--database <type>', 'Database type (postgresql, sqlite)', 'postgresql')
  .option('--no-typescript', 'Disable TypeScript support')
  .option('--no-testing', 'Disable testing setup')
  .option('--no-linting', 'Disable linting and formatting')
  .option('--no-authentication', 'Disable authentication boilerplate')
  .option('--no-api-docs', 'Disable API documentation setup')
  .option('--no-git', 'Skip Git repository initialization')
  .option('--no-docker', 'Skip Docker configuration')
  .option('--build-tool <tool>', 'React build tool (vite, webpack)', 'vite')
  .option('--package-manager <manager>', 'Package manager (pnpm, npm, yarn)', 'pnpm')
  .action(async (projectName, options) => {
    try {
      await generateProject(projectName, options);
    } catch (error) {
      logger.error('Failed to generate project:', error);
      process.exit(1);
    }
  });

// Add a help command
program
  .command('help')
  .description('Show detailed help information')
  .action(() => {
    program.help();
  });

// Add a rollback command
program
  .command('rollback')
  .description('Rollback the last project generation')
  .option('--project-path <path>', 'Path to the project to rollback')
  .action(async () => {
    try {
      const { errorHandler } = await import('./utils/errorHandler.js');
      await errorHandler.rollback();
    } catch (error) {
      logger.error('Failed to rollback:', error);
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse();

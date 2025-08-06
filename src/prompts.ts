import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs-extra';
import { ProjectConfig, GenerateOptions } from './types/index.js';
import { logger } from './utils/logger.js';

export async function getProjectConfig(
  projectName?: string,
  options: GenerateOptions = {}
): Promise<ProjectConfig> {

  // If --yes flag is used, use defaults
  if (options.yes) {
    return getDefaultConfig(projectName || 'my-rails-react-app', options);
  }

  // Check if all required options are provided via flags for non-interactive mode
  const hasAllRequiredFlags = projectName &&
    options.railsVersion &&
    options.reactVersion &&
    options.database;

  if (hasAllRequiredFlags) {
    return getConfigFromFlags(projectName, options);
  }

  // Interactive prompts
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is the name of your project?',
      default: projectName || 'my-rails-react-app',
      validate: (input: string) => {
        if (!input.trim()) {
          return 'Project name cannot be empty';
        }
        if (!/^[a-z0-9-]+$/.test(input)) {
          return 'Project name can only contain lowercase letters, numbers, and hyphens';
        }
        if (fs.existsSync(input)) {
          return `Directory "${input}" already exists`;
        }
        return true;
      },
    },
    {
      type: 'list',
      name: 'database',
      message: 'Which database would you like to use?',
      choices: [
        { name: 'PostgreSQL (Recommended)', value: 'postgresql' },
        { name: 'SQLite (Development only)', value: 'sqlite' },
      ],
      default: options.database || 'postgresql',
    },
    {
      type: 'input',
      name: 'railsVersion',
      message: 'What Rails version would you like to use?',
      default: options.railsVersion || '7.1.0',
      validate: (input: string) => {
        if (!/^\d+\.\d+\.\d+$/.test(input)) {
          return 'Please enter a valid version number (e.g., 7.1.0)';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'reactVersion',
      message: 'What React version would you like to use?',
      default: options.reactVersion || '18.2.0',
      validate: (input: string) => {
        if (!/^\d+\.\d+\.\d+$/.test(input)) {
          return 'Please enter a valid version number (e.g., 18.2.0)';
        }
        return true;
      },
    },
    {
      type: 'confirm',
      name: 'typescript',
      message: 'Would you like to use TypeScript?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'testing',
      message: 'Would you like to include testing setup?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'linting',
      message: 'Would you like to include linting and formatting?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'authentication',
      message: 'Would you like to include authentication boilerplate?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'apiDocumentation',
      message: 'Would you like to include API documentation setup?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'git',
      message: 'Would you like to initialize a Git repository?',
      default: options.git !== false,
    },
    {
      type: 'confirm',
      name: 'docker',
      message: 'Would you like to include Docker configuration?',
      default: options.docker !== false,
    },
  ]);

  // Build the complete configuration
  const finalConfig: ProjectConfig = {
    projectName: answers.projectName,
    projectPath: path.resolve(process.cwd(), answers.projectName),
    railsVersion: answers.railsVersion,
    reactVersion: answers.reactVersion,
    database: answers.database,
    typescript: answers.typescript,
    testing: answers.testing,
    linting: answers.linting,
    authentication: answers.authentication,
    apiDocumentation: answers.apiDocumentation,
    git: answers.git,
    docker: answers.docker,
    buildTool: 'vite',
    packageManager: 'pnpm',
  };

  // Show configuration summary
  await showConfigurationSummary(finalConfig);

  // Confirm before proceeding
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Proceed with this configuration?',
      default: true,
    },
  ]);

  if (!confirm) {
    logger.info('Project generation cancelled.');
    process.exit(0);
  }

  return finalConfig;
}

function getDefaultConfig(
  projectName: string,
  options: GenerateOptions
): ProjectConfig {
  return {
    projectName,
    projectPath: path.resolve(process.cwd(), projectName),
    railsVersion: options.railsVersion || '7.1.0',
    reactVersion: options.reactVersion || '18.2.0',
    database: (options.database as 'postgresql' | 'sqlite') || 'postgresql',
    typescript: true,
    testing: true,
    linting: true,
    authentication: true,
    apiDocumentation: true,
    git: options.git !== false,
    docker: options.docker !== false,
    buildTool: 'vite',
    packageManager: 'pnpm',
  };
}

function getConfigFromFlags(
  projectName: string,
  options: GenerateOptions
): ProjectConfig {
  return {
    projectName,
    projectPath: path.resolve(process.cwd(), projectName),
    railsVersion: options.railsVersion || '7.1.0',
    reactVersion: options.reactVersion || '18.2.0',
    database: (options.database as 'postgresql' | 'sqlite') || 'postgresql',
    typescript: options.typescript !== false,
    testing: options.testing !== false,
    linting: options.linting !== false,
    authentication: options.authentication !== false,
    apiDocumentation: options.apiDocs !== false,
    git: options.git !== false,
    docker: options.docker !== false,
    buildTool: 'vite',
    packageManager: 'pnpm',
  };
}

async function showConfigurationSummary(config: ProjectConfig): Promise<void> {
  logger.newline();
  logger.info('📋 Configuration Summary:');
  logger.separator();
  logger.info(`Project Name: ${config.projectName}`);
  logger.info(`Location: ${config.projectPath}`);
  logger.info(`Rails Version: ${config.railsVersion}`);
  logger.info(`React Version: ${config.reactVersion}`);
  logger.info(`Database: ${config.database}`);
  logger.info(`TypeScript: ${config.typescript ? 'Yes' : 'No'}`);
  logger.info(`Testing: ${config.testing ? 'Yes' : 'No'}`);
  logger.info(`Linting: ${config.linting ? 'Yes' : 'No'}`);
  logger.info(`Authentication: ${config.authentication ? 'Yes' : 'No'}`);
  logger.info(`API Documentation: ${config.apiDocumentation ? 'Yes' : 'No'}`);
  logger.info(`Git Repository: ${config.git ? 'Yes' : 'No'}`);
  logger.info(`Docker: ${config.docker ? 'Yes' : 'No'}`);
  logger.separator();
}

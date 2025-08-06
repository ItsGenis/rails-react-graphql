import { logger } from './utils/logger.js';
import { getProjectConfig } from './prompts.js';
import { generateRailsProject } from './generators/rails.js';
import { generateReactProject } from './generators/react.js';
import { setupGraphQL } from './generators/graphql.js';
import { setupDocker } from './generators/docker.js';
import { setupGit } from './generators/git.js';
import { validateFlags } from './utils/flagValidator.js';
import { errorHandler } from './utils/errorHandler.js';
import { ProjectConfig } from './types/index.js';

export interface GenerateOptions {
  yes?: boolean;
  railsVersion?: string;
  reactVersion?: string;
  database?: string;
  typescript?: boolean;
  testing?: boolean;
  linting?: boolean;
  authentication?: boolean;
  apiDocs?: boolean;
  git?: boolean;
  docker?: boolean;
  buildTool?: string;
  packageManager?: string;
}

export async function generateProject(
  projectName?: string,
  options: GenerateOptions = {}
): Promise<void> {
  logger.header('🚀 Rails React GraphQL Project Generator');

  // Validate command-line flags
  validateFlags(options);

    // Get project configuration
  const config: ProjectConfig = await getProjectConfig(projectName, options);

  // Set up error handling and rollback
  errorHandler.setRollbackInfo({
    projectPath: config.projectPath,
    createdFiles: [],
    createdDirectories: [],
    gitInitialized: false,
    timestamp: new Date(),
  });

  // Create backup if project directory exists
  await errorHandler.createBackup(config.projectPath);

  logger.subheader('Project Configuration');
  logger.table({
    'Project Name': config.projectName,
    'Location': config.projectPath,
    'Rails Version': config.railsVersion,
    'React Version': config.reactVersion,
    'Database': config.database,
    'TypeScript': config.typescript ? 'Yes' : 'No',
    'Testing': config.testing ? 'Yes' : 'No',
    'Docker': config.docker ? 'Yes' : 'No',
    'Git': config.git ? 'Yes' : 'No',
  });

  // Define progress steps
  const progressSteps = [
    'Generating Rails backend',
    'Generating React frontend',
    'Setting up GraphQL integration',
    ...(config.docker ? ['Setting up Docker configuration'] : []),
    ...(config.git ? ['Initializing Git repository'] : []),
    'Finalizing project setup'
  ];

  logger.startProgress(progressSteps);

  try {
    // Generate Rails backend
    logger.nextStep('Creating Rails API application');
    await generateRailsProject(config);

    // Generate React frontend
    logger.nextStep('Setting up React with TypeScript');
    await generateReactProject(config);

    // Setup GraphQL integration
    logger.nextStep('Configuring GraphQL server and client');
    await setupGraphQL(config);

    // Setup Docker configuration
    if (config.docker) {
      logger.nextStep('Creating Docker and Docker Compose files');
      await setupDocker(config);
    }

    // Setup Git repository
    if (config.git) {
      logger.nextStep('Initializing Git repository with initial commit');
      await setupGit(config);
    }

    // Final step
    logger.nextStep('Project generation completed successfully');

    // Show completion message
    logger.success('🎉 Your Rails React GraphQL project is ready!');
    logger.newline();

    logger.subheader('Next Steps');
    logger.list([
      `cd ${config.projectName}`,
      'pnpm install',
      'pnpm dev'
    ]);

    logger.newline();
    logger.subheader('Access Points');
    logger.table({
      'Rails API': 'http://localhost:3000',
      'React App': 'http://localhost:5173',
      'GraphQL Playground': 'http://localhost:3000/graphiql'
    });

  } catch (error) {
    logger.failStep(`Error: ${error instanceof Error ? error.message : String(error)}`);
    errorHandler.handleError(error, 'project generation');
  } finally {
    // Clean up backup on successful completion
    await errorHandler.cleanupBackup();
  }
}

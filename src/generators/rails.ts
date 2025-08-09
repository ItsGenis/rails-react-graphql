import { ProjectConfig } from '../types/index.js';
import { logger } from '../utils/logger.js';
import { fileTracker } from '../utils/fileTracker.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createRailsDirectoryStructure(backendPath: string): Promise<void> {
  // Create Rails directory structure
  const directories = [
    'app/controllers',
    'app/models',
    'app/views',
    'app/graphql/types',
    'app/graphql/queries',
    'app/graphql/mutations',
    'app/controllers/concerns',
    'config/initializers',
    'config/environments',
    'db/migrate',
    'lib/tasks',
    'spec/requests',
    'spec/graphql/queries',
    'spec/graphql/mutations',
    'spec/support',
    'spec/requests/api',
    'swagger/v1',
    'sorbet/rbi',
    'bin',
    'log',
    'tmp/pids',
    'tmp/cache',
    'tmp/sockets',
    'storage',
    'public'
  ];

  for (const dir of directories) {
    await fs.ensureDir(path.join(backendPath, dir));
  }

  // Create .keep files for empty directories
  const keepDirs = ['log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'storage', 'public'];
  for (const dir of keepDirs) {
    await fs.writeFile(path.join(backendPath, dir, '.keep'), '');
  }
}

async function setExecutablePermissions(backendPath: string): Promise<void> {
  // Set executable permissions for bin files
  const binFiles = ['rails', 'rake', 'setup', 'bundle'];

  for (const file of binFiles) {
    const filePath = path.join(backendPath, 'bin', file);
    if (await fs.pathExists(filePath)) {
      await fs.chmod(filePath, 0o755);
    }
  }
}

export async function generateRailsProject(config: ProjectConfig): Promise<void> {
  const backendPath = path.join(config.projectPath, 'backend');

  try {
    // Create backend directory
    await fs.ensureDir(backendPath);
    fileTracker.trackDirectory(backendPath);

    // Change to backend directory
    process.chdir(backendPath);

    logger.info('Creating Rails API application structure...');

    // Create Rails directory structure manually
    await createRailsDirectoryStructure(backendPath);

    // Copy all template files
    await copyTemplateFiles(config, backendPath);

    // Set executable permissions for bin files
    await setExecutablePermissions(backendPath);

    logger.success('Rails backend generated successfully!');

  } catch (error) {
    logger.error('Failed to generate Rails project:', error);
    throw error;
  }
}

async function copyTestFiles(config: ProjectConfig, backendPath: string, templateDir: string): Promise<void> {
  // Copy RSpec configuration
  const rspecContent = await fs.readFile(path.join(templateDir, '.rspec'), 'utf-8');
  await fs.writeFile(path.join(backendPath, '.rspec'), rspecContent);

  // Copy spec_helper.rb
  const specHelperContent = await fs.readFile(path.join(templateDir, 'spec', 'spec_helper.rb'), 'utf-8');
  const processedSpecHelper = processTemplate(specHelperContent, config);
  await fs.ensureDir(path.join(backendPath, 'spec'));
  await fs.writeFile(path.join(backendPath, 'spec', 'spec_helper.rb'), processedSpecHelper);

  // Copy support files
  const supportDir = path.join(backendPath, 'spec', 'support');
  await fs.ensureDir(supportDir);

  const supportFiles = [
    'factory_bot.rb',
    'graphql_test_helpers.rb',
    'database_cleaner.rb'
  ];

  for (const file of supportFiles) {
    const content = await fs.readFile(path.join(templateDir, 'spec', 'support', file), 'utf-8');
    const processedContent = processTemplate(content, config);
    await fs.writeFile(path.join(supportDir, file), processedContent);
  }

  // Copy request specs
  const requestsDir = path.join(backendPath, 'spec', 'requests');
  await fs.ensureDir(requestsDir);

  const requestSpecs = [
    'application_spec.rb',
    'graphql_spec.rb'
  ];

  for (const file of requestSpecs) {
    const content = await fs.readFile(path.join(templateDir, 'spec', 'requests', file), 'utf-8');
    const processedContent = processTemplate(content, config);
    await fs.writeFile(path.join(requestsDir, file), processedContent);
  }

  // Copy GraphQL specs
  const graphqlSpecsDir = path.join(backendPath, 'spec', 'graphql');
  await fs.ensureDir(graphqlSpecsDir);

  const graphqlSpecs = [
    'queries/users_spec.rb',
    'mutations/create_user_spec.rb'
  ];

  for (const file of graphqlSpecs) {
    const content = await fs.readFile(path.join(templateDir, 'spec', 'graphql', file), 'utf-8');
    const processedContent = processTemplate(content, config);
    const filePath = path.join(graphqlSpecsDir, file);
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, processedContent);
  }
}

async function copyRuboCopFiles(config: ProjectConfig, backendPath: string, templateDir: string): Promise<void> {
  // Copy main RuboCop configuration
  const rubocopContent = await fs.readFile(path.join(templateDir, '.rubocop.yml'), 'utf-8');
  await fs.writeFile(path.join(backendPath, '.rubocop.yml'), rubocopContent);

  // Copy GraphQL-specific RuboCop configuration
  const rubocopGraphqlContent = await fs.readFile(path.join(templateDir, '.rubocop_graphql.yml'), 'utf-8');
  await fs.writeFile(path.join(backendPath, '.rubocop_graphql.yml'), rubocopGraphqlContent);

  // Copy RuboCop Rake tasks
  const rubocopRakeContent = await fs.readFile(path.join(templateDir, 'lib', 'tasks', 'rubocop.rake'), 'utf-8');
  const processedRubocopRake = processTemplate(rubocopRakeContent, config);
  await fs.ensureDir(path.join(backendPath, 'lib', 'tasks'));
  await fs.writeFile(path.join(backendPath, 'lib', 'tasks', 'rubocop.rake'), processedRubocopRake);

  // Copy RuboCop documentation
  const rubocopReadmeContent = await fs.readFile(path.join(templateDir, 'README_RUBOCOP.md'), 'utf-8');
  const processedRubocopReadme = processTemplate(rubocopReadmeContent, config);
  await fs.writeFile(path.join(backendPath, 'README_RUBOCOP.md'), processedRubocopReadme);
}

async function copySorbetFiles(config: ProjectConfig, backendPath: string, templateDir: string): Promise<void> {
  // Copy Sorbet configuration
  const sorbetConfigContent = await fs.readFile(path.join(templateDir, 'sorbet', 'config'), 'utf-8');
  await fs.ensureDir(path.join(backendPath, 'sorbet'));
  await fs.writeFile(path.join(backendPath, 'sorbet', 'config'), sorbetConfigContent);

  // Copy Sorbet RBI files
  const rbiDir = path.join(backendPath, 'sorbet', 'rbi');
  await fs.ensureDir(rbiDir);

  const rbiFiles = [
    'gems.rbi',
    'app.rbi'
  ];

  for (const file of rbiFiles) {
    const content = await fs.readFile(path.join(templateDir, 'sorbet', 'rbi', file), 'utf-8');
    await fs.writeFile(path.join(rbiDir, file), content);
  }

  // Copy Sorbet Rake tasks
  const sorbetRakeContent = await fs.readFile(path.join(templateDir, 'lib', 'tasks', 'sorbet.rake'), 'utf-8');
  const processedSorbetRake = processTemplate(sorbetRakeContent, config);
  await fs.writeFile(path.join(backendPath, 'lib', 'tasks', 'sorbet.rake'), processedSorbetRake);
}

async function copyAuthFiles(config: ProjectConfig, backendPath: string, templateDir: string): Promise<void> {
  // Copy User model
  const userModelContent = await fs.readFile(path.join(templateDir, 'app', 'models', 'user.rb'), 'utf-8');
  const processedUserModel = processTemplate(userModelContent, config);
  await fs.ensureDir(path.join(backendPath, 'app', 'models'));
  await fs.writeFile(path.join(backendPath, 'app', 'models', 'user.rb'), processedUserModel);

  // Copy Auth controller
  const authControllerContent = await fs.readFile(path.join(templateDir, 'app', 'controllers', 'auth_controller.rb'), 'utf-8');
  const processedAuthController = processTemplate(authControllerContent, config);
  await fs.writeFile(path.join(backendPath, 'app', 'controllers', 'auth_controller.rb'), processedAuthController);

  // Copy JWT concern
  const jwtConcernContent = await fs.readFile(path.join(templateDir, 'app', 'controllers', 'concerns', 'jwt_authenticatable.rb'), 'utf-8');
  const processedJwtConcern = processTemplate(jwtConcernContent, config);
  await fs.ensureDir(path.join(backendPath, 'app', 'controllers', 'concerns'));
  await fs.writeFile(path.join(backendPath, 'app', 'controllers', 'concerns', 'jwt_authenticatable.rb'), processedJwtConcern);

  // Copy User migration
  const userMigrationContent = await fs.readFile(path.join(templateDir, 'db', 'migrate', '001_create_users.rb'), 'utf-8');
  const processedUserMigration = processTemplate(userMigrationContent, config);
  await fs.ensureDir(path.join(backendPath, 'db', 'migrate'));
  await fs.writeFile(path.join(backendPath, 'db', 'migrate', '001_create_users.rb'), processedUserMigration);
}

async function copyApiDocsFiles(config: ProjectConfig, backendPath: string, templateDir: string): Promise<void> {
  // Copy Rswag initializer
  const rswagInitContent = await fs.readFile(path.join(templateDir, 'config', 'initializers', 'rswag_api.rb'), 'utf-8');
  const processedRswagInit = processTemplate(rswagInitContent, config);
  await fs.writeFile(path.join(backendPath, 'config', 'initializers', 'rswag_api.rb'), processedRswagInit);

  // Copy Swagger specification
  const swaggerContent = await fs.readFile(path.join(templateDir, 'swagger', 'v1', 'swagger.yaml'), 'utf-8');
  const processedSwagger = processTemplate(swaggerContent, config);
  await fs.ensureDir(path.join(backendPath, 'swagger', 'v1'));
  await fs.writeFile(path.join(backendPath, 'swagger', 'v1', 'swagger.yaml'), processedSwagger);

  // Copy Swagger helper
  const swaggerHelperContent = await fs.readFile(path.join(templateDir, 'spec', 'swagger_helper.rb'), 'utf-8');
  const processedSwaggerHelper = processTemplate(swaggerHelperContent, config);
  await fs.writeFile(path.join(backendPath, 'spec', 'swagger_helper.rb'), processedSwaggerHelper);

  // Copy API specs
  const apiSpecsContent = await fs.readFile(path.join(templateDir, 'spec', 'requests', 'api', 'auth_spec.rb'), 'utf-8');
  const processedApiSpecs = processTemplate(apiSpecsContent, config);
  await fs.ensureDir(path.join(backendPath, 'spec', 'requests', 'api'));
  await fs.writeFile(path.join(backendPath, 'spec', 'requests', 'api', 'auth_spec.rb'), processedApiSpecs);

  // Copy Swagger Rake tasks
  const swaggerRakeContent = await fs.readFile(path.join(templateDir, 'lib', 'tasks', 'swagger.rake'), 'utf-8');
  const processedSwaggerRake = processTemplate(swaggerRakeContent, config);
  await fs.writeFile(path.join(backendPath, 'lib', 'tasks', 'swagger.rake'), processedSwaggerRake);
}

async function copyEnvironmentFiles(config: ProjectConfig, backendPath: string, templateDir: string): Promise<void> {
  // Copy application configuration
  const appConfigContent = await fs.readFile(path.join(templateDir, 'config', 'application.yml'), 'utf-8');
  const processedAppConfig = processTemplate(appConfigContent, config);
  await fs.writeFile(path.join(backendPath, 'config', 'application.yml'), processedAppConfig);

  // Copy configuration initializers
  const appConfigInitContent = await fs.readFile(path.join(templateDir, 'config', 'initializers', 'app_config.rb'), 'utf-8');
  const processedAppConfigInit = processTemplate(appConfigInitContent, config);
  await fs.writeFile(path.join(backendPath, 'config', 'initializers', 'app_config.rb'), processedAppConfigInit);

  const secretsInitContent = await fs.readFile(path.join(templateDir, 'config', 'initializers', 'secrets.rb'), 'utf-8');
  const processedSecretsInit = processTemplate(secretsInitContent, config);
  await fs.writeFile(path.join(backendPath, 'config', 'initializers', 'secrets.rb'), processedSecretsInit);

  // Copy environment setup script
  const envSetupContent = await fs.readFile(path.join(templateDir, 'bin', 'setup-environment'), 'utf-8');
  const processedEnvSetup = processTemplate(envSetupContent, config);
  await fs.writeFile(path.join(backendPath, 'bin', 'setup-environment'), processedEnvSetup);
  await fs.chmod(path.join(backendPath, 'bin', 'setup-environment'), 0o755); // Make executable

  // Copy environment documentation
  const envReadmeContent = await fs.readFile(path.join(templateDir, 'README_ENVIRONMENT.md'), 'utf-8');
  const processedEnvReadme = processTemplate(envReadmeContent, config);
  await fs.writeFile(path.join(backendPath, 'README_ENVIRONMENT.md'), processedEnvReadme);
}

async function copyDockerFiles(config: ProjectConfig, backendPath: string, templateDir: string): Promise<void> {
  // Copy Dockerfile
  const dockerfileContent = await fs.readFile(path.join(templateDir, 'Dockerfile'), 'utf-8');
  const processedDockerfile = processTemplate(dockerfileContent, config);
  await fs.writeFile(path.join(backendPath, 'Dockerfile'), processedDockerfile);

  // Copy docker-compose.yml
  const dockerComposeContent = await fs.readFile(path.join(templateDir, 'docker-compose.yml'), 'utf-8');
  const processedDockerCompose = processTemplate(dockerComposeContent, config);
  await fs.writeFile(path.join(backendPath, 'docker-compose.yml'), processedDockerCompose);

  // Copy docker-compose.override.yml
  const dockerComposeOverrideContent = await fs.readFile(path.join(templateDir, 'docker-compose.override.yml'), 'utf-8');
  const processedDockerComposeOverride = processTemplate(dockerComposeOverrideContent, config);
  await fs.writeFile(path.join(backendPath, 'docker-compose.override.yml'), processedDockerComposeOverride);

  // Copy .dockerignore
  const dockerignoreContent = await fs.readFile(path.join(templateDir, '.dockerignore'), 'utf-8');
  const processedDockerignore = processTemplate(dockerignoreContent, config);
  await fs.writeFile(path.join(backendPath, '.dockerignore'), processedDockerignore);
}

async function copyTemplateFiles(config: ProjectConfig, backendPath: string): Promise<void> {
  const templateDir = path.join(__dirname, '..', '..', 'src', 'templates', 'rails');

  // Copy core Rails files
  const coreFiles = [
    'Rakefile',
    'config.ru',
    'config/boot.rb',
    'config/environment.rb',
    '.gitignore'
  ];

  for (const file of coreFiles) {
    const content = await fs.readFile(path.join(templateDir, file), 'utf-8');
    const processedContent = processTemplate(content, config);
    await fs.ensureDir(path.dirname(path.join(backendPath, file)));
    await fs.writeFile(path.join(backendPath, file), processedContent);
  }

  // Copy bin executables
  const binFiles = ['rails', 'rake', 'setup', 'bundle'];
  for (const file of binFiles) {
    const content = await fs.readFile(path.join(templateDir, 'bin', file), 'utf-8');
    const processedContent = processTemplate(content, config);
    await fs.writeFile(path.join(backendPath, 'bin', file), processedContent);
  }

  // Copy additional initializers
  const additionalInitializers = [
    'application_controller_renderer.rb',
    'content_security_policy.rb'
  ];

  for (const file of additionalInitializers) {
    const filePath = path.join(templateDir, 'config', 'initializers', file);
    if (await fs.pathExists(filePath)) {
      const content = await fs.readFile(filePath, 'utf-8');
      const processedContent = processTemplate(content, config);
      await fs.writeFile(path.join(backendPath, 'config', 'initializers', file), processedContent);
    }
  }

  // Copy Gemfile
  const gemfileContent = await fs.readFile(path.join(templateDir, 'Gemfile'), 'utf-8');
  const processedGemfile = processTemplate(gemfileContent, config);
  await fs.writeFile(path.join(backendPath, 'Gemfile'), processedGemfile);

  // Copy application.rb
  const appConfigContent = await fs.readFile(path.join(templateDir, 'config', 'application.rb'), 'utf-8');
  const processedAppConfig = processTemplate(appConfigContent, config);
  await fs.ensureDir(path.join(backendPath, 'config'));
  await fs.writeFile(path.join(backendPath, 'config', 'application.rb'), processedAppConfig);

  // Copy database.yml
  const dbConfigContent = await fs.readFile(path.join(templateDir, 'config', 'database.yml'), 'utf-8');
  const processedDbConfig = processTemplate(dbConfigContent, config);
  await fs.writeFile(path.join(backendPath, 'config', 'database.yml'), processedDbConfig);

  // Copy GraphQL files
  await copyGraphQLFiles(config, backendPath, templateDir);

  // Copy GraphQL initializer
  const graphqlInitContent = await fs.readFile(path.join(templateDir, 'config', 'initializers', 'graphql.rb'), 'utf-8');
  const processedGraphqlInit = processTemplate(graphqlInitContent, config);
  await fs.ensureDir(path.join(backendPath, 'config', 'initializers'));
  await fs.writeFile(path.join(backendPath, 'config', 'initializers', 'graphql.rb'), processedGraphqlInit);

  // Copy database initializer
  const dbInitContent = await fs.readFile(path.join(templateDir, 'config', 'initializers', 'database.rb'), 'utf-8');
  const processedDbInit = processTemplate(dbInitContent, config);
  await fs.writeFile(path.join(backendPath, 'config', 'initializers', 'database.rb'), processedDbInit);

  // Copy environment example file
  const envExampleContent = await fs.readFile(path.join(templateDir, 'config', 'env.example'), 'utf-8');
  const processedEnvExample = processTemplate(envExampleContent, config);
  await fs.writeFile(path.join(backendPath, 'config', 'env.example'), processedEnvExample);

  // Copy database setup script
  const dbSetupContent = await fs.readFile(path.join(templateDir, 'bin', 'setup-database'), 'utf-8');
  const processedDbSetup = processTemplate(dbSetupContent, config);
  await fs.ensureDir(path.join(backendPath, 'bin'));
  await fs.writeFile(path.join(backendPath, 'bin', 'setup-database'), processedDbSetup);
  await fs.chmod(path.join(backendPath, 'bin', 'setup-database'), 0o755); // Make executable

  // Copy database README
  const dbReadmeContent = await fs.readFile(path.join(templateDir, 'README_DATABASE.md'), 'utf-8');
  const processedDbReadme = processTemplate(dbReadmeContent, config);
  await fs.writeFile(path.join(backendPath, 'README_DATABASE.md'), processedDbReadme);

  // Copy RSpec configuration and test files
  await copyTestFiles(config, backendPath, templateDir);

  // Copy testing README
  const testReadmeContent = await fs.readFile(path.join(templateDir, 'README_TESTING.md'), 'utf-8');
  const processedTestReadme = processTemplate(testReadmeContent, config);
  await fs.writeFile(path.join(backendPath, 'README_TESTING.md'), processedTestReadme);

  // Copy RuboCop configuration and documentation
  await copyRuboCopFiles(config, backendPath, templateDir);

  // Copy Sorbet configuration and files
  await copySorbetFiles(config, backendPath, templateDir);

  // Copy authentication files
  await copyAuthFiles(config, backendPath, templateDir);

  // Copy API documentation files
  await copyApiDocsFiles(config, backendPath, templateDir);

  // Copy environment management files
  await copyEnvironmentFiles(config, backendPath, templateDir);

  // Copy Docker files
  await copyDockerFiles(config, backendPath, templateDir);

  // Copy routes.rb
  const routesContent = await fs.readFile(path.join(templateDir, 'config', 'routes.rb'), 'utf-8');
  const processedRoutes = processTemplate(routesContent, config);
  await fs.writeFile(path.join(backendPath, 'config', 'routes.rb'), processedRoutes);

  // Copy application_controller.rb
  const controllerContent = await fs.readFile(path.join(templateDir, 'app', 'controllers', 'application_controller.rb'), 'utf-8');
  const processedController = processTemplate(controllerContent, config);
  await fs.ensureDir(path.join(backendPath, 'app', 'controllers'));
  await fs.writeFile(path.join(backendPath, 'app', 'controllers', 'application_controller.rb'), processedController);

  // Copy graphql_controller.rb
  const graphqlControllerContent = await fs.readFile(path.join(templateDir, 'app', 'controllers', 'graphql_controller.rb'), 'utf-8');
  const processedGraphqlController = processTemplate(graphqlControllerContent, config);
  await fs.writeFile(path.join(backendPath, 'app', 'controllers', 'graphql_controller.rb'), processedGraphqlController);
}

async function copyGraphQLFiles(config: ProjectConfig, backendPath: string, templateDir: string): Promise<void> {
  const graphqlDir = path.join(backendPath, 'app', 'graphql');
  await fs.ensureDir(graphqlDir);

  // Copy schema file
  const schemaContent = await fs.readFile(path.join(templateDir, 'app', 'graphql', '<%= appName %>_schema.rb'), 'utf-8');
  const processedSchema = processTemplate(schemaContent, config);
  // Use camelCase app name for the file name to avoid Ruby constant issues
  const appName = config.projectName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  await fs.writeFile(path.join(graphqlDir, `${appName}_schema.rb`), processedSchema);

  // Copy types directory
  const typesDir = path.join(graphqlDir, 'types');
  await fs.ensureDir(typesDir);

  const typeFiles = [
    'base_object.rb',
    'base_field.rb',
    'base_argument.rb',
    'base_input_object.rb',
    'base_enum.rb',
    'base_scalar.rb',
    'query_type.rb',
    'mutation_type.rb',
    'user_type.rb'
  ];

  for (const file of typeFiles) {
    const content = await fs.readFile(path.join(templateDir, 'app', 'graphql', 'types', file), 'utf-8');
    const processedContent = processTemplate(content, config);
    await fs.writeFile(path.join(typesDir, file), processedContent);
  }

  // Copy queries directory
  const queriesDir = path.join(graphqlDir, 'queries');
  await fs.ensureDir(queriesDir);

  const queryFiles = [
    'base_query.rb',
    'users.rb'
  ];

  for (const file of queryFiles) {
    const content = await fs.readFile(path.join(templateDir, 'app', 'graphql', 'queries', file), 'utf-8');
    const processedContent = processTemplate(content, config);
    await fs.writeFile(path.join(queriesDir, file), processedContent);
  }

  // Copy mutations directory
  const mutationsDir = path.join(graphqlDir, 'mutations');
  await fs.ensureDir(mutationsDir);

  const mutationFiles = [
    'base_mutation.rb',
    'create_user.rb'
  ];

  for (const file of mutationFiles) {
    const content = await fs.readFile(path.join(templateDir, 'app', 'graphql', 'mutations', file), 'utf-8');
    const processedContent = processTemplate(content, config);
    await fs.writeFile(path.join(mutationsDir, file), processedContent);
  }
}

function processTemplate(content: string, config: ProjectConfig): string {
  // Convert project name to valid Ruby module name (camelCase, no hyphens)
  const appName = config.projectName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  const rubyVersion = '3.2.2';
  const databaseAdapter = config.database === 'postgresql' ? 'postgresql' : 'sqlite3';

  return content
    .replace(/<%= appName %>/g, appName)
    .replace(/<%= railsVersion %>/g, config.railsVersion)
    .replace(/<%= rubyVersion %>/g, rubyVersion)
    .replace(/<%= databaseAdapter %>/g, databaseAdapter)
    .replace(/<%= authentication %>/g, config.authentication.toString())
    .replace(/<%= apiDocumentation %>/g, config.apiDocumentation.toString())
    .replace(/<%= linting %>/g, config.linting.toString())
    .replace(/<%= typeChecking %>/g, 'true') // Always enable type checking for Rails
    // Handle conditional gems
    .replace(/<%= AUTHENTICATION_GEMS %>/g,
      config.authentication ? 'gem "bcrypt", "~> 3.1.7"\ngem "jwt", "~> 2.2"' : '')
    .replace(/<%= API_DOCS_GEMS %>/g,
      config.apiDocumentation ? 'gem "rswag-api"\ngem "rswag-ui"' : '')
    .replace(/<%= LINTING_GEMS %>/g,
      config.linting ? 'gem "rubocop", require: false\ngem "rubocop-rails", require: false\ngem "rubocop-rspec", require: false' : '')
    .replace(/<%= TYPE_CHECKING_GEMS %>/g,
      'gem "sorbet", group: :development\ngem "sorbet-rails", group: :development\ngem "tapioca", require: false, group: :development') // Always enable type checking
    // Handle conditional API documentation routes
    .replace(/<%= API_DOCS_ROUTES %>/g,
      config.apiDocumentation ? '# API Documentation\n  mount Rswag::Ui::Engine => \'/api-docs\'\n  mount Rswag::Api::Engine => \'/api-docs\'' : '')
    // Handle conditional API documentation endpoint
    .replace(/<%= API_DOCS_ENDPOINT %>/g,
      config.apiDocumentation ? 'docs: "/api-docs",' : '');
}

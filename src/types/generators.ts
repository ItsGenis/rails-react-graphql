// Generator-related type definitions

export interface GeneratorContext {
  projectConfig: ProjectConfig;
  templateData: TemplateData;
  logger: LoggerInterface;
  fileTracker: FileTracker;
}

export interface GeneratorStep {
  name: string;
  description: string;
  execute(context: GeneratorContext): Promise<void>;
  rollback?(context: GeneratorContext): Promise<void>;
  validate?(context: GeneratorContext): Promise<ValidationError[]>;
}

export interface Generator {
  name: string;
  version: string;
  description: string;
  steps: GeneratorStep[];
  dependencies: string[];
  validate(config: ProjectConfig): Promise<ValidationError[]>;
  generate(config: ProjectConfig): Promise<void>;
  rollback(config: ProjectConfig): Promise<void>;
}

export interface RailsGenerator extends Generator {
  gems: string[];
  migrations: string[];
  models: string[];
  controllers: string[];
  routes: string[];
}

export interface ReactGenerator extends Generator {
  packages: string[];
  components: string[];
  pages: string[];
  hooks: string[];
  types: string[];
}

export interface GraphQLGenerator extends Generator {
  schema: string;
  resolvers: string[];
  types: string[];
  mutations: string[];
  queries: string[];
}

export interface DockerGenerator extends Generator {
  services: string[];
  volumes: string[];
  networks: string[];
  environment: Record<string, string>;
}

export interface GitGenerator extends Generator {
  hooks: string[];
  ignoreFiles: string[];
  commitMessage: string;
  branch: string;
}

// Template system types
export interface Template {
  name: string;
  description: string;
  version: string;
  files: TemplateFile[];
  variables: TemplateVariable[];
  dependencies: string[];
}

export interface TemplateFile {
  path: string;
  content: string;
  template: boolean;
  executable?: boolean;
  overwrite?: boolean;
}

export interface TemplateVariable {
  name: string;
  description: string;
  type: 'string' | 'boolean' | 'number' | 'select';
  required: boolean;
  default?: any;
  options?: string[];
  validation?: RegExp | ((value: any) => boolean);
}

// File system operations
export interface FileOperation {
  type: 'create' | 'update' | 'delete' | 'copy' | 'move';
  path: string;
  content?: string;
  template?: string;
  data?: Record<string, any>;
  permissions?: number;
}

export interface FileTracker {
  trackFile(filePath: string): void;
  trackDirectory(dirPath: string): void;
  getCreatedFiles(): string[];
  getCreatedDirectories(): string[];
  updateRollbackInfo(): void;
  clear(): void;
}

// Process execution
export interface ProcessOptions {
  cwd?: string;
  env?: Record<string, string>;
  timeout?: number;
  silent?: boolean;
  stdio?: 'pipe' | 'inherit' | 'ignore';
}

export interface ProcessResult {
  success: boolean;
  stdout: string;
  stderr: string;
  exitCode: number;
  duration: number;
  command: string;
  options: ProcessOptions;
}

// Package manager operations
export interface PackageManager {
  name: 'pnpm' | 'npm' | 'yarn';
  install(packages: string[], options?: Record<string, any>): Promise<ProcessResult>;
  add(pkg: string, options?: Record<string, any>): Promise<ProcessResult>;
  remove(pkg: string, options?: Record<string, any>): Promise<ProcessResult>;
  run(script: string, options?: Record<string, any>): Promise<ProcessResult>;
  init(options?: Record<string, any>): Promise<ProcessResult>;
}

// Validation and configuration
export interface ConfigValidator {
  validate(config: ProjectConfig): Promise<ValidationError[]>;
  validateRailsConfig(config: RailsConfig): Promise<ValidationError[]>;
  validateReactConfig(config: ReactConfig): Promise<ValidationError[]>;
  validateGraphQLConfig(config: GraphQLConfig): Promise<ValidationError[]>;
  validateDockerConfig(config: DockerConfig): Promise<ValidationError[]>;
  validateGitConfig(config: GitConfig): Promise<ValidationError[]>;
}

// Import the base types
import {
  ProjectConfig,
  TemplateData,
  LoggerInterface,
  ValidationError,
  RailsConfig,
  ReactConfig,
  GraphQLConfig,
  DockerConfig,
  GitConfig
} from './index.js';

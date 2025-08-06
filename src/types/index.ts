// Core project configuration interfaces
export interface ProjectConfig {
  projectName: string;
  projectPath: string;
  railsVersion: string;
  reactVersion: string;
  database: 'postgresql' | 'sqlite';
  git: boolean;
  docker: boolean;
  typescript: boolean;
  testing: boolean;
  linting: boolean;
  apiDocumentation: boolean;
  authentication: boolean;
  buildTool: 'vite' | 'webpack';
  packageManager: 'pnpm' | 'npm' | 'yarn';
}

// Rails-specific configuration
export interface RailsConfig {
  version: string;
  apiOnly: boolean;
  database: string;
  graphql: boolean;
  testing: boolean;
  linting: boolean;
  typeChecking: boolean;
  authentication: boolean;
  documentation: boolean;
  gems: string[];
  environment: 'development' | 'test' | 'production';
}

// React-specific configuration
export interface ReactConfig {
  version: string;
  typescript: boolean;
  graphql: boolean;
  testing: boolean;
  linting: boolean;
  buildTool: 'vite' | 'webpack';
  packageManager: 'pnpm' | 'npm' | 'yarn';
  componentLibrary: boolean;
  routing: boolean;
  stateManagement: 'none' | 'context' | 'redux' | 'zustand';
}

// GraphQL configuration
export interface GraphQLConfig {
  server: boolean;
  client: boolean;
  codeGeneration: boolean;
  playground: boolean;
  schema: string;
  authentication: boolean;
  subscriptions: boolean;
}

// Docker configuration
export interface DockerConfig {
  enabled: boolean;
  multiStage: boolean;
  development: boolean;
  production: boolean;
  database: boolean;
  volumes: string[];
  ports: Record<string, number>;
}

// Git configuration
export interface GitConfig {
  enabled: boolean;
  initialCommit: boolean;
  conventionalCommits: boolean;
  ignoreFiles: string[];
  hooks: boolean;
  branch: string;
}

// Generator result interface
export interface GeneratorResult {
  success: boolean;
  message: string;
  filesCreated: string[];
  directoriesCreated: string[];
  errors?: string[];
  warnings?: string[];
  duration?: number;
}

// Template data interface
export interface TemplateData {
  projectName: string;
  projectPath: string;
  railsVersion: string;
  reactVersion: string;
  database: string;
  typescript: boolean;
  testing: boolean;
  linting: boolean;
  authentication: boolean;
  apiDocumentation: boolean;
  git: boolean;
  docker: boolean;
  buildTool: string;
  packageManager: string;
  timestamp: string;
  [key: string]: any;
}

// CLI command options
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

// File system operations
export interface FileOperation {
  type: 'create' | 'update' | 'delete' | 'copy';
  path: string;
  content?: string;
  template?: string;
  data?: Record<string, any>;
}

// Template engine interface
export interface TemplateEngine {
  render(template: string, data: TemplateData): string;
  renderFile(filePath: string, data: TemplateData): Promise<string>;
  validateTemplate(template: string): boolean;
}

// Logger interface
export interface LoggerInterface {
  info(message: string, ...args: any[]): void;
  success(message: string, ...args: any[]): void;
  warning(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;
  startSpinner(text: string): void;
  stopSpinner(success?: boolean): void;
  updateSpinner(text: string): void;
  startProgress(steps: string[]): void;
  nextStep(message?: string): void;
  failStep(message?: string): void;
}

// Error types
export interface CLIError extends Error {
  code: string;
  context?: string;
  suggestions?: string[];
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// Process management
export interface ProcessResult {
  success: boolean;
  stdout: string;
  stderr: string;
  exitCode: number;
  duration: number;
}

// Package manager interface
export interface PackageManager {
  name: 'pnpm' | 'npm' | 'yarn';
  install(packages: string[], options?: Record<string, any>): Promise<ProcessResult>;
  add(pkg: string, options?: Record<string, any>): Promise<ProcessResult>;
  remove(pkg: string, options?: Record<string, any>): Promise<ProcessResult>;
  run(script: string, options?: Record<string, any>): Promise<ProcessResult>;
}

// Version management
export interface VersionInfo {
  current: string;
  latest: string;
  needsUpdate: boolean;
  updateAvailable: boolean;
}

// Configuration validation
export interface ConfigValidation {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

// Event system
export interface CLIEvent {
  type: string;
  data: any;
  timestamp: Date;
}

export interface EventHandler {
  (event: CLIEvent): void | Promise<void>;
}

// Plugin system (for future extensibility)
export interface Plugin {
  name: string;
  version: string;
  description: string;
  hooks: Record<string, EventHandler>;
  install(): Promise<void>;
  uninstall(): Promise<void>;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Re-export from other type files
export * from './errors';
export * from './generators';

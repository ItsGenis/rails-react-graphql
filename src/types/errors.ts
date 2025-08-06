// Error-related type definitions

export interface CLIError extends Error {
  code: string;
  context?: string;
  suggestions?: string[];
  isOperational?: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
  severity: 'error' | 'warning' | 'info';
}

export interface RollbackError extends CLIError {
  rollbackInfo?: {
    projectPath: string;
    createdFiles: string[];
    createdDirectories: string[];
  };
}

export interface GeneratorError extends CLIError {
  generator: string;
  step: string;
  recoverable: boolean;
}

export interface NetworkError extends CLIError {
  url?: string;
  statusCode?: number;
  retryable: boolean;
}

export interface FileSystemError extends CLIError {
  path: string;
  operation: 'read' | 'write' | 'delete' | 'copy' | 'move';
  exists: boolean;
}

// Error codes
export enum ErrorCodes {
  // General errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  VALIDATION_FAILED = 'VALIDATION_FAILED',

  // File system errors
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  DISK_FULL = 'DISK_FULL',
  FILE_EXISTS = 'FILE_EXISTS',

  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  RATE_LIMITED = 'RATE_LIMITED',

  // Generator errors
  GENERATOR_FAILED = 'GENERATOR_FAILED',
  TEMPLATE_NOT_FOUND = 'TEMPLATE_NOT_FOUND',
  INVALID_TEMPLATE = 'INVALID_TEMPLATE',

  // Rollback errors
  ROLLBACK_FAILED = 'ROLLBACK_FAILED',
  BACKUP_FAILED = 'BACKUP_FAILED',

  // Process errors
  PROCESS_FAILED = 'PROCESS_FAILED',
  COMMAND_NOT_FOUND = 'COMMAND_NOT_FOUND',
  EXIT_CODE_ERROR = 'EXIT_CODE_ERROR',
}

// Error factory functions
export function createCLIError(
  message: string,
  code: ErrorCodes,
  context?: string,
  suggestions?: string[]
): CLIError {
  const error = new Error(message) as CLIError;
  error.code = code;
  if (context) error.context = context;
  if (suggestions) error.suggestions = suggestions;
  error.isOperational = true;
  return error;
}

export function createValidationError(
  field: string,
  message: string,
  value?: any,
  severity: 'error' | 'warning' | 'info' = 'error'
): ValidationError {
  return {
    field,
    message,
    value,
    severity,
  };
}

export function createGeneratorError(
  message: string,
  generator: string,
  step: string,
  recoverable: boolean = false
): GeneratorError {
  const error = createCLIError(message, ErrorCodes.GENERATOR_FAILED) as GeneratorError;
  error.generator = generator;
  error.step = step;
  error.recoverable = recoverable;
  return error;
}

export function createFileSystemError(
  message: string,
  path: string,
  operation: 'read' | 'write' | 'delete' | 'copy' | 'move',
  exists: boolean
): FileSystemError {
  const error = createCLIError(message, ErrorCodes.FILE_NOT_FOUND) as FileSystemError;
  error.path = path;
  error.operation = operation;
  error.exists = exists;
  return error;
}

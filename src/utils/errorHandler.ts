import fs from 'fs-extra';
import path from 'path';
import { logger } from './logger.js';

export interface RollbackInfo {
  projectPath: string;
  createdFiles: string[];
  createdDirectories: string[];
  gitInitialized: boolean;
  timestamp: Date;
}

export class ErrorHandler {
  private rollbackInfo: RollbackInfo | null = null;
  private backupPath: string | null = null;

  setRollbackInfo(info: RollbackInfo): void {
    this.rollbackInfo = info;
  }

  getRollbackInfo(): RollbackInfo | null {
    return this.rollbackInfo;
  }

  async createBackup(projectPath: string): Promise<void> {
    if (await fs.pathExists(projectPath)) {
      const backupDir = path.join(process.cwd(), '.rails-react-graphql-backup');
      await fs.ensureDir(backupDir);

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      this.backupPath = path.join(backupDir, `backup-${timestamp}`);

      await fs.copy(projectPath, this.backupPath);
      logger.debug(`Backup created at: ${this.backupPath}`);
    }
  }

  async rollback(): Promise<void> {
    if (!this.rollbackInfo) {
      logger.warning('No rollback information available');
      return;
    }

    logger.warning('🔄 Rolling back project generation...');

    try {
      // Stop any running processes
      await this.stopRunningProcesses();

      // Remove created project directory
      if (await fs.pathExists(this.rollbackInfo.projectPath)) {
        await fs.remove(this.rollbackInfo.projectPath);
        logger.info(`Removed project directory: ${this.rollbackInfo.projectPath}`);
      }

      // Clean up any created files outside the project directory
      for (const file of this.rollbackInfo.createdFiles) {
        if (await fs.pathExists(file)) {
          await fs.remove(file);
          logger.debug(`Removed file: ${file}`);
        }
      }

      // Clean up any created directories outside the project directory
      for (const dir of this.rollbackInfo.createdDirectories) {
        if (await fs.pathExists(dir)) {
          await fs.remove(dir);
          logger.debug(`Removed directory: ${dir}`);
        }
      }

      // Restore backup if available
      if (this.backupPath && await fs.pathExists(this.backupPath)) {
        await fs.copy(this.backupPath, this.rollbackInfo.projectPath);
        logger.info('Restored backup');
      }

      logger.success('✅ Rollback completed successfully');
    } catch (error) {
      logger.error('❌ Rollback failed:', error);
      throw new Error(`Rollback failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async stopRunningProcesses(): Promise<void> {
    // This is a placeholder for stopping any running processes
    // In a real implementation, you might want to kill child processes
    // or stop development servers that were started
    logger.debug('Stopping any running processes...');
  }

  async cleanupBackup(): Promise<void> {
    if (this.backupPath && await fs.pathExists(this.backupPath)) {
      await fs.remove(this.backupPath);
      logger.debug(`Cleaned up backup: ${this.backupPath}`);
      this.backupPath = null;
    }
  }

  handleError(error: unknown, context: string): never {
    const errorMessage = this.formatError(error);

    logger.error(`❌ Error in ${context}:`, errorMessage);

    // Show rollback option
    if (this.rollbackInfo) {
      logger.warning('💡 A rollback is available to clean up partial changes');
      logger.info('Run with --rollback flag to automatically clean up');
    }

    // Provide helpful error information
    this.showErrorHelp(error);

    process.exit(1);
  }

  private formatError(error: unknown): string {
    if (error instanceof Error) {
      return `${error.message}\n${error.stack || ''}`;
    }
    return String(error);
  }

  private showErrorHelp(error: unknown): void {
    logger.newline();
    logger.subheader('Troubleshooting Tips');

    const commonErrors = [
      {
        pattern: /permission denied/i,
        solution: 'Check file permissions and ensure you have write access to the target directory'
      },
      {
        pattern: /already exists/i,
        solution: 'Remove the existing directory or choose a different project name'
      },
      {
        pattern: /network/i,
        solution: 'Check your internet connection and try again'
      },
      {
        pattern: /rails/i,
        solution: 'Ensure Rails is installed: gem install rails'
      },
      {
        pattern: /node/i,
        solution: 'Ensure Node.js is installed and up to date'
      }
    ];

    const errorString = String(error).toLowerCase();
    const matchingError = commonErrors.find(e => e.pattern.test(errorString));

    if (matchingError) {
      logger.info(`💡 ${matchingError.solution}`);
    }

    logger.info('📖 For more help, visit: https://github.com/your-repo/rails-react-graphql-cli');
  }
}

export const errorHandler = new ErrorHandler();

// Global error handlers
process.on('uncaughtException', (error) => {
  errorHandler.handleError(error, 'uncaught exception');
});

process.on('unhandledRejection', (reason) => {
  errorHandler.handleError(reason, 'unhandled promise rejection');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.warning('\n⚠️  Process interrupted by user');
  await errorHandler.rollback();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.warning('\n⚠️  Process terminated');
  await errorHandler.rollback();
  process.exit(0);
});

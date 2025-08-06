import { errorHandler } from './errorHandler.js';
import { logger } from './logger.js';

export class FileTracker {
  private createdFiles: string[] = [];
  private createdDirectories: string[] = [];

  trackFile(filePath: string): void {
    this.createdFiles.push(filePath);
    logger.debug(`Tracked file: ${filePath}`);
  }

  trackDirectory(dirPath: string): void {
    this.createdDirectories.push(dirPath);
    logger.debug(`Tracked directory: ${dirPath}`);
  }

  getCreatedFiles(): string[] {
    return [...this.createdFiles];
  }

  getCreatedDirectories(): string[] {
    return [...this.createdDirectories];
  }

  updateRollbackInfo(): void {
    const currentInfo = errorHandler.getRollbackInfo();
    if (currentInfo) {
      currentInfo.createdFiles = [...currentInfo.createdFiles, ...this.createdFiles];
      currentInfo.createdDirectories = [...currentInfo.createdDirectories, ...this.createdDirectories];
      errorHandler.setRollbackInfo(currentInfo);
    }
  }

  clear(): void {
    this.createdFiles = [];
    this.createdDirectories = [];
  }
}

export const fileTracker = new FileTracker();

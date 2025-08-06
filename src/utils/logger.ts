import chalk from 'chalk';
import ora from 'ora';

interface ProgressStep {
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  message?: string;
}

class Logger {
  private spinner: any = null;
  private progressSteps: ProgressStep[] = [];
  private currentStepIndex = -1;

  info(message: string, ...args: any[]): void {
    console.log(chalk.blue('ℹ'), message, ...args);
  }

  success(message: string, ...args: any[]): void {
    console.log(chalk.green('✅'), message, ...args);
  }

  warning(message: string, ...args: any[]): void {
    console.log(chalk.yellow('⚠️'), message, ...args);
  }

  error(message: string, ...args: any[]): void {
    console.error(chalk.red('❌'), message, ...args);
  }

  debug(message: string, ...args: any[]): void {
    if (process.env.DEBUG) {
      console.log(chalk.gray('🐛'), message, ...args);
    }
  }

  // Enhanced spinner methods
  startSpinner(text: string): void {
    this.spinner = ora({
      text,
      color: 'blue',
      spinner: 'dots',
    }).start();
  }

  stopSpinner(success = true): void {
    if (this.spinner) {
      if (success) {
        this.spinner.succeed();
      } else {
        this.spinner.fail();
      }
      this.spinner = null;
    }
  }

  updateSpinner(text: string): void {
    if (this.spinner) {
      this.spinner.text = text;
    }
  }

  // Progress tracking methods
  startProgress(steps: string[]): void {
    this.progressSteps = steps.map(name => ({ name, status: 'pending' }));
    this.currentStepIndex = -1;
    this.renderProgress();
  }

    nextStep(message?: string): void {
    if (this.currentStepIndex >= 0 && this.currentStepIndex < this.progressSteps.length) {
      const step = this.progressSteps[this.currentStepIndex];
      if (step) {
        step.status = 'completed';
        if (message) {
          step.message = message;
        }
      }
    }

    this.currentStepIndex++;
    if (this.currentStepIndex < this.progressSteps.length) {
      const step = this.progressSteps[this.currentStepIndex];
      if (step) {
        step.status = 'running';
      }
    }

    this.renderProgress();
  }

  failStep(message?: string): void {
    if (this.currentStepIndex >= 0 && this.currentStepIndex < this.progressSteps.length) {
      const step = this.progressSteps[this.currentStepIndex];
      if (step) {
        step.status = 'failed';
        if (message) {
          step.message = message;
        }
      }
    }
    this.renderProgress();
  }

    private renderProgress(): void {
    console.clear();
    console.log(chalk.cyan.bold('🚀 Rails React GraphQL Project Generation'));
    console.log(chalk.gray('─'.repeat(60)));

    this.progressSteps.forEach((step) => {
      const icon = this.getStepIcon(step.status);
      const color = this.getStepColor(step.status);
      const statusText = this.getStepStatusText(step.status);

      console.log(`${icon} ${color(step.name)} ${statusText}`);

      if (step.message) {
        console.log(`   ${chalk.gray(step.message)}`);
      }
    });

    console.log(chalk.gray('─'.repeat(60)));
  }

  private getStepIcon(status: ProgressStep['status']): string {
    switch (status) {
      case 'pending': return chalk.gray('⏳');
      case 'running': return chalk.blue('🔄');
      case 'completed': return chalk.green('✅');
      case 'failed': return chalk.red('❌');
    }
  }

  private getStepColor(status: ProgressStep['status']) {
    switch (status) {
      case 'pending': return chalk.gray;
      case 'running': return chalk.blue.bold;
      case 'completed': return chalk.green;
      case 'failed': return chalk.red;
    }
  }

  private getStepStatusText(status: ProgressStep['status']): string {
    switch (status) {
      case 'pending': return chalk.gray('(pending)');
      case 'running': return chalk.blue('(running)');
      case 'completed': return chalk.green('(completed)');
      case 'failed': return chalk.red('(failed)');
    }
  }

  // Utility methods
  clear(): void {
    console.clear();
  }

  newline(): void {
    console.log('');
  }

  separator(): void {
    console.log(chalk.gray('─'.repeat(50)));
  }

  header(title: string): void {
    console.log(chalk.cyan.bold(`\n${title}`));
    console.log(chalk.gray('─'.repeat(title.length)));
  }

  subheader(title: string): void {
    console.log(chalk.blue.bold(`\n${title}`));
  }

  list(items: string[]): void {
    items.forEach(item => {
      console.log(chalk.gray('  •'), item);
    });
  }

  table(data: Record<string, string>): void {
    const maxKeyLength = Math.max(...Object.keys(data).map(k => k.length));

    Object.entries(data).forEach(([key, value]) => {
      const paddedKey = key.padEnd(maxKeyLength);
      console.log(`${chalk.blue(paddedKey)}: ${value}`);
    });
  }
}

export const logger = new Logger();

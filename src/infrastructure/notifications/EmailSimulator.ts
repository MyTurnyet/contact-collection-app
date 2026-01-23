/**
 * Email message structure
 */
export interface EmailMessage {
  readonly to: string
  readonly subject: string
  readonly body: string
}

/**
 * Console abstraction for dependency injection
 */
export interface ConsoleLogger {
  log(message: string): void
}

/**
 * Real console adapter
 */
export class RealConsole implements ConsoleLogger {
  log(message: string): void {
    console.log(message)
  }
}

/**
 * Email simulator for MVP.
 * Logs email content to console instead of actually sending.
 */
export class EmailSimulator {
  private emailsSent = 0
  private console: ConsoleLogger

  constructor(console: ConsoleLogger) {
    this.console = console
  }

  async sendEmail(message: EmailMessage): Promise<void> {
    this.logEmail(message)
    this.incrementCount()
  }

  getEmailCount(): number {
    return this.emailsSent
  }

  private logEmail(message: EmailMessage): void {
    const formatted = this.formatEmailLog(message)
    this.console.log(formatted)
  }

  private formatEmailLog(message: EmailMessage): string {
    return `[EMAIL SIMULATOR] To: ${message.to} | Subject: ${message.subject} | Body: ${message.body}`
  }

  private incrementCount(): void {
    this.emailsSent++
  }
}

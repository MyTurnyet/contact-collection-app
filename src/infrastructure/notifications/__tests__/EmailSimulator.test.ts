import { describe, it, expect, beforeEach } from 'vitest'
import { EmailSimulator } from '../EmailSimulator'
import type { EmailMessage } from '../EmailSimulator'

// Test double for console
class FakeConsole {
  public logs: string[] = []

  log(message: string): void {
    this.logs.push(message)
  }

  clear(): void {
    this.logs = []
  }

  getLastLog(): string | undefined {
    return this.logs[this.logs.length - 1]
  }
}

describe('EmailSimulator', () => {
  let simulator: EmailSimulator
  let fakeConsole: FakeConsole

  beforeEach(() => {
    fakeConsole = new FakeConsole()
    simulator = new EmailSimulator(fakeConsole)
  })

  describe('sendEmail', () => {
    it('should log email to console', async () => {
      // Given
      const message: EmailMessage = {
        to: 'test@example.com',
        subject: 'Test Subject',
        body: 'Test body content',
      }

      // When
      await simulator.sendEmail(message)

      // Then
      expect(fakeConsole.logs.length).toBe(1)
    })

    it('should include recipient in log', async () => {
      // Given
      const message: EmailMessage = {
        to: 'john@example.com',
        subject: 'Check-in Reminder',
        body: 'Time to check in!',
      }

      // When
      await simulator.sendEmail(message)

      // Then
      const log = fakeConsole.getLastLog()
      expect(log).toContain('john@example.com')
    })

    it('should include subject in log', async () => {
      // Given
      const message: EmailMessage = {
        to: 'test@example.com',
        subject: 'Important Reminder',
        body: 'Test body',
      }

      // When
      await simulator.sendEmail(message)

      // Then
      const log = fakeConsole.getLastLog()
      expect(log).toContain('Important Reminder')
    })

    it('should include body in log', async () => {
      // Given
      const message: EmailMessage = {
        to: 'test@example.com',
        subject: 'Test',
        body: 'This is the email body content',
      }

      // When
      await simulator.sendEmail(message)

      // Then
      const log = fakeConsole.getLastLog()
      expect(log).toContain('This is the email body content')
    })

    it('should format log message clearly', async () => {
      // Given
      const message: EmailMessage = {
        to: 'test@example.com',
        subject: 'Test Subject',
        body: 'Test Body',
      }

      // When
      await simulator.sendEmail(message)

      // Then
      const log = fakeConsole.getLastLog()
      expect(log).toContain('[EMAIL SIMULATOR]')
    })

    it('should handle multiple emails', async () => {
      // Given
      const message1: EmailMessage = {
        to: 'user1@example.com',
        subject: 'Email 1',
        body: 'Body 1',
      }
      const message2: EmailMessage = {
        to: 'user2@example.com',
        subject: 'Email 2',
        body: 'Body 2',
      }

      // When
      await simulator.sendEmail(message1)
      await simulator.sendEmail(message2)

      // Then
      expect(fakeConsole.logs.length).toBe(2)
      expect(fakeConsole.logs[0]).toContain('user1@example.com')
      expect(fakeConsole.logs[1]).toContain('user2@example.com')
    })
  })

  describe('getEmailCount', () => {
    it('should return zero when no emails sent', () => {
      // When
      const count = simulator.getEmailCount()

      // Then
      expect(count).toBe(0)
    })

    it('should return count of emails sent', async () => {
      // Given
      const message: EmailMessage = {
        to: 'test@example.com',
        subject: 'Test',
        body: 'Body',
      }
      await simulator.sendEmail(message)
      await simulator.sendEmail(message)

      // When
      const count = simulator.getEmailCount()

      // Then
      expect(count).toBe(2)
    })
  })
})

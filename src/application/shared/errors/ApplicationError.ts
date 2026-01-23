/**
 * Base class for all application-level errors
 * Provides structured error information for UI consumption
 */
export class ApplicationError extends Error {
  public readonly code: string
  public readonly context?: Record<string, unknown>

  constructor(code: string, message: string, context?: Record<string, unknown>) {
    super(message)
    this.code = code
    this.context = context
    this.name = 'ApplicationError'
    Object.setPrototypeOf(this, ApplicationError.prototype)
  }
}

/**
 * Error for input validation failures
 * Includes field name and optional validation details
 */
export class ValidationError extends ApplicationError {
  public readonly field: string
  public readonly details?: Record<string, unknown>

  constructor(
    field: string,
    message: string,
    details?: Record<string, unknown>
  ) {
    super('VALIDATION_ERROR', message, details)
    this.field = field
    this.details = details
    this.name = 'ValidationError'
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

/**
 * Error for business rule violations
 * Used when domain logic prevents an operation
 */
export class DomainError extends ApplicationError {
  constructor(code: string, message: string, context?: Record<string, unknown>) {
    super(code, message, context)
    this.name = 'DomainError'
    Object.setPrototypeOf(this, DomainError.prototype)
  }
}

/**
 * Type guard to check if error is an ApplicationError
 */
export function isApplicationError(error: unknown): error is ApplicationError {
  return error instanceof ApplicationError
}

/**
 * Type guard to check if error is a ValidationError
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError
}

/**
 * Type guard to check if error is a DomainError
 */
export function isDomainError(error: unknown): error is DomainError {
  return error instanceof DomainError
}

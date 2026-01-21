import { describe, it, expect } from 'vitest'
import { EntityNotFoundError } from '../EntityNotFoundError'

describe('EntityNotFoundError', () => {
  it('should create error with entity name and id', () => {
    const error = new EntityNotFoundError('Contact', '123')

    expect(error.message).toBe('Contact not found: 123')
    expect(error.entityName).toBe('Contact')
    expect(error.entityId).toBe('123')
  })

  it('should have correct error name', () => {
    const error = new EntityNotFoundError('Category', '456')

    expect(error.name).toBe('EntityNotFoundError')
  })

  it('should be instance of Error', () => {
    const error = new EntityNotFoundError('Contact', '789')

    expect(error instanceof Error).toBe(true)
    expect(error instanceof EntityNotFoundError).toBe(true)
  })

  it('should include entity id in message', () => {
    const entityId = 'abc-123-def'
    const error = new EntityNotFoundError('User', entityId)

    expect(error.message).toContain(entityId)
  })

  it('should include entity name in message', () => {
    const error = new EntityNotFoundError('CheckIn', '999')

    expect(error.message).toContain('CheckIn')
  })
})

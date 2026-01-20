import { describe, it, expect } from 'vitest'
import {
  createNullContact,
  isNullContact,
  createContact,
  createContactId,
  createNullPhoneNumber,
  createNullEmailAddress,
  createNullLocation,
  createNullRelationshipContext,
} from '../index'

describe('NullContact', () => {
  it('should create a null contact', () => {
    const nullContact = createNullContact()

    expect(nullContact).toBeDefined()
    expect(nullContact.name).toBe('')
  })

  it('should identify null contact correctly', () => {
    const nullContact = createNullContact()

    expect(isNullContact(nullContact)).toBe(true)
  })

  it('should not identify regular contact as null', () => {
    const contact = createContact({
      id: createContactId(),
      name: 'John Doe',
    })

    expect(isNullContact(contact)).toBe(false)
  })

  it('should have null value objects', () => {
    const nullContact = createNullContact()

    expect(nullContact.phone).toBe(createNullPhoneNumber())
    expect(nullContact.email).toBe(createNullEmailAddress())
    expect(nullContact.location).toBe(createNullLocation())
    expect(nullContact.relationshipContext).toBe(createNullRelationshipContext())
  })

  it('should have empty important dates collection', () => {
    const nullContact = createNullContact()

    expect(nullContact.importantDates.size).toBe(0)
  })

  it('should always return same null contact instance', () => {
    const nullContact1 = createNullContact()
    const nullContact2 = createNullContact()

    expect(nullContact1).toBe(nullContact2)
  })

  it('should have a special null id', () => {
    const nullContact = createNullContact()

    expect(nullContact.id).toBeDefined()
    expect(typeof nullContact.id).toBe('string')
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { CreateContact } from '../CreateContact'
import { InMemoryContactRepository } from '../test-doubles/InMemoryContactRepository'
import { isNullPhoneNumber } from '../../../domain/contact/PhoneNumber'
import { isNullEmailAddress } from '../../../domain/contact/EmailAddress'
import { isNullLocation } from '../../../domain/contact/Location'
import { isNullRelationshipContext } from '../../../domain/contact/RelationshipContext'

describe('CreateContact', () => {
  let repository: InMemoryContactRepository
  let createContact: CreateContact

  beforeEach(() => {
    repository = new InMemoryContactRepository()
    createContact = new CreateContact(repository)
  })

  it('should create a contact with name only', async () => {
    const contactData = {
      name: 'John Doe',
    }

    const contact = await createContact.execute(contactData)

    expect(contact.name).toBe('John Doe')
    expect(contact.id).toBeDefined()
    expect(isNullPhoneNumber(contact.phone)).toBe(true)
    expect(isNullEmailAddress(contact.email)).toBe(true)
    expect(isNullLocation(contact.location)).toBe(true)
    expect(isNullRelationshipContext(contact.relationshipContext)).toBe(true)
  })

  it('should create a contact with name and phone', async () => {
    const contactData = {
      name: 'Jane Smith',
      phone: '+1-555-123-4567',
    }

    const contact = await createContact.execute(contactData)

    expect(contact.name).toBe('Jane Smith')
    expect(contact.phone).toBe('+15551234567')
  })

  it('should create a contact with name and email', async () => {
    const contactData = {
      name: 'Bob Johnson',
      email: 'bob@example.com',
    }

    const contact = await createContact.execute(contactData)

    expect(contact.name).toBe('Bob Johnson')
    expect(contact.email).toBe('bob@example.com')
  })

  it('should create a contact with name, phone, and email', async () => {
    const contactData = {
      name: 'Alice Brown',
      phone: '+1-555-987-6543',
      email: 'alice@example.com',
      relationshipContext: 'College friend',
    }

    const contact = await createContact.execute(contactData)

    expect(contact.name).toBe('Alice Brown')
    expect(contact.phone).toBe('+15559876543')
    expect(contact.email).toBe('alice@example.com')
    expect(contact.relationshipContext).toBe('College friend')
  })

  it('should save the contact to the repository', async () => {
    const contactData = {
      name: 'Charlie Davis',
    }

    const contact = await createContact.execute(contactData)
    const savedContact = await repository.findById(contact.id)

    expect(savedContact).toBeDefined()
    expect(savedContact?.name).toBe('Charlie Davis')
    expect(isNullPhoneNumber(savedContact!.phone)).toBe(true)
    expect(isNullEmailAddress(savedContact!.email)).toBe(true)
  })

  it('should throw error for invalid phone number', async () => {
    const contactData = {
      name: 'Invalid Phone',
      phone: 'invalid',
    }

    await expect(createContact.execute(contactData)).rejects.toThrow()
  })

  it('should throw error for invalid email', async () => {
    const contactData = {
      name: 'Invalid Email',
      email: 'not-an-email',
    }

    await expect(createContact.execute(contactData)).rejects.toThrow()
  })

  it('should throw error for empty name', async () => {
    const contactData = {
      name: '',
    }

    await expect(createContact.execute(contactData)).rejects.toThrow()
  })
})

import { useState, useEffect, useCallback } from 'react'
import { useDependencies } from '../../di'
import type { Contact } from '../../domain/contact/Contact'
import { isNullContact } from '../../domain/contact/Contact'
import type { ContactId } from '../../domain/contact/ContactId'

export interface ContactInput {
  name: string
  phone?: string
  email?: string
  city: string
  state?: string
  country: string
  timezone: string
  relationshipContext?: string
}

export interface ContactUpdateInput {
  name?: string
  phone?: string
  email?: string
  location?: string
  country?: string
  timezone?: string
  relationshipContext?: string
}

export interface UseContactsResult {
  contacts: readonly Contact[] | null
  isLoading: boolean
  error: Error | null
  operations: {
    createContact: (input: ContactInput) => Promise<Contact>
    updateContact: (id: ContactId, input: ContactUpdateInput) => Promise<Contact>
    deleteContact: (id: ContactId) => Promise<void>
    getContactById: (id: ContactId) => Promise<Contact | null>
    searchContacts: (query: string) => Promise<readonly Contact[]>
    refresh: () => Promise<void>
  }
}

/**
 * Hook for managing contacts with state
 * Auto-fetches contacts on mount and provides CRUD operations
 */
export function useContacts(): UseContactsResult {
  const container = useDependencies()
  const [contacts, setContacts] = useState<readonly Contact[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const loadContacts = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const useCase = container.getListAllContacts()
      const collection = await useCase.execute()
      setContacts(collection.toArray())
    } catch (err) {
      const appError = err instanceof Error ? err : new Error('Unknown')
      setError(appError)
    } finally {
      setIsLoading(false)
    }
  }, [container])

  useEffect(() => {
    loadContacts()
  }, [loadContacts])

  const createContact = useCallback(
    async (input: ContactInput): Promise<Contact> => {
      const useCase = container.getCreateContact()
      const contact = await useCase.execute({
        name: input.name,
        phone: input.phone,
        email: input.email,
        location: input.city,
        country: input.country,
        timezone: input.timezone,
        relationshipContext: input.relationshipContext,
      })
      await loadContacts()
      return contact
    },
    [container, loadContacts]
  )

  const updateContact = useCallback(
    async (id: ContactId, input: ContactUpdateInput): Promise<Contact> => {
      const useCase = container.getUpdateContact()
      const updated = await useCase.execute({ id, ...input })
      await loadContacts()
      return updated
    },
    [container, loadContacts]
  )

  const deleteContact = useCallback(
    async (id: ContactId): Promise<void> => {
      const useCase = container.getDeleteContact()
      await useCase.execute(id)
      await loadContacts()
    },
    [container, loadContacts]
  )

  const getContactById = useCallback(
    async (id: ContactId): Promise<Contact | null> => {
      const useCase = container.getGetContactById()
      const contact = await useCase.execute(id)
      return isNullContact(contact) ? null : contact
    },
    [container]
  )

  const searchContacts = useCallback(
    async (query: string): Promise<readonly Contact[]> => {
      const useCase = container.getSearchContacts()
      const collection = await useCase.execute(query)
      return collection.toArray()
    },
    [container]
  )

  const refresh = useCallback(async (): Promise<void> => {
    await loadContacts()
  }, [loadContacts])

  return {
    contacts,
    isLoading,
    error,
    operations: {
      createContact,
      updateContact,
      deleteContact,
      getContactById,
      searchContacts,
      refresh,
    },
  }
}

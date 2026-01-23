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

export function useContacts() {
  const container = useDependencies()

  const createContact = async (input: ContactInput): Promise<Contact> => {
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
    return contact
  }

  const getAllContacts = async (): Promise<readonly Contact[]> => {
    const useCase = container.getListAllContacts()
    const collection = await useCase.execute()
    return collection.toArray()
  }

  const getContactById = async (id: ContactId): Promise<Contact | null> => {
    const useCase = container.getGetContactById()
    const contact = await useCase.execute(id)
    return isNullContact(contact) ? null : contact
  }

  const updateContact = async (
    id: ContactId,
    input: ContactUpdateInput
  ): Promise<Contact> => {
    const useCase = container.getUpdateContact()
    return await useCase.execute({ id, ...input })
  }

  const deleteContact = async (id: ContactId): Promise<void> => {
    const useCase = container.getDeleteContact()
    await useCase.execute(id)
  }

  const searchContacts = async (query: string): Promise<readonly Contact[]> => {
    const useCase = container.getSearchContacts()
    const collection = await useCase.execute(query)
    return collection.toArray()
  }

  return {
    createContact,
    getAllContacts,
    getContactById,
    updateContact,
    deleteContact,
    searchContacts,
  }
}

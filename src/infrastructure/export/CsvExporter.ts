import type { ContactRepository } from '../../domain/contact/ContactRepository'
import type { Contact } from '../../domain/contact/Contact'

export class CsvExporter {
  private readonly contactRepository: ContactRepository

  constructor(contactRepository: ContactRepository) {
    this.contactRepository = contactRepository
  }

  async exportContacts(): Promise<string> {
    const contacts = await fetchAllContacts(this.contactRepository)
    return buildCsvString(contacts)
  }
}

async function fetchAllContacts(
  repo: ContactRepository
): Promise<readonly Contact[]> {
  const collection = await repo.findAll()
  return collection.toArray()
}

function buildCsvString(contacts: readonly Contact[]): string {
  const header = buildCsvHeader()
  const rows = contacts.map(buildCsvRow)
  return [header, ...rows].join('\n')
}

function buildCsvHeader(): string {
  return 'Name,Phone,Email,City,State,Country,Timezone,Relationship'
}

function buildCsvRow(contact: Contact): string {
  return [
    escapeCsvField(contact.name),
    escapeCsvField(contact.phone),
    escapeCsvField(contact.email),
    escapeCsvField(contact.location.city),
    escapeCsvField(contact.location.state ?? ''),
    escapeCsvField(contact.location.country),
    escapeCsvField(contact.location.timezone),
    escapeCsvField(contact.relationshipContext),
  ].join(',')
}

function escapeCsvField(value: string): string {
  if (needsEscaping(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function needsEscaping(value: string): boolean {
  return value.includes(',') || value.includes('"') || value.includes('\n')
}

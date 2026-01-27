import type { ContactRepository } from '../../domain/contact/ContactRepository'
import type { CategoryRepository } from '../../domain/category/CategoryRepository'
import type { CheckInRepository } from '../../domain/checkin/CheckInRepository'
import type { ExportData } from './ExportService'
import type { ImportService } from './ImportService'

export class JsonImporter implements ImportService {
  private readonly contactRepository: ContactRepository
  private readonly categoryRepository: CategoryRepository
  private readonly checkInRepository: CheckInRepository

  constructor(
    contactRepository: ContactRepository,
    categoryRepository: CategoryRepository,
    checkInRepository: CheckInRepository
  ) {
    this.contactRepository = contactRepository
    this.categoryRepository = categoryRepository
    this.checkInRepository = checkInRepository
  }

  async import(data: ExportData): Promise<void> {
    await saveContacts(this.contactRepository, data.contacts)
    await saveCategories(this.categoryRepository, data.categories)
    await saveCheckIns(this.checkInRepository, data.checkIns)
  }

  async importFromString(jsonString: string): Promise<void> {
    const data = parseAndValidate(jsonString)
    await this.import(data)
  }
}

async function saveContacts(
  repo: ContactRepository,
  contacts: ExportData['contacts']
): Promise<void> {
  for (const contact of contacts) {
    await repo.save(contact)
  }
}

async function saveCategories(
  repo: CategoryRepository,
  categories: ExportData['categories']
): Promise<void> {
  for (const category of categories) {
    await repo.save(category)
  }
}

async function saveCheckIns(
  repo: CheckInRepository,
  checkIns: ExportData['checkIns']
): Promise<void> {
  for (const checkIn of checkIns) {
    await repo.save(checkIn)
  }
}

function parseAndValidate(jsonString: string): ExportData {
  const parsed = parseJson(jsonString)
  validateExportData(parsed)
  return parsed as ExportData
}

function parseJson(jsonString: string): unknown {
  try {
    return JSON.parse(jsonString)
  } catch {
    throw new Error('Invalid JSON format')
  }
}

function validateExportData(data: unknown): void {
  if (!isObject(data)) {
    throw new Error('Invalid import data: must be an object')
  }

  validateRequiredField(data, 'version', 'string')
  validateRequiredField(data, 'contacts', 'array')
  validateRequiredField(data, 'categories', 'array')
  validateRequiredField(data, 'checkIns', 'array')
}

function validateRequiredField(
  data: Record<string, unknown>,
  field: string,
  type: 'string' | 'array'
): void {
  if (!(field in data)) {
    throw new Error(`Invalid import data: missing ${field}${type === 'array' ? ' array' : ''}`)
  }

  if (type === 'array' && !Array.isArray(data[field])) {
    throw new Error(`Invalid import data: ${field} must be an array`)
  }

  if (type === 'string' && typeof data[field] !== 'string') {
    throw new Error(`Invalid import data: ${field} must be a string`)
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

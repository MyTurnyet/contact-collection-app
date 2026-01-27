import type { ContactRepository } from '../../domain/contact/ContactRepository'
import type { CategoryRepository } from '../../domain/category/CategoryRepository'
import type { CheckInRepository } from '../../domain/checkin/CheckInRepository'
import type { ExportData, ExportService } from './ExportService'
import type { Contact } from '../../domain/contact/Contact'
import type { Category } from '../../domain/category/Category'
import type { CheckIn } from '../../domain/checkin/CheckIn'

export class JsonExporter implements ExportService {
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

  async export(): Promise<ExportData> {
    return {
      contacts: await fetchContacts(this.contactRepository),
      categories: await fetchCategories(this.categoryRepository),
      checkIns: await fetchCheckIns(this.checkInRepository),
      version: '1.0',
      exportedAt: new Date(),
    }
  }

  async exportAsString(): Promise<string> {
    const data = await this.export()
    return JSON.stringify(data, null, 2)
  }
}

async function fetchContacts(
  repo: ContactRepository
): Promise<readonly Contact[]> {
  const collection = await repo.findAll()
  return collection.toArray()
}

async function fetchCategories(
  repo: CategoryRepository
): Promise<readonly Category[]> {
  const collection = await repo.findAll()
  return collection.toArray()
}

async function fetchCheckIns(
  repo: CheckInRepository
): Promise<readonly CheckIn[]> {
  const collection = await repo.findAll()
  return collection.toArray()
}

import type { Contact } from '../../domain/contact/Contact'
import type { Category } from '../../domain/category/Category'
import type { CheckIn } from '../../domain/checkin/CheckIn'

export interface ExportData {
  contacts: readonly Contact[]
  categories: readonly Category[]
  checkIns: readonly CheckIn[]
  version: string
  exportedAt: Date
}

export interface ExportService {
  export(): Promise<ExportData>
  exportAsString(): Promise<string>
}

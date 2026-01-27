import type { ExportData } from './ExportService'

export interface ImportService {
  import(data: ExportData): Promise<void>
  importFromString(jsonString: string): Promise<void>
}

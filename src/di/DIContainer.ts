/**
 * Dependency Injection Container
 * Manages the creation and wiring of all application dependencies.
 */

// Storage
import { LocalStorageAdapter } from '../infrastructure/storage/LocalStorageAdapter'
import { JsonSerializer } from '../infrastructure/storage/JsonSerializer'

// Repositories
import { LocalStorageContactRepository } from '../infrastructure/repositories/LocalStorageContactRepository'
import { LocalStorageCategoryRepository } from '../infrastructure/repositories/LocalStorageCategoryRepository'
import { LocalStorageCheckInRepository } from '../infrastructure/repositories/LocalStorageCheckInRepository'

// Contact Use Cases
import { CreateContact } from '../application/contacts/CreateContact'
import { UpdateContact } from '../application/contacts/UpdateContact'
import { GetContactById } from '../application/contacts/GetContactById'
import { ListAllContacts } from '../application/contacts/ListAllContacts'
import { DeleteContact } from '../application/contacts/DeleteContact'
import { SearchContacts } from '../application/contacts/SearchContacts'

// Category Use Cases
import { CreateCategory } from '../application/categories/CreateCategory'
import { UpdateCategory } from '../application/categories/UpdateCategory'
import { DeleteCategory } from '../application/categories/DeleteCategory'
import { ListCategories } from '../application/categories/ListCategories'
import { GetDefaultCategories } from '../application/categories/GetDefaultCategories'
import { AssignContactToCategory } from '../application/categories/AssignContactToCategory'

// CheckIn Use Cases
import { ScheduleInitialCheckIn } from '../application/checkins/ScheduleInitialCheckIn'
import { GetUpcomingCheckIns } from '../application/checkins/GetUpcomingCheckIns'
import { GetOverdueCheckIns } from '../application/checkins/GetOverdueCheckIns'
import { CompleteCheckIn } from '../application/checkins/CompleteCheckIn'
import { RescheduleCheckIn } from '../application/checkins/RescheduleCheckIn'
import { GetCheckInHistory } from '../application/checkins/GetCheckInHistory'

// Dashboard Use Cases
import { GetDashboardSummary } from '../application/dashboard/GetDashboardSummary'
import { GetTodayCheckIns } from '../application/dashboard/GetTodayCheckIns'

// Services
import { RealBrowserNotificationAPI, BrowserNotificationService } from '../infrastructure/notifications/BrowserNotificationService'
import { RealConsole, EmailSimulator } from '../infrastructure/notifications/EmailSimulator'
import { RealTimerAPI, IntervalScheduler } from '../infrastructure/scheduler/IntervalScheduler'
import { OverdueCheckInDetector } from '../infrastructure/scheduler/OverdueCheckInDetector'

// Export/Import Services
import { JsonExporter } from '../infrastructure/export/JsonExporter'
import { CsvExporter } from '../infrastructure/export/CsvExporter'
import { JsonImporter } from '../infrastructure/export/JsonImporter'

// Migrations
import { MigrationManager } from '../infrastructure/migrations/MigrationManager'
import { migrations } from '../infrastructure/migrations/migrations'

// Backup
import { AutomaticBackupService } from '../infrastructure/backup/AutomaticBackupService'
import { BrowserDownloadService } from '../infrastructure/backup/BrowserDownloadService'

export class DIContainer {
  // Singleton instances
  private storageAdapter = new LocalStorageAdapter()
  private serializer = new JsonSerializer()

  // Repositories
  private contactRepo = this.createContactRepository()
  private categoryRepo = this.createCategoryRepository()
  private checkInRepo = this.createCheckInRepository()

  // Services
  private notificationService = this.createNotificationService()
  private emailSimulator = this.createEmailSimulator()
  private scheduler = this.createScheduler()
  private migrationManager = this.createMigrationManager()
  private backupService = this.createBackupService()

  // Contact Use Cases
  getCreateContact() {
    return new CreateContact(this.contactRepo)
  }

  getUpdateContact() {
    return new UpdateContact(this.contactRepo)
  }

  getGetContactById() {
    return new GetContactById(this.contactRepo)
  }

  getListAllContacts() {
    return new ListAllContacts(this.contactRepo)
  }

  getDeleteContact() {
    return new DeleteContact(this.contactRepo)
  }

  getSearchContacts() {
    return new SearchContacts(this.contactRepo)
  }

  // Category Use Cases
  getCreateCategory() {
    return new CreateCategory(this.categoryRepo)
  }

  getUpdateCategory() {
    return new UpdateCategory(this.categoryRepo)
  }

  getDeleteCategory() {
    return new DeleteCategory(this.categoryRepo)
  }

  getListCategories() {
    return new ListCategories(this.categoryRepo)
  }

  getGetDefaultCategories() {
    return new GetDefaultCategories()
  }

  getAssignContactToCategory() {
    return new AssignContactToCategory(this.contactRepo, this.categoryRepo)
  }

  // CheckIn Use Cases
  getScheduleInitialCheckIn() {
    return new ScheduleInitialCheckIn(
      this.checkInRepo,
      this.contactRepo,
      this.categoryRepo
    )
  }

  getGetUpcomingCheckIns() {
    return new GetUpcomingCheckIns(this.checkInRepo)
  }

  getGetOverdueCheckIns() {
    return new GetOverdueCheckIns(this.checkInRepo)
  }

  getCompleteCheckIn() {
    return new CompleteCheckIn(
      this.checkInRepo,
      this.contactRepo,
      this.categoryRepo
    )
  }

  getRescheduleCheckIn() {
    return new RescheduleCheckIn(this.checkInRepo)
  }

  getGetCheckInHistory() {
    return new GetCheckInHistory(this.checkInRepo)
  }

  // Dashboard Use Cases
  getGetDashboardSummary() {
    return new GetDashboardSummary(
      this.contactRepo,
      this.checkInRepo
    )
  }

  getGetTodayCheckIns() {
    return new GetTodayCheckIns(this.checkInRepo)
  }

  // Services
  getNotificationService() {
    return this.notificationService
  }

  getEmailSimulator() {
    return this.emailSimulator
  }

  getScheduler() {
    return this.scheduler
  }

  startScheduler() {
    const detector = new OverdueCheckInDetector(
      this.getGetOverdueCheckIns(),
      this.notificationService
    )
    this.scheduler.start(detector)
  }

  stopScheduler() {
    this.scheduler.stop()
  }

  async runMigrations(): Promise<void> {
    await this.migrationManager.migrate()
  }

  async createBackup(): Promise<void> {
    await this.backupService.createBackup()
  }

  // Private factory methods
  private createContactRepository() {
    return new LocalStorageContactRepository(
      this.storageAdapter,
      this.serializer
    )
  }

  private createCategoryRepository() {
    return new LocalStorageCategoryRepository(
      this.storageAdapter,
      this.serializer
    )
  }

  private createCheckInRepository() {
    return new LocalStorageCheckInRepository(
      this.storageAdapter,
      this.serializer
    )
  }

  private createNotificationService() {
    return new BrowserNotificationService(
      new RealBrowserNotificationAPI()
    )
  }

  private createEmailSimulator() {
    return new EmailSimulator(new RealConsole())
  }

  private createScheduler() {
    return new IntervalScheduler(
      new RealTimerAPI(),
      6 * 60 * 60 * 1000 // 6 hours
    )
  }

  private createMigrationManager() {
    return new MigrationManager(localStorage, migrations)
  }

  private createBackupService() {
    const exporter = this.getJsonExporter()
    const downloader = new BrowserDownloadService()
    return new AutomaticBackupService(exporter, (filename, content) =>
      downloader.download(filename, content)
    )
  }

  getJsonExporter() {
    return new JsonExporter(
      this.contactRepo,
      this.categoryRepo,
      this.checkInRepo
    )
  }

  getCsvExporter() {
    return new CsvExporter(this.contactRepo)
  }

  getJsonImporter() {
    return new JsonImporter(
      this.contactRepo,
      this.categoryRepo,
      this.checkInRepo
    )
  }
}

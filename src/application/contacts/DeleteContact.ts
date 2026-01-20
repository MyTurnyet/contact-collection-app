import { type ContactId, type ContactRepository } from '../../domain/contact'

export class DeleteContact {
  private readonly repository: ContactRepository

  constructor(repository: ContactRepository) {
    this.repository = repository
  }

  async execute(id: ContactId): Promise<void> {
    await this.repository.delete(id)
  }
}

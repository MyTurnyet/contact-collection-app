import {
  type ContactRepository,
  type ContactCollection,
} from '../../domain/contact'

export class ListAllContacts {
  private readonly repository: ContactRepository

  constructor(repository: ContactRepository) {
    this.repository = repository
  }

  async execute(): Promise<ContactCollection> {
    return this.repository.findAll()
  }
}

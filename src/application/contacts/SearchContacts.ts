import {
  type ContactRepository,
  type ContactCollection,
} from '../../domain/contact'

export class SearchContacts {
  private readonly repository: ContactRepository

  constructor(repository: ContactRepository) {
    this.repository = repository
  }

  async execute(query: string): Promise<ContactCollection> {
    return this.repository.search(query)
  }
}

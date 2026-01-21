import { type Category, createDefaultCategories } from '../../domain/category'

export class GetDefaultCategories {
  execute(): Category[] {
    return createDefaultCategories()
  }
}

import type { Category } from '../Category'
import BaseCollection from '../../contact/collections/BaseCollection'

class CategoryCollection extends BaseCollection<Category> {}

export default CategoryCollection

export function createCategoryCollection(
  items: Category[]
): CategoryCollection {
  return new CategoryCollection(items)
}

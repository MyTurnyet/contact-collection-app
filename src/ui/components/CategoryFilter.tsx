import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import type { Category } from '../../domain/category/Category'
import type { CategoryId } from '../../domain/category/CategoryId'

export interface CategoryFilterProps {
  categories: readonly Category[]
  selectedCategoryId?: CategoryId | null
  onFilterChange: (categoryId: CategoryId | null) => void
}

export function CategoryFilter({
  categories,
  selectedCategoryId,
  onFilterChange,
}: CategoryFilterProps) {
  return (
    <FormControl sx={{ minWidth: 200 }}>
      <InputLabel id="category-filter-label">Filter by Category</InputLabel>
      <Select
        labelId="category-filter-label"
        value={selectedCategoryId || ''}
        label="Filter by Category"
        onChange={(e) => handleChange(e.target.value)}
      >
        <MenuItem value="">All Categories</MenuItem>
        {categories.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )

  function handleChange(value: string) {
    if (value === '') {
      onFilterChange(null)
    } else {
      onFilterChange(value as CategoryId)
    }
  }
}

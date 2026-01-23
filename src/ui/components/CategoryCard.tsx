import { Card, CardContent, CardActions, IconButton, Typography } from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import type { Category } from '../../domain/category/Category'
import type { CategoryId } from '../../domain/category/CategoryId'
import { formatFrequency } from '../../domain/category/CheckInFrequency'

export interface CategoryCardProps {
  category: Category
  onEdit?: (category: Category) => void
  onDelete?: (id: CategoryId) => void
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  return (
    <Card data-testid="category-card">
      <CardContent>
        <Typography variant="h6">{category.name}</Typography>
        <Typography color="text.secondary">{formatFrequency(category.frequency)}</Typography>
      </CardContent>
      <CardActions>
        {onEdit && createEditButton(category, onEdit)}
        {onDelete && createDeleteButton(category.id, onDelete)}
      </CardActions>
    </Card>
  )
}

function createEditButton(
  category: Category,
  onEdit: (category: Category) => void
) {
  const handleClick = (e: React.MouseEvent) => handleEdit(e, category, onEdit)
  return (
    <IconButton aria-label="edit" onClick={handleClick} size="small">
      <EditIcon />
    </IconButton>
  )
}

function handleEdit(
  e: React.MouseEvent,
  category: Category,
  onEdit: (category: Category) => void
): void {
  e.stopPropagation()
  onEdit(category)
}

function createDeleteButton(
  id: CategoryId,
  onDelete: (id: CategoryId) => void
) {
  const handleClick = (e: React.MouseEvent) => handleDelete(e, id, onDelete)
  return (
    <IconButton aria-label="delete" onClick={handleClick} size="small" color="error">
      <DeleteIcon />
    </IconButton>
  )
}

function handleDelete(
  e: React.MouseEvent,
  id: CategoryId,
  onDelete: (id: CategoryId) => void
): void {
  e.stopPropagation()
  onDelete(id)
}

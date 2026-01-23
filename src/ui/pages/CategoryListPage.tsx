import { useState } from 'react'
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useCategories } from '../hooks/useCategories'
import { useDependencies } from '../../di'
import { CategoryCard } from '../components/CategoryCard'
import { CategoryFormModal, type CategoryFormData } from '../components/CategoryFormModal'
import type { Category } from '../../domain/category/Category'
import type { CategoryId } from '../../domain/category/CategoryId'

export function CategoryListPage() {
  const { categories, isLoading, error, operations } = useCategories()
  const container = useDependencies()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  if (isLoading) {
    return renderLoading()
  }

  if (error) {
    return renderError(error)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Categories</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" onClick={handleLoadDefaults}>
            Load Defaults
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Category
          </Button>
        </Box>
      </Box>

      {renderContent()}

      <CategoryFormModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreate}
      />

      <CategoryFormModal
        open={Boolean(editingCategory)}
        category={editingCategory || undefined}
        onClose={() => setEditingCategory(null)}
        onSave={handleEdit}
      />
    </Box>
  )

  function renderContent() {
    if (!categories || categories.length === 0) {
      return renderEmptyState()
    }
    return renderCategoryGrid()
  }

  function renderCategoryGrid() {
    return (
      <Grid container spacing={2}>
        {categories?.map(renderCategoryGridItem)}
      </Grid>
    )
  }

  function renderCategoryGridItem(category: Category) {
    return (
      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={category.id}>
        <CategoryCard
          category={category}
          onEdit={setEditingCategory}
          onDelete={handleDelete}
        />
      </Grid>
    )
  }

  function renderEmptyState() {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        {renderEmptyTitle()}
        {renderEmptySubtitle()}
      </Box>
    )
  }

  function renderEmptyTitle() {
    return (
      <Typography variant="h6" color="text.secondary">
        No categories yet
      </Typography>
    )
  }

  function renderEmptySubtitle() {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Get started by creating a category or loading defaults
      </Typography>
    )
  }

  async function handleCreate(data: CategoryFormData) {
    await operations.createCategory(data)
    setIsCreateModalOpen(false)
  }

  async function handleEdit(data: CategoryFormData) {
    if (editingCategory) {
      await operations.updateCategory(editingCategory.id, data)
      setEditingCategory(null)
    }
  }

  async function handleDelete(id: CategoryId) {
    await operations.deleteCategory(id)
  }

  async function handleLoadDefaults() {
    const defaultCategories = container.getGetDefaultCategories().execute()
    for (const category of defaultCategories) {
      await operations.createCategory({
        name: category.name,
        frequencyValue: category.frequency.value,
        frequencyUnit: category.frequency.unit,
      })
    }
  }
}

function renderLoading() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      <CircularProgress />
      <Typography sx={{ ml: 2 }}>Loading categories...</Typography>
    </Box>
  )
}

function renderError(error: Error) {
  return (
    <Box sx={{ p: 3 }}>
      <Alert severity="error">{error.message}</Alert>
    </Box>
  )
}

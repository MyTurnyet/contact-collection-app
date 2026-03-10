import { useState, useMemo } from 'react'
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  FormControlLabel,
  Switch,
  Stack,
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useContacts } from '../hooks/useContacts'
import { useCategories } from '../hooks/useCategories'
import { ContactCard } from '../components/ContactCard'
import { ContactSearchBar } from '../components/ContactSearchBar'
import { CategoryFilter } from '../components/CategoryFilter'
import { ContactFormModal, type ContactFormData } from '../components/ContactFormModal'
import { ContactDetailModal } from '../components/ContactDetailModal'
import type { Contact } from '../../domain/contact/Contact'
import type { ContactId } from '../../domain/contact/ContactId'
import type { Category } from '../../domain/category/Category'
import type { CategoryId } from '../../domain/category/CategoryId'
import { useDependencies } from '../../di'
import { categoryIdFromString, isNullCategoryId } from '../../domain/category/CategoryId'
import { getCategoryColor } from '../helpers/categoryColors'
import { formatFrequency } from '../../domain/category/CheckInFrequency'

export function ContactListPage() {
  const container = useDependencies()
  const { contacts, isLoading, error, operations } = useContacts()
  const { categories } = useCategories()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryId | null>(null)
  const [groupByCategory, setGroupByCategory] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [viewingContact, setViewingContact] = useState<Contact | null>(null)

  const filteredContacts = useFilteredContacts(contacts, searchQuery, selectedCategoryId)
  const groupedContacts = useGroupedContacts(filteredContacts, categories, groupByCategory)
  const getCategoryName = useCategoryLookup(categories)
  const getCategoryInfo = useCategoryInfoLookup(categories)

  if (isLoading) {
    return renderLoading()
  }

  if (error) {
    return renderError(error)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Contacts</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Contact
        </Button>
      </Box>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <ContactSearchBar value={searchQuery} onSearch={setSearchQuery} />
        {categories && categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onFilterChange={setSelectedCategoryId}
          />
        )}
        <FormControlLabel
          control={
            <Switch
              checked={groupByCategory}
              onChange={(e) => setGroupByCategory(e.target.checked)}
            />
          }
          label="Group by Category"
        />
      </Stack>

      {renderContent()}

      <ContactFormModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreate}
      />

      <ContactFormModal
        open={Boolean(editingContact)}
        contact={editingContact || undefined}
        onClose={() => setEditingContact(null)}
        onSave={handleEdit}
      />

      {viewingContact && (
        <ContactDetailModal
          open
          contact={viewingContact}
          categoryName={getCategoryName(viewingContact.categoryId)}
          onClose={() => setViewingContact(null)}
          onEdit={handleViewToEdit}
        />
      )}
    </Box>
  )

  function renderContent() {
    if (groupByCategory) {
      return renderGroupedContacts()
    }
    if (!filteredContacts || filteredContacts.length === 0) {
      return renderEmptyState()
    }
    return renderContactGrid(filteredContacts)
  }

  function renderGroupedContacts() {
    if (groupedContacts.length === 0) {
      return renderEmptyState()
    }

    return (
      <Box>
        {groupedContacts.map(({ category, contacts: groupContacts }) => (
          <Box key={category?.id || 'uncategorized'} sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              {category?.name || 'Uncategorized'}
              <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                ({groupContacts.length} contact{groupContacts.length !== 1 ? 's' : ''})
              </Typography>
            </Typography>
            {renderContactGrid(groupContacts)}
          </Box>
        ))}
      </Box>
    )
  }

  function renderContactGrid(contactsList: readonly Contact[]) {
    return (
      <Grid container spacing={2}>
        {contactsList.map((contact) => {
          const categoryInfo = getCategoryInfo(contact.categoryId)
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={contact.id}>
              <ContactCard
                contact={contact}
                categoryName={categoryInfo?.name}
                categoryColor={categoryInfo?.color}
                frequency={categoryInfo?.frequency}
                onEdit={setEditingContact}
                onDelete={handleDelete}
                onView={setViewingContact}
              />
            </Grid>
          )
        })}
      </Grid>
    )
  }

  function renderEmptyState() {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          No contacts yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Get started by creating your first contact
        </Typography>
      </Box>
    )
  }

  async function handleCreate(data: ContactFormData) {
    let createdContact: Contact | null = null
    try {
      createdContact = await operations.createContact(data)

      if (data.categoryId) {
        await assignCategoryAndScheduleCheckIn(createdContact, data.categoryId)
      }

      await operations.refresh()
      setIsCreateModalOpen(false)
    } catch (err) {
      if (createdContact) {
        await rollbackContactCreation(createdContact.id)
      }
      throw err
    }
  }

  async function assignCategoryAndScheduleCheckIn(contact: Contact, categoryIdString: string) {
    const categoryId = categoryIdFromString(categoryIdString)
    const assignUseCase = container.getAssignContactToCategory()
    await assignUseCase.execute({ contactId: contact.id, categoryId })

    const scheduleUseCase = container.getScheduleInitialCheckIn()
    await scheduleUseCase.execute({ contactId: contact.id })
  }

  async function rollbackContactCreation(contactId: ContactId) {
    try {
      await operations.deleteContact(contactId)
    } catch (rollbackErr) {
      console.error('Failed to rollback contact creation:', rollbackErr)
    }
  }

  async function handleEdit(data: ContactFormData) {
    if (!editingContact) return

    await operations.updateContact(editingContact.id, data)

    if (data.categoryId) {
      const newCategoryId = categoryIdFromString(data.categoryId)
      const currentCategoryId = editingContact.categoryId

      if (newCategoryId !== currentCategoryId) {
        const assignUseCase = container.getAssignContactToCategory()
        await assignUseCase.execute({
          contactId: editingContact.id,
          categoryId: newCategoryId,
        })
      }
    }

    await operations.refresh()
    setEditingContact(null)
  }

  async function handleDelete(id: ContactId) {
    await operations.deleteContact(id)
  }

  function handleViewToEdit(contact: Contact) {
    setViewingContact(null)
    setEditingContact(contact)
  }
}

function useFilteredContacts(
  contacts: readonly Contact[] | null,
  searchQuery: string,
  categoryFilter: CategoryId | null
) {
  return useMemo(() => {
    if (!contacts) return null

    let filtered = contacts

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (contact) =>
          contact.name.toLowerCase().includes(query) ||
          contact.email.toLowerCase().includes(query) ||
          contact.phone.toLowerCase().includes(query)
      )
    }

    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter((contact) => contact.categoryId === categoryFilter)
    }

    return filtered
  }, [contacts, searchQuery, categoryFilter])
}

function useGroupedContacts(
  contacts: readonly Contact[] | null,
  categories: readonly Category[] | null,
  groupByCategory: boolean
) {
  return useMemo(() => {
    if (!groupByCategory || !contacts || !categories) {
      return []
    }

    const categoryMap = new Map<string, Category>()
    categories.forEach((cat) => categoryMap.set(cat.id, cat))

    const groups = new Map<string, Contact[]>()

    contacts.forEach((contact) => {
      const key = isNullCategoryId(contact.categoryId) ? 'uncategorized' : contact.categoryId
      if (!groups.has(key)) {
        groups.set(key, [])
      }
      groups.get(key)!.push(contact)
    })

    return Array.from(groups.entries()).map(([key, groupContacts]) => ({
      category: key === 'uncategorized' ? null : categoryMap.get(key),
      contacts: groupContacts,
    }))
  }, [contacts, categories, groupByCategory])
}

function useCategoryLookup(categories: readonly Category[] | null) {
  return useMemo(() => {
    const categoryMap = new Map<string, string>()
    if (categories) {
      categories.forEach((category) => {
        categoryMap.set(category.id, category.name)
      })
    }
    return (categoryId: CategoryId): string | undefined => {
      if (isNullCategoryId(categoryId)) {
        return undefined
      }
      return categoryMap.get(categoryId)
    }
  }, [categories])
}

function useCategoryInfoLookup(categories: readonly Category[] | null) {
  return useMemo(() => {
    const categoryMap = new Map<string, Category>()
    if (categories) {
      categories.forEach((category) => {
        categoryMap.set(category.id, category)
      })
    }
    return (categoryId: CategoryId) => {
      if (isNullCategoryId(categoryId)) {
        return null
      }
      const category = categoryMap.get(categoryId)
      if (!category) return null

      return {
        name: category.name,
        color: getCategoryColor(categoryId),
        frequency: formatFrequency(category.frequency),
      }
    }
  }, [categories])
}

function renderLoading() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      <CircularProgress />
      <Typography sx={{ ml: 2 }}>Loading contacts...</Typography>
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

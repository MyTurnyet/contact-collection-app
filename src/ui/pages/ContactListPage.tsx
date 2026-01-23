import { useState, useMemo } from 'react'
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useContacts } from '../hooks/useContacts'
import { ContactCard } from '../components/ContactCard'
import { ContactSearchBar } from '../components/ContactSearchBar'
import { ContactFormModal, type ContactFormData } from '../components/ContactFormModal'
import { ContactDetailModal } from '../components/ContactDetailModal'
import type { Contact } from '../../domain/contact/Contact'
import type { ContactId } from '../../domain/contact/ContactId'

export function ContactListPage() {
  const { contacts, isLoading, error, operations } = useContacts()
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [viewingContact, setViewingContact] = useState<Contact | null>(null)

  const filteredContacts = useFilteredContacts(contacts, searchQuery)

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

      <Box sx={{ mb: 3 }}>
        <ContactSearchBar value={searchQuery} onSearch={setSearchQuery} />
      </Box>

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
          onClose={() => setViewingContact(null)}
          onEdit={handleViewToEdit}
        />
      )}
    </Box>
  )

  function renderContent() {
    if (!filteredContacts || filteredContacts.length === 0) {
      return renderEmptyState()
    }
    return renderContactGrid()
  }

  function renderContactGrid() {
    return (
      <Grid container spacing={2}>
        {filteredContacts?.map((contact) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={contact.id}>
            <ContactCard
              contact={contact}
              onEdit={setEditingContact}
              onDelete={handleDelete}
              onView={setViewingContact}
            />
          </Grid>
        ))}
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
    await operations.createContact(data)
    setIsCreateModalOpen(false)
  }

  async function handleEdit(data: ContactFormData) {
    if (editingContact) {
      await operations.updateContact(editingContact.id, data)
      setEditingContact(null)
    }
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
  searchQuery: string
) {
  return useMemo(() => {
    if (!contacts) return null
    if (!searchQuery) return contacts

    const query = searchQuery.toLowerCase()
    return contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(query) ||
        contact.email.toLowerCase().includes(query) ||
        contact.phone.toLowerCase().includes(query)
    )
  }, [contacts, searchQuery])
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

import { Box, Typography, Stack } from '@mui/material'
import type { CheckIn } from '../../domain/checkin/CheckIn'
import type { ContactId } from '../../domain/contact/ContactId'
import { CheckInCard } from './CheckInCard'

export interface OverdueCheckInsProps {
  checkIns: readonly CheckIn[]
  contactNames: Map<ContactId, string>
  onComplete?: (checkIn: CheckIn) => void
  onReschedule?: (checkIn: CheckIn) => void
}

export function OverdueCheckIns({
  checkIns,
  contactNames,
  onComplete,
  onReschedule,
}: OverdueCheckInsProps) {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Overdue Check-ins
      </Typography>
      {renderContent(checkIns, contactNames, onComplete, onReschedule)}
    </Box>
  )
}

function renderContent(
  checkIns: readonly CheckIn[],
  contactNames: Map<ContactId, string>,
  onComplete?: (checkIn: CheckIn) => void,
  onReschedule?: (checkIn: CheckIn) => void
) {
  if (checkIns.length === 0) {
    return renderEmptyState()
  }
  return renderCheckInList(checkIns, contactNames, onComplete, onReschedule)
}

function renderEmptyState() {
  return (
    <Typography color="text.secondary">
      No overdue check-ins
    </Typography>
  )
}

function renderCheckInList(
  checkIns: readonly CheckIn[],
  contactNames: Map<ContactId, string>,
  onComplete?: (checkIn: CheckIn) => void,
  onReschedule?: (checkIn: CheckIn) => void
) {
  return (
    <Stack spacing={2}>
      {checkIns.map((checkIn) =>
        renderCheckInCard(checkIn, contactNames, onComplete, onReschedule)
      )}
    </Stack>
  )
}

function renderCheckInCard(
  checkIn: CheckIn,
  contactNames: Map<ContactId, string>,
  onComplete?: (checkIn: CheckIn) => void,
  onReschedule?: (checkIn: CheckIn) => void
) {
  const contactName = contactNames.get(checkIn.contactId) ?? 'Unknown'
  return (
    <CheckInCard
      key={checkIn.id}
      checkIn={checkIn}
      contactName={contactName}
      onComplete={onComplete}
      onReschedule={onReschedule}
    />
  )
}

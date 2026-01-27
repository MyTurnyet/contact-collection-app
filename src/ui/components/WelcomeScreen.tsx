import { Box, Button, Container, Paper, Typography } from '@mui/material'
import ContactsIcon from '@mui/icons-material/Contacts'
import EventIcon from '@mui/icons-material/Event'

export interface WelcomeScreenProps {
  onComplete: () => void
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            Welcome to Contact Check-in
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            align="center"
            sx={{ mb: 4 }}
          >
            Stay connected with the people who matter most
          </Typography>

          <Box sx={{ mb: 4 }}>
            <FeatureItem
              icon={<ContactsIcon />}
              title="Track your contacts"
              description="Organize your relationships and never lose touch"
            />
            <FeatureItem
              icon={<EventIcon />}
              title="Schedule check-ins"
              description="Set reminders to reach out at the right time"
            />
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={onComplete}
              sx={{ px: 6 }}
            >
              Get Started
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

interface FeatureItemProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
      <Box sx={{ color: 'primary.main', mt: 0.5 }}>{icon}</Box>
      <Box>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Box>
  )
}

import { Container, Typography, Button, Box } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { Home as HomeIcon } from '@mui/icons-material'

export function NotFoundPage() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
        }}
      >
        {renderErrorCode()}
        {renderErrorMessage()}
        {renderHomeLink()}
      </Box>
    </Container>
  )
}

function renderErrorCode() {
  return (
    <Typography variant="h1" component="h1" gutterBottom>
      404
    </Typography>
  )
}

function renderErrorMessage() {
  return (
    <Typography variant="h5" component="h2" gutterBottom>
      Page Not Found
    </Typography>
  )
}

function renderHomeLink() {
  return (
    <Button
      variant="contained"
      component={RouterLink}
      to="/"
      startIcon={<HomeIcon />}
      sx={{ mt: 2 }}
    >
      Go to Dashboard
    </Button>
  )
}

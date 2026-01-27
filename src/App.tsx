import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline, Box, CircularProgress } from '@mui/material'
import { DependencyProvider } from './di'
import { AppLayout } from './ui/components/AppLayout'
import { DashboardPage } from './ui/pages/DashboardPage'
import { ContactListPage } from './ui/pages/ContactListPage'
import { CategoryListPage } from './ui/pages/CategoryListPage'
import { SettingsPage } from './ui/pages/SettingsPage'
import { NotFoundPage } from './ui/pages/NotFoundPage'
import { WelcomeScreen } from './ui/components/WelcomeScreen'
import { theme } from './ui/theme/theme'
import { useBackgroundScheduler } from './ui/hooks/useBackgroundScheduler'
import { useFirstRun } from './ui/hooks/useFirstRun'
import { useAppInitialization } from './ui/hooks/useAppInitialization'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DependencyProvider>
        <AppWithScheduler />
      </DependencyProvider>
    </ThemeProvider>
  )
}

function AppWithScheduler() {
  useBackgroundScheduler()
  const firstRun = useFirstRun()
  const appInit = useAppInitialization()

  function handleWelcomeComplete(): void {
    firstRun.completeSetup()
  }

  if (firstRun.isLoading || appInit.isInitializing) {
    return <LoadingScreen />
  }

  if (firstRun.isFirstRun) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />
  }

  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/contacts" element={<ContactListPage />} />
          <Route path="/categories" element={<CategoryListPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}

function LoadingScreen() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <CircularProgress />
    </Box>
  )
}

export default App

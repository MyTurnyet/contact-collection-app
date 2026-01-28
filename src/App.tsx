import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline, Box, CircularProgress } from '@mui/material'
import { DependencyProvider } from './di'
import { AppLayout } from './ui/components/AppLayout'
import { theme } from './ui/theme/theme'
import { useBackgroundScheduler } from './ui/hooks/useBackgroundScheduler'
import { useFirstRun } from './ui/hooks/useFirstRun'
import { useAppInitialization } from './ui/hooks/useAppInitialization'
import { useMigrations } from './ui/hooks/useMigrations'

const DashboardPage = lazy(() =>
  import('./ui/pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
)
const ContactListPage = lazy(() =>
  import('./ui/pages/ContactListPage').then((m) => ({ default: m.ContactListPage }))
)
const CategoryListPage = lazy(() =>
  import('./ui/pages/CategoryListPage').then((m) => ({ default: m.CategoryListPage }))
)
const CheckInsPage = lazy(() =>
  import('./ui/pages/CheckInsPage').then((m) => ({ default: m.CheckInsPage }))
)
const SettingsPage = lazy(() =>
  import('./ui/pages/SettingsPage').then((m) => ({ default: m.SettingsPage }))
)
const NotFoundPage = lazy(() =>
  import('./ui/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
)
const WelcomeScreen = lazy(() =>
  import('./ui/components/WelcomeScreen').then((m) => ({ default: m.WelcomeScreen }))
)

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
  const migrations = useMigrations()
  useBackgroundScheduler()
  const firstRun = useFirstRun()
  const appInit = useAppInitialization()

  const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

  function handleWelcomeComplete(): void {
    firstRun.completeSetup()
  }

  const isLoading = migrations.isRunning || firstRun.isLoading || appInit.isInitializing

  if (isLoading) {
    return <LoadingScreen />
  }

  if (firstRun.isFirstRun) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <WelcomeScreen onComplete={handleWelcomeComplete} />
      </Suspense>
    )
  }

  return (
    <BrowserRouter basename={basename}>
      <AppLayout>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/contacts" element={<ContactListPage />} />
            <Route path="/categories" element={<CategoryListPage />} />
            <Route path="/checkins" element={<CheckInsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
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

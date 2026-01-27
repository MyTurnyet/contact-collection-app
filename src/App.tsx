import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { DependencyProvider } from './di'
import { AppLayout } from './ui/components/AppLayout'
import { DashboardPage } from './ui/pages/DashboardPage'
import { ContactListPage } from './ui/pages/ContactListPage'
import { CategoryListPage } from './ui/pages/CategoryListPage'
import { SettingsPage } from './ui/pages/SettingsPage'
import { NotFoundPage } from './ui/pages/NotFoundPage'
import { theme } from './ui/theme/theme'
import { useBackgroundScheduler } from './ui/hooks/useBackgroundScheduler'

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

export default App

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DependencyProvider } from './di'
import { AppLayout } from './ui/components/AppLayout'
import { DashboardPage } from './ui/pages/DashboardPage'
import { ContactListPage } from './ui/pages/ContactListPage'
import { CategoryListPage } from './ui/pages/CategoryListPage'
import { SettingsPage } from './ui/pages/SettingsPage'
import { NotFoundPage } from './ui/pages/NotFoundPage'

function App() {
  return (
    <DependencyProvider>
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
    </DependencyProvider>
  )
}

export default App

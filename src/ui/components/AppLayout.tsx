import { Box } from '@mui/material'
import { NavigationBar } from './NavigationBar'

export interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavigationBar />
      {renderMainContent(children)}
    </Box>
  )
}

function renderMainContent(children: React.ReactNode) {
  return (
    <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
      {children}
    </Box>
  )
}

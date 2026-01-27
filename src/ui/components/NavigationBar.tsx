import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Category as CategoryIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material'

export function NavigationBar() {
  return (
    <AppBar position="static">
      <Toolbar>
        {renderTitle()}
        <Box sx={{ flexGrow: 1 }} />
        {renderNavigationLinks()}
      </Toolbar>
    </AppBar>
  )
}

function renderTitle() {
  return (
    <Typography
      variant="h6"
      component="div"
      sx={{ mr: { xs: 2, sm: 4 }, display: { xs: 'none', sm: 'block' } }}
    >
      Contact Check-in
    </Typography>
  )
}

function renderNavigationLinks() {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      {renderLink('/', 'Dashboard', <DashboardIcon />)}
      {renderLink('/contacts', 'Contacts', <PeopleIcon />)}
      {renderLink('/categories', 'Categories', <CategoryIcon />)}
      {renderLink('/settings', 'Settings', <SettingsIcon />)}
      {renderMobileLink('/', <DashboardIcon />, 'Dashboard')}
      {renderMobileLink('/contacts', <PeopleIcon />, 'Contacts')}
      {renderMobileLink('/categories', <CategoryIcon />, 'Categories')}
      {renderMobileLink('/settings', <SettingsIcon />, 'Settings')}
    </Box>
  )
}

function renderLink(to: string, label: string, icon: React.ReactElement) {
  return (
    <Button
      color="inherit"
      component={RouterLink}
      to={to}
      startIcon={icon}
      sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
    >
      {label}
    </Button>
  )
}

function renderMobileLink(
  to: string,
  icon: React.ReactElement,
  ariaLabel: string
) {
  return (
    <Button
      color="inherit"
      component={RouterLink}
      to={to}
      aria-label={ariaLabel}
      sx={{ display: { xs: 'inline-flex', sm: 'none' }, minWidth: 'auto' }}
    >
      {icon}
    </Button>
  )
}

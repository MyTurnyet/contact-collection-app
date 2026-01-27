import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#0891b2', // Cyan-600 - communicative, friendly
    },
    secondary: {
      main: '#7c3aed', // Violet-600 - accent for categories
    },
    success: {
      main: '#059669', // Emerald-600 - completed
    },
    warning: {
      main: '#f59e0b', // Amber-500 - upcoming
    },
    error: {
      main: '#dc2626', // Red-600 - overdue
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
})

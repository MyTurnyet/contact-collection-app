import { Container } from '@mui/material'
import type { ContainerProps } from '@mui/material'

export interface ResponsiveContainerProps extends Omit<ContainerProps, 'maxWidth'> {
  children: React.ReactNode
}

export function ResponsiveContainer({ children, ...props }: ResponsiveContainerProps) {
  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 2, sm: 3 },
        px: { xs: 2, sm: 3 },
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Container>
  )
}

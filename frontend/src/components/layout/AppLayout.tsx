import { Box, Container } from '@mui/material'
import { styled } from '@mui/material/styles'
import React from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import AppAppBar from './AppAppBar'

const LayoutContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
  backgroundRepeat: 'no-repeat',
  ...theme.applyStyles('dark', {
    backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
  }),
}))

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation()
  const { user } = useAuth()
  const isLoginPage = location.pathname === '/login'
  const showNavbar = user && !isLoginPage

  return (
    <LayoutContainer>
      {showNavbar && <AppAppBar />}
      <Container 
        maxWidth="lg" 
        sx={{ 
          pt: showNavbar ? 'calc(var(--template-frame-height, 0px) + 120px)' : 0,
          pb: 6,
          minHeight: '100vh'
        }}
      >
        {children}
      </Container>
    </LayoutContainer>
  )
}

export default AppLayout

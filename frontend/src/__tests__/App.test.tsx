import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from '../utils/theme'
import App from '../App'

describe('App', () => {
  it('renders login by default when not authenticated', () => {
    localStorage.clear()
    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    )
    expect(screen.getByRole('heading', { name: /Co-Flo Login/i })).toBeInTheDocument()
  })
})

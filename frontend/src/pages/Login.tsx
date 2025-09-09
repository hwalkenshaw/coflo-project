import * as React from 'react'
import { Box, Button, TextField, Typography, Alert, Stack, FormControl, FormLabel } from '@mui/material'
import MuiCard from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../contexts/AuthContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSnackbar } from '../contexts/SnackbarContext'
import { SitemarkIcon } from '../components/common/SitemarkIcon'
import ColorModeIconDropdown from '../theme/ColorModeIconDropdown'

type FormValues = { email: string; password: string }

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation() as any
  const from = location.state?.from?.pathname || '/'
  const { notify } = useSnackbar()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit } = useForm<FormValues>()

  const onSubmit = handleSubmit(async (values) => {
    setError(null)
    setLoading(true)
    const ok = await login(values.email, values.password)
    setLoading(false)
    if (ok) { notify('Signed in', 'success'); navigate(from, { replace: true }) }
    else { setError('Invalid credentials'); notify('Invalid credentials', 'error') }
  })

  return (
    <SignInContainer direction="column" justifyContent="space-between">
      <ColorModeIconDropdown style={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      <Card variant="outlined">
        <SitemarkIcon logoSize={64} fontSize="2.5rem" fontWeight={500} />
        <Typography
          component="h6"
          variant="h6"
          style={{ width: '100%' }}
        >
          Sign in
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Box
          component="form"
          onSubmit={onSubmit}
          noValidate
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: 16,
          }}
        >
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              id="email"
              type="email"
              placeholder="your@email.com"
              autoComplete="email"
              autoFocus
              required
              fullWidth
              variant="outlined"
              {...register('email', { required: true })}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              required
              fullWidth
              variant="outlined"
              {...register('password', { required: true })}
            />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </Box>
      </Card>
    </SignInContainer>
  )
}

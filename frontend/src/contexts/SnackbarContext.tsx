import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { Alert, Snackbar } from '@mui/material'

type SnackbarState = { open: boolean; message: string; severity: 'success' | 'info' | 'warning' | 'error'; action?: React.ReactNode; duration?: number }
type Ctx = { notify: (message: string, severity?: SnackbarState['severity'], action?: React.ReactNode, durationMs?: number) => void }

const SnackbarCtx = createContext<Ctx | undefined>(undefined)

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SnackbarState>({ open: false, message: '', severity: 'info' })
  const notify = useCallback((message: string, severity: SnackbarState['severity'] = 'info', action?: React.ReactNode, durationMs?: number) => setState({ open: true, message, severity, action, duration: durationMs }), [])
  const handleClose = () => setState(s => ({ ...s, open: false }))
  const value = useMemo(() => ({ notify }), [notify])
  return (
    <SnackbarCtx.Provider value={value}>
      {children}
      <Snackbar open={state.open} autoHideDuration={state.duration ?? 3000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} action={state.action}>
        <Alert onClose={handleClose} severity={state.severity} variant="filled" sx={{ width: '100%' }}>
          {state.message}
        </Alert>
      </Snackbar>
    </SnackbarCtx.Provider>
  )
}

export const useSnackbar = () => {
  const ctx = useContext(SnackbarCtx)
  if (!ctx) throw new Error('useSnackbar must be used within SnackbarProvider')
  return ctx
}

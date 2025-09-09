import { Container, Typography } from '@mui/material'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PeoplePage from './pages/People'
import BirthdayCalendar from './pages/birthday/Calendar'
import WidgetShowcase from './pages/WidgetShowcase'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppTheme from './theme/AppTheme'
import AppLayout from './components/layout/AppLayout'
import { SnackbarProvider } from './contexts/SnackbarContext'
import ErrorBoundary from './components/common/ErrorBoundary'

function App() {
  return (
    <BrowserRouter>
      <AppTheme>
        <SnackbarProvider>
          <AuthProvider>
            <AppLayout>
              <ErrorBoundary>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/people"
                    element={
                      <ProtectedRoute>
                        <PeoplePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/calendar"
                    element={
                      <ProtectedRoute>
                        <BirthdayCalendar />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/widgets"
                    element={
                      <ProtectedRoute>
                        <WidgetShowcase />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </ErrorBoundary>
            </AppLayout>
          </AuthProvider>
        </SnackbarProvider>
      </AppTheme>
    </BrowserRouter>
  )
}

export default App

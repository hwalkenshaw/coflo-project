import React from 'react'
import {
  Drawer,
  SwipeableDrawer,
  Box,
  IconButton,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  Stack,
  Button,
  Paper,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

interface SlideOverFormProps {
  open: boolean
  onClose: () => void
  onOpen?: () => void
  title: string
  children: React.ReactNode
  actions?: React.ReactNode
  width?: number | string
  loading?: boolean
}

export default function SlideOverForm({
  open,
  onClose,
  onOpen = () => {},
  title,
  children,
  actions,
  width = 450,
  loading = false,
}: SlideOverFormProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  const drawerWidth = isMobile ? '100%' : isTablet ? '85%' : width

  const drawerContent = (
    <Box
      sx={{
        width: drawerWidth,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: theme.palette.mode === 'dark' 
          ? theme.palette.grey[900] 
          : theme.palette.background.paper,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.mode === 'dark'
            ? theme.palette.background.paper
            : theme.palette.grey[50],
        }}
      >
        <Typography variant="h6" component="h2" fontWeight={600}>
          {title}
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: theme.palette.text.secondary,
            '&:hover': {
              bgcolor: theme.palette.action.hover,
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          px: 3,
          py: 3,
        }}
      >
        {children}
      </Box>

      {/* Actions */}
      {actions && (
        <>
          <Divider />
          <Box
            sx={{
              px: 3,
              py: 2,
              display: 'flex',
              gap: 2,
              justifyContent: 'flex-end',
              bgcolor: theme.palette.mode === 'dark'
                ? theme.palette.background.paper
                : theme.palette.grey[50],
            }}
          >
            {actions}
          </Box>
        </>
      )}
    </Box>
  )

  // Use SwipeableDrawer for mobile for better touch interactions
  if (isMobile) {
    return (
      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={onClose}
        onOpen={onOpen}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        PaperProps={{
          sx: {
            boxShadow: theme.shadows[16],
          },
        }}
      >
        {drawerContent}
      </SwipeableDrawer>
    )
  }

  // Use regular Drawer for desktop
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      variant="temporary"
      ModalProps={{
        keepMounted: false,
        BackdropProps: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      }}
      PaperProps={{
        elevation: 16,
        sx: {
          boxShadow: theme.shadows[16],
        },
      }}
    >
      {drawerContent}
    </Drawer>
  )
}
import { Box, Skeleton, Stack } from '@mui/material'

export default function LoadingOverlay() {
  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={1}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={32} />
        ))}
      </Stack>
    </Box>
  )
}


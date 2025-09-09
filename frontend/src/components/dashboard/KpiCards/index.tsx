import { Card, CardContent, Grid, Typography, Skeleton } from '@mui/material'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import api from '../../../services/api'
import AnimatedNumber from '../../common/AnimatedNumber'

type Stats = { totalCount: number; averageAge: number; youngest: number; oldest: number }

export default function KpiCards() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    let canceled = false
    api.get<Stats>('/v1/people/stats').then(({ data }) => { if (!canceled) setStats(data) })
    return () => { canceled = true }
  }, [])

  const items = stats ? [
    { label: 'People', value: stats.totalCount, digits: 0 },
    { label: 'Avg Age', value: Number(stats.averageAge.toFixed(1)), digits: 1 },
    { label: 'Youngest', value: stats.youngest, digits: 0 },
    { label: 'Oldest', value: stats.oldest, digits: 0 }
  ] : []

  if (!stats) {
    return (
      <Grid container spacing={2}>
        {[1,2,3,4].map((k) => (
          <Grid key={k} item xs={6} sm={3}>
            <Card variant="outlined">
              <CardContent>
                <Skeleton variant="text" width={60} />
                <Skeleton variant="text" width={80} height={40} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    )
  }

  return (
    <Grid container spacing={2}>
      {items.map((x) => (
        <Grid item xs={6} sm={3} key={x.label}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="overline" color="text.secondary">{x.label}</Typography>
                <Typography variant="h5"><AnimatedNumber value={Number(x.value)} fractionDigits={x.digits as any} /></Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  )
}

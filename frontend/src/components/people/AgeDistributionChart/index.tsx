import { useMemo } from 'react'
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar } from 'recharts'
import { PersonDto } from '../../../services/people.service'
import { Card, CardContent, Typography } from '@mui/material'

type Props = { rows: PersonDto[] }

export default function AgeDistributionChart({ rows }: Props) {
  const data = useMemo(() => {
    const buckets: Record<string, number> = {}
    rows.forEach(r => {
      const b = Math.floor(r.age / 10) * 10
      const label = `${b}-${b + 9}`
      buckets[label] = (buckets[label] || 0) + 1
    })
    return Object.entries(buckets).sort(([a], [b]) => parseInt(a) - parseInt(b)).map(([k, v]) => ({ range: k, count: v }))
  }, [rows])

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Age Distribution</Typography>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data}>
            <XAxis dataKey="range" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}


import { Box, Card, CardContent, Grid, Typography, IconButton, Stack } from '@mui/material'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import { useEffect, useMemo, useState } from 'react'
import { getPeople, PersonDto } from '../../services/people.service'

function getMonthMatrix(date = new Date()) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1)
  const startDay = new Date(firstDay)
  startDay.setDate(firstDay.getDate() - firstDay.getDay())
  const weeks: Date[][] = []
  for (let w = 0; w < 6; w++) {
    const week: Date[] = []
    for (let d = 0; d < 7; d++) {
      const day = new Date(startDay)
      day.setDate(startDay.getDate() + w * 7 + d)
      week.push(day)
    }
    weeks.push(week)
  }
  return weeks
}

export default function BirthdayCalendar() {
  const [rows, setRows] = useState<PersonDto[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const matrix = useMemo(() => getMonthMatrix(currentDate), [currentDate])
  const month = currentDate.getMonth()
  const year = currentDate.getFullYear()

  useEffect(() => {
    getPeople({ page: 1, pageSize: 100 }).then(r => setRows(r.items))
  }, [])

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const byDay = useMemo(() => {
    const map: Record<string, PersonDto[]> = {}
    rows.forEach(p => {
      const date = new Date(p.dateOfBirth)
      if (date.getMonth() === month) {
        const key = date.getDate().toString()
        map[key] = map[key] || []
        map[key].push(p)
      }
    })
    return map
  }, [rows, month])

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4">Birthday Calendar</Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton onClick={() => navigateMonth('prev')} aria-label="Previous month">
            <ChevronLeft />
          </IconButton>
          <Typography variant="h6" sx={{ minWidth: 150, textAlign: 'center' }}>
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Typography>
          <IconButton onClick={() => navigateMonth('next')} aria-label="Next month">
            <ChevronRight />
          </IconButton>
        </Stack>
      </Stack>
      <Grid container spacing={1}>
        {matrix.flat().map((d, i) => {
          const inMonth = d.getMonth() === month
          const day = d.getDate()
          const key = day.toString()
          const people = inMonth ? (byDay[key] || []) : []
          return (
            <Grid item xs={12/7 as any} sm={12/7 as any} md={12/7 as any} key={i}>
              <Card variant={inMonth ? 'elevation' : 'outlined'} sx={{ opacity: inMonth ? 1 : 0.4, minHeight: 110 }}>
                <CardContent>
                  <Typography variant="overline">{d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</Typography>
                  {people.slice(0,3).map(p => (
                    <Typography key={p.id} variant="body2">{p.firstName} {p.lastName}</Typography>
                  ))}
                  {people.length > 3 && <Typography variant="caption">+{people.length - 3} more</Typography>}
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}


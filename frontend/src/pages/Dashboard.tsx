import { Container, Typography, Button, Stack, Box, TextField, Divider } from '@mui/material'
import { useAuth } from '../contexts/AuthContext'
import { useEffect, useState } from 'react'
import { PersonDto, getPeople, deletePerson, getPeopleStats, PeopleStatsDto } from '../services/people.service'
import SearchBar from '../components/people/SearchBar'
import PeopleGrid from '../components/people/PeopleGrid'
import PeopleCreateDialog from '../components/people/PeopleCreateDialog'
import PeopleEditDialog from '../components/people/PeopleEditDialog'
import DeleteConfirmDialog from '../components/common/DeleteConfirmDialog'
import BirthdayCalendar from './birthday/Calendar'
import { useSnackbar } from '../contexts/SnackbarContext'
import RecentActivityWidget from '../components/dashboard/widgets/list-widgets/RecentActivityWidget'
import AverageAgeCard from '../components/dashboard/widgets/kpi-cards/AverageAgeCard'
import UpcomingBirthdaysWidget from '../components/dashboard/widgets/list-widgets/UpcomingBirthdaysWidget'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selected, setSelected] = useState<PersonDto | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [refresh, setRefresh] = useState(0)
  const [minAge, setMinAge] = useState<number | undefined>()
  const [maxAge, setMaxAge] = useState<number | undefined>()
  const [total, setTotal] = useState(0)
  const [stats, setStats] = useState<PeopleStatsDto | null>(null)
  const { notify } = useSnackbar()

  useEffect(() => {
    getPeopleStats().then(setStats).catch(console.error)
  }, [refresh])

  useEffect(() => {
    getPeople({ page: 1, pageSize: 1, search, minAge, maxAge }).then(r => setTotal(r.totalCount))
  }, [search, minAge, maxAge, refresh])

  return (
    <Container maxWidth="xl" sx={{ pt: 6, pb: 6 }}>
      {/* Dashboard Section */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h3" component="h1">
          Co-Flo People Management
        </Typography>
        <Button onClick={logout} variant="outlined">Logout</Button>
      </Stack>
      <Typography variant="body1" mb={2}>Welcome {user?.firstName} {user?.lastName}</Typography>
      
      {/* Combined Widget View - Three Column Layout */}
      {stats && (
        <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '300px' }}>
            <RecentActivityWidget.Default
              activities={stats.recentActivities.slice(0, 5).map((a, idx) => ({
                id: idx + 1,
                type: a.type as 'add' | 'edit' | 'delete',
                personName: a.personName,
                personAvatar: a.personAvatar,
                performedBy: a.performedBy,
                performedByAvatar: a.performedByAvatar,
                timestamp: new Date(a.timestamp),
                details: a.details,
                department: a.department
              }))}
            />
          </Box>
          <Box sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '300px' }}>
            <AverageAgeCard.Default
              averageAge={stats.averageAge}
              medianAge={stats.medianAge}
              change={0.5}
              ageGroups={stats.ageGroups}
            />
          </Box>
          <Box sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '300px' }}>
            <UpcomingBirthdaysWidget.Default
              birthdays={stats.upcomingBirthdays.map(b => {
                const today = new Date();
                const nextBirthday = new Date(today);
                nextBirthday.setDate(today.getDate() + b.daysUntilBirthday);
                return {
                  id: parseInt(b.id.substring(0, 8), 16),
                  name: b.name,
                  date: nextBirthday,
                  age: b.age
                };
              })}
            />
          </Box>
        </Box>
      )}
      
      <Divider sx={{ my: 4 }} />
      
      {/* People Section */}
      <Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1} mb={2}>
          <Typography variant="h4">People ({total})</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="contained" onClick={() => setCreateOpen(true)}>Add Person</Button>
          </Stack>
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
          <Box flex={1}><SearchBar onChange={setSearch} /></Box>
          <TextField label="Min Age" type="number" value={minAge ?? ''} onChange={e => setMinAge(e.target.value ? parseInt(e.target.value) : undefined)} />
          <TextField label="Max Age" type="number" value={maxAge ?? ''} onChange={e => setMaxAge(e.target.value ? parseInt(e.target.value) : undefined)} />
          <Button variant="outlined" onClick={() => { setMinAge(undefined); setMaxAge(undefined) }}>Clear</Button>
        </Stack>

        <PeopleGrid
          search={search}
          minAge={minAge}
          maxAge={maxAge}
          onEdit={(p) => { setSelected(p); setEditOpen(true) }}
          refreshSignal={refresh}
          onRequestDelete={(p) => { setSelected(p); setConfirmOpen(true) }}
        />

        <PeopleCreateDialog open={createOpen} onClose={() => setCreateOpen(false)} onCreated={() => { setRefresh(x => x + 1); notify('Person created', 'success') }} />
        <PeopleEditDialog open={editOpen} person={selected} onClose={() => setEditOpen(false)} onUpdated={() => { setRefresh(x => x + 1); notify('Person updated', 'success') }} />
        <DeleteConfirmDialog open={confirmOpen} person={selected} onCancel={() => setConfirmOpen(false)} onConfirm={async () => {
          if (selected) {
            const deletedId = selected.id
            const name = `${selected.firstName} ${selected.lastName}`
            await deletePerson(deletedId)
            setConfirmOpen(false)
            setRefresh(x => x + 1)
            notify(`${name} deleted`, 'info', (
              <Button color="inherit" size="small" onClick={async () => {
                await fetch(`http://localhost:5000/api/v1/people/${deletedId}/restore`, { method: 'PATCH' })
                setRefresh(x => x + 1)
              }}>UNDO</Button>
            ), 30000)
          }
        }} />
      </Box>
      
      <Divider sx={{ my: 4 }} />
      
      {/* Calendar Section */}
      <Box>
        <BirthdayCalendar />
      </Box>
    </Container>
  )
}
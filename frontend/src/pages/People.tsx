import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import SearchBar from '../components/people/SearchBar'
import PeopleGrid from '../components/people/PeopleGrid'
import PeopleCreateDialog from '../components/people/PeopleCreateDialog'
import PeopleEditDialog from '../components/people/PeopleEditDialog'
import DeleteConfirmDialog from '../components/common/DeleteConfirmDialog'
import { PersonDto, deletePerson, getPeople } from '../services/people.service'
import { useSnackbar } from '../contexts/SnackbarContext'

export default function PeoplePage() {
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selected, setSelected] = useState<PersonDto | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [refresh, setRefresh] = useState(0)
  const [minAge, setMinAge] = useState<number | undefined>()
  const [maxAge, setMaxAge] = useState<number | undefined>()
  const [total, setTotal] = useState(0)
  const { notify } = useSnackbar()

  useEffect(() => {
    getPeople({ page: 1, pageSize: 1, search, minAge, maxAge }).then(r => setTotal(r.totalCount))
  }, [search, minAge, maxAge, refresh])

  return (
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
  )
}

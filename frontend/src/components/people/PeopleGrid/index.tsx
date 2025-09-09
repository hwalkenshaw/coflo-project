import { DataGrid, GridColDef, GridPaginationModel, GridSortModel } from '@mui/x-data-grid'
import { Box, IconButton, Stack } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useEffect, useState } from 'react'
import { deletePerson, getPeople, PersonDto } from '../../../services/people.service'
import LoadingOverlay from './LoadingOverlay'

type Props = {
  search?: string
  onEdit: (person: PersonDto) => void
  refreshSignal?: number
  onRequestDelete?: (person: PersonDto) => void
  minAge?: number
  maxAge?: number
  onLoaded?: (rows: PersonDto[]) => void
}

export default function PeopleGrid({ search, onEdit, refreshSignal = 0, onRequestDelete, minAge, maxAge, onLoaded }: Props) {
  const [rows, setRows] = useState<PersonDto[]>([])
  const [loading, setLoading] = useState(false)
  const [rowCount, setRowCount] = useState(0)
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 20 })
  const [sortModel, setSortModel] = useState<GridSortModel>([])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const page = paginationModel.page + 1
    const pageSize = paginationModel.pageSize
    const sortBy = sortModel[0]?.field === 'name' ? 'lastName' : sortModel[0]?.field
    const sortOrder = sortModel[0]?.sort ?? 'asc'
    getPeople({ page, pageSize, search, minAge, maxAge, sortBy, sortOrder: sortOrder as any })
      .then((res) => { if (!cancelled) { setRows(res.items); setRowCount(res.totalCount); onLoaded?.(res.items) } })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [search, refreshSignal, paginationModel.page, paginationModel.pageSize, minAge, maxAge, JSON.stringify(sortModel)])

  const columns: GridColDef[] = [
    { 
      field: 'name', 
      headerName: 'Name', 
      flex: 1, 
      valueGetter: (value, row) => `${row?.firstName || ''} ${row?.lastName || ''}` 
    },
    { field: 'age', headerName: 'Age', width: 100 },
    { field: 'dateOfBirth', headerName: 'Date of Birth', width: 160 },
    { field: 'createdAt', headerName: 'Created', width: 160 },
    { field: 'actions', headerName: 'Actions', width: 120, sortable: false, filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton size="small" aria-label="edit" onClick={() => onEdit(params.row)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" aria-label="delete" onClick={async () => {
            if (onRequestDelete) onRequestDelete(params.row)
            else { await deletePerson(params.row.id); setRows(r => r.filter(x => x.id !== params.row.id)) }
          }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ) }
  ]

  return (
    <Box style={{ height: 520, width: '100%' }}>
      <DataGrid
        rows={rows.filter(r => (minAge == null || r.age >= minAge) && (maxAge == null || r.age <= maxAge))}
        getRowId={(r) => r.id}
        columns={columns}
        loading={loading}
        slots={{ loadingOverlay: LoadingOverlay as any }}
        disableRowSelectionOnClick
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        paginationMode="server"
        rowCount={rowCount}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 20, 50]}
      />
    </Box>
  )
}

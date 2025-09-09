import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { PersonDto } from '../../../services/people.service'

type Props = {
  open: boolean
  person: PersonDto | null
  onCancel: () => void
  onConfirm: () => void
}

export default function DeleteConfirmDialog({ open, person, onCancel, onConfirm }: Props) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Delete Person</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {person ? `Are you sure you want to delete ${person.firstName} ${person.lastName}?` : ''}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">Delete</Button>
      </DialogActions>
    </Dialog>
  )
}


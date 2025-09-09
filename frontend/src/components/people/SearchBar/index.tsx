import { InputAdornment, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useEffect, useState } from 'react'

type Props = {
  onChange: (value: string) => void
}

export default function SearchBar({ onChange }: Props) {
  const [value, setValue] = useState('')
  useEffect(() => {
    const t = setTimeout(() => onChange(value), 300)
    return () => clearTimeout(t)
  }, [value])
  return (
    <TextField
      placeholder="Search people…"
      fullWidth
      value={value}
      onChange={(e) => setValue(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        )
      }}
    />
  )
}


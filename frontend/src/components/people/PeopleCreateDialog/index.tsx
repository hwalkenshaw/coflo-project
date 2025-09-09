import { Button, Stack, TextField, Alert } from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useState } from 'react'
import { createPerson } from '../../../services/people.service'
import SlideOverForm from '../../common/SlideOverForm'

type Props = { open: boolean; onClose: () => void; onCreated: () => void }

const schema = yup.object({
  firstName: yup.string()
    .required('First name is required')
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters')
    .matches(/^[A-Za-z' -]+$/, 'First name can only contain letters, spaces, hyphens and apostrophes'),
  lastName: yup.string()
    .required('Last name is required') 
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters')
    .matches(/^[A-Za-z' -]+$/, 'Last name can only contain letters, spaces, hyphens and apostrophes'),
  dateOfBirth: yup.date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth must be in the past')
    .min(new Date(1900, 0, 1), 'Date of birth must be after 1900')
    .test('reasonable-age', 'Age must be less than 150 years', function(value) {
      if (!value) return false;
      const age = Math.floor((new Date().getTime() - value.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      return age <= 150;
    })
})

type FormValues = yup.InferType<typeof schema>

export default function PeopleCreateDialog({ open, onClose, onCreated }: Props) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setError } = useForm<FormValues>({ resolver: yupResolver(schema) })
  const [apiError, setApiError] = useState<string | null>(null)

  const onSubmit = handleSubmit(async (values) => {
    try {
      setApiError(null)
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth instanceof Date 
          ? values.dateOfBirth.toISOString().split('T')[0]
          : values.dateOfBirth
      }
      await createPerson(formattedValues)
      reset()
      onCreated()
      onClose()
    } catch (error: any) {
      console.error('Error creating person:', error)
      
      if (error.response?.status === 400 && error.response?.data?.errors) {
        // Handle validation errors from the backend
        const backendErrors = error.response.data.errors
        let hasFieldErrors = false
        
        // Map backend field errors to form fields
        Object.keys(backendErrors).forEach(field => {
          const fieldName = field.toLowerCase()
          if (fieldName.includes('firstname')) {
            setError('firstName', { message: backendErrors[field][0] })
            hasFieldErrors = true
          } else if (fieldName.includes('lastname')) {
            setError('lastName', { message: backendErrors[field][0] })
            hasFieldErrors = true
          } else if (fieldName.includes('dateofbirth')) {
            setError('dateOfBirth', { message: backendErrors[field][0] })
            hasFieldErrors = true
          }
        })
        
        // If no field-specific errors, show general API error
        if (!hasFieldErrors) {
          setApiError('Please check your input and try again.')
        }
      } else {
        setApiError(error.response?.data?.message || 'Failed to create person. Please try again.')
      }
    }
  })

  return (
    <SlideOverForm
      open={open}
      onClose={onClose}
      title="Add Person"
      loading={isSubmitting}
      actions={
        <>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={onSubmit} variant="contained" disabled={isSubmitting}>
            Create
          </Button>
        </>
      }
    >
      <Stack spacing={3}>
        {apiError && (
          <Alert severity="error" onClose={() => setApiError(null)}>
            {apiError}
          </Alert>
        )}
        <TextField 
          label="First Name" 
          {...register('firstName')} 
          error={!!errors.firstName} 
          helperText={errors.firstName?.message}
          fullWidth
        />
        <TextField 
          label="Last Name" 
          {...register('lastName')} 
          error={!!errors.lastName} 
          helperText={errors.lastName?.message}
          fullWidth
        />
        <TextField 
          label="Date of Birth" 
          type="date" 
          InputLabelProps={{ shrink: true }} 
          {...register('dateOfBirth')} 
          error={!!errors.dateOfBirth} 
          helperText={errors.dateOfBirth?.message}
          fullWidth
        />
      </Stack>
    </SlideOverForm>
  )
}

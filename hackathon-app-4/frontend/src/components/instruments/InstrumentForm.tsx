import { LoadingButton } from '@mui/lab'
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Switch,
  TextareaAutosize,
  TextField,
  Typography
} from '@mui/material'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

export type InstrumentFormValues = {
  instrument_name: string
  instrument_type: string
  sector: string
  country: string
  instrument_currency: string
  is_tradeable: boolean
  notes: string
}

type InstrumentFormProps = {
  mode: 'edit' | 'create'
  values?: InstrumentFormValues
  onSubmit: (d: InstrumentFormValues) => Promise<void>
}

export default function InstrumentForm(props: InstrumentFormProps) {
  const { mode, values } = props

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting }
  } = useForm<InstrumentFormValues>({
    defaultValues: values ?? {
      instrument_name: '',
      instrument_type: '',
      sector: '',
      country: '',
      instrument_currency: '',
      is_tradeable: true,
      notes: ''
    }
  })

  const onSubmit = (d: InstrumentFormValues) => {
    props.onSubmit(d)
  }

  if (mode === 'edit' && !values) {
    return null
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box display='flex' flexDirection='column' rowGap={1}>
        <label>Instrument Name</label>
        <Controller
          name='instrument_name'
          control={control}
          rules={{
            required: true
          }}
          render={({ field }) => <TextField {...field} />}
        />

        <label>Type</label>
        <Controller
          name='instrument_type'
          control={control}
          rules={{
            required: true
          }}
          render={({ field }) => (
            <FormControl>
              <RadioGroup
                defaultValue='PRIVATE_EQUITY'
                name='radio-buttons-group'
                value={field.value}
                onChange={(_, value) => {
                  field.onChange(value)
                }}
              >
                <FormControlLabel
                  value='PRIVATE_EQUITY'
                  control={<Radio />}
                  label='Private Equity'
                />
                <FormControlLabel
                  value='REAL_ESTATE'
                  control={<Radio />}
                  label='Real Estate'
                />
              </RadioGroup>
            </FormControl>
          )}
        />

        <label>Sector</label>
        <Controller
          name='sector'
          control={control}
          rules={{
            required: true
          }}
          render={({ field }) => <TextField {...field} />}
        />

        <Box
          display='flex'
          justifyContent='flex-start'
          alignItems='center'
          columnGap={1}
        >
          <Box display='flex' flexDirection='column'>
            <label>Country</label>
            <Controller
              name='country'
              control={control}
              rules={{
                required: true
              }}
              render={({ field }) => <TextField {...field} />}
            />
          </Box>

          <Box display='flex' flexDirection='column'>
            <label>Currency</label>
            <Controller
              name='instrument_currency'
              control={control}
              rules={{
                required: true
              }}
              render={({ field }) => <TextField {...field} />}
            />
          </Box>
        </Box>

        <Controller
          name='is_tradeable'
          control={control}
          render={({ field }) => (
            <Box display='flex' justifyContent='flex-start' alignItems='center'>
              <label>Set this instrument as tradeable</label>
              <Checkbox
                {...field}
                onChange={(_, value) => {
                  field.onChange(value)
                }}
                checked={field.value}
              />
            </Box>
          )}
        />

        <label>Notes</label>
        <Controller
          name='notes'
          control={control}
          rules={{
            required: true
          }}
          render={({ field }) => <TextField multiline rows={4} {...field} />}
        />

        <Box display='flex' columnGap={1}>
          <LoadingButton
            type='submit'
            variant='contained'
            loading={isSubmitting}
            onClick={(e) => onSubmit(getValues())}
          >
            Submit
          </LoadingButton>
        </Box>
      </Box>
    </form>
  )
}

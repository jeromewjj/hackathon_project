import { LoadingButton } from '@mui/lab'
import {
  Box,
  Button,
  Input,
  Switch,
  TextareaAutosize,
  TextField,
  Typography
} from '@mui/material'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

export type TransactionFormValues = {
  instrument_id: number
  quantity: number
  transaction_amount: number
  transaction_type: 'BUY' | 'SELL'
  transaction_date: string
}

type TransactionFormProps = {
  mode: 'edit' | 'create'
  values?: TransactionFormValues
  onSubmit: (d: TransactionFormValues) => Promise<void>
}

export default function TransactionForm(props: TransactionFormProps) {
  console.log({ props })
  const { mode, values } = props

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting }
  } = useForm<TransactionFormValues>({
    defaultValues: values ?? {
      // do this intentionally for empty field
      instrument_id: '' as any,
      quantity: '' as any,
      transaction_amount: '' as any,
      transaction_type: '' as any,
      transaction_date: new Date().toISOString()
    }
  })

  const onSubmit = (d: TransactionFormValues) => {
    props.onSubmit(d)
  }

  if (mode === 'edit' && !values) {
    return null
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box display='flex' flexDirection='column' rowGap={1}>
        <label>Select Instrument</label>
        <Controller
          name='instrument_id'
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
          <Controller
            name='transaction_type'
            control={control}
            rules={{
              required: true
            }}
            render={({ field }) => (
              <Box
                display='flex'
                justifyContent='flex-start'
                alignItems='flex-start'
                flexDirection='column'
              >
                <label>Type</label>
                <TextField {...field} />
              </Box>
            )}
          />

          <Controller
            name='quantity'
            control={control}
            rules={{
              required: true
            }}
            render={({ field }) => (
              <Box
                display='flex'
                justifyContent='flex-start'
                alignItems='flex-start'
                flexDirection='column'
              >
                <label>Quantity</label>
                <TextField type='number' {...field} />
              </Box>
            )}
          />
        </Box>

        <label>Amount</label>
        <Controller
          name='transaction_amount'
          control={control}
          rules={{
            required: true
          }}
          render={({ field }) => (
            <Box display='flex' justifyContent='flex-start' alignItems='center'>
              <TextField type='number' {...field} />
            </Box>
          )}
        />

        <label>Transaction Date</label>
        <Controller
          name='transaction_date'
          control={control}
          rules={{
            required: true
          }}
          render={({ field }) => (
            <Box display='flex' justifyContent='flex-start' alignItems='center'>
              <TextField type='date' {...field} />
            </Box>
          )}
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
          <Button type='reset' variant='outlined'>
            Reset
          </Button>
        </Box>
      </Box>
    </form>
  )
}

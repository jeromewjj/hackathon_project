import { Breadcrumbs, Link, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import InstrumentForm, {
  InstrumentFormValues
} from '../../components/instruments/InstrumentForm'
import { useApiSvc } from '../../context/ApiContext'

export default function NewInstrumentPage() {
  const navigate = useNavigate()

  const {
    instrument: { createInstrument }
  } = useApiSvc()

  const onSubmit = async (d: InstrumentFormValues) => {
    await createInstrument(d)
    navigate('/instrument')
  }

  return (
    <>
      <Breadcrumbs aria-label='breadcrumb'>
        <Link underline='hover' color='inherit' href='/'>
          View Instruments
        </Link>
        <Typography color='text.primary'>Create</Typography>
      </Breadcrumbs>
      <Typography variant='h4'>Create Instrument</Typography>
      <InstrumentForm mode='create' onSubmit={onSubmit} />
    </>
  )
}

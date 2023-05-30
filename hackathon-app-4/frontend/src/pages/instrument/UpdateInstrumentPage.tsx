import { Breadcrumbs, Link, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { InstrumentGetData } from '../../api/types/instrument.type'
import InstrumentForm, {
  InstrumentFormValues
} from '../../components/instruments/InstrumentForm'
import { useApiSvc } from '../../context/ApiContext'
import { isErr } from '../../utils'

type PAGE_STATE = {
  instrument: InstrumentGetData
}

export default function UpdateInstrumentPage() {
  const { instrumentId } = useParams()
  const navigate = useNavigate()

  const location = useLocation()
  const state: PAGE_STATE | undefined = location.state

  const {
    instrument: { updateInstrument, getInstrumentById }
  } = useApiSvc()

  const [instrument, setInstrument] = useState<InstrumentGetData | undefined>()
  const [err, setErr] = useState<string>('')

  useEffect(() => {
    if (state || !instrumentId) {
      return
    }

    getInstrumentById(instrumentId).then((res) => {
      if (isErr(res)) {
        setErr(res.err.msg)
        return
      }

      setInstrument(res.data)
    })
  }, [])

  const onUpdate = async (d: InstrumentFormValues) => {
    if (!instrumentId) {
      return
    }

    await updateInstrument(instrumentId, d).then(() => {
      navigate('/instrument')
    })
  }

  return (
    <>
      <Breadcrumbs aria-label='breadcrumb'>
        <Link underline='hover' color='inherit' href='/'>
          View Instruments
        </Link>
        <Typography color='text.primary'>Edit</Typography>
      </Breadcrumbs>
      <Typography variant='h4'>Edit Instrument</Typography>
      <InstrumentForm
        mode='edit'
        values={instrument ?? state?.instrument}
        onSubmit={onUpdate}
      />
    </>
  )
}

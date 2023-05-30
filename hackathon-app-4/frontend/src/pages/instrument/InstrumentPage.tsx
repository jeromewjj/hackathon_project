import React, { useCallback, useEffect, useState } from 'react'
import { InstrumentGetData } from '../../api/types/instrument.type'
import { useApiSvc } from '../../context/ApiContext'
import { isErr } from '../../utils'
import InstrumentTable from '../../components/instruments/InstrumentsTable'
import InstrumentForm, {
  InstrumentFormValues
} from '../../components/instruments/InstrumentForm'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default function InstrumentPage() {
  const [id, setId] = useState<string | undefined>()
  const [formMode, setFormMode] = useState<'edit' | 'create' | undefined>()
  const [formValues, setFormValues] = useState<
    InstrumentFormValues | undefined
  >()

  const {
    instrument: { createInstrument, updateInstrument }
  } = useApiSvc()

  const onSelect = useCallback((d?: InstrumentGetData) => {
    console.log({ d })
    if (!d) {
      setFormMode('create')
    } else {
      setFormMode('edit')
      setId(d.instrument_id)
    }
    setFormValues(d)
  }, [])
  const onCreate = useCallback(
    async (d: InstrumentFormValues) => {
      console.log('create', { d })
      await createInstrument(d)
    },
    [createInstrument]
  )
  const onEdit = useCallback(
    async (d: InstrumentFormValues) => {
      if (!id) {
        return
      }

      await updateInstrument(id, d)
    },
    [id, updateInstrument]
  )

  const onCloseDrawer = useCallback(() => {
    setFormMode(undefined)
    setFormValues(undefined)
  }, [])

  return (
    <>
      <InstrumentTable onSelectI={onSelect} />

      <Drawer
        anchor='right'
        open={formMode === 'create'}
        onClose={onCloseDrawer}
      >
        <Box p={2} width='50vw'>
          <Typography variant='h5'>Create Instrument</Typography>
          <InstrumentForm mode='create' onSubmit={onCreate} />
        </Box>
      </Drawer>

      <Drawer anchor='right' open={formMode === 'edit'} onClose={onCloseDrawer}>
        <Box p={2} width='50vw'>
          <Typography variant='h5'>Edit Instrument</Typography>
          <InstrumentForm mode='edit' values={formValues} onSubmit={onEdit} />
        </Box>
      </Drawer>
    </>
  )
}

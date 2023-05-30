import MUIDataTable, {
  MUIDataTableOptions,
  MUIDataTableProps
} from 'mui-datatables'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { ThemeProvider } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import { useApiSvc } from '../../context/ApiContext'
import { isErr } from '../../utils'
import { InstrumentGetData } from '../../api/types/instrument.type'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import { IconButton, Typography } from '@mui/material'

const muiCache = createCache({
  key: 'mui-datatables',
  prepend: true
})

function InstrumentTable(props: {
  onSelectI: (d?: InstrumentGetData) => void
}) {
  const [searchBtn, setSearchBtn] = useState(true)
  const [filterBtn, setFilterBtn] = useState(true)
  const [data, setData] = useState<InstrumentGetData[]>([])

  const navigate = useNavigate()

  const {
    instrument: { getInstruments, deleteInstrument }
  } = useApiSvc()

  useEffect(() => {
    getInstruments().then((res) => {
      if (isErr(res)) {
        return
      }
      setData(res.data)
    })
  }, [])

  const onEdit = useCallback(
    (id: string) => {
      const instrument = data.find((ele) => ele.instrument_id === id)
      if (!instrument) {
      }
      props.onSelectI(instrument)
    },
    [data]
  )

  const onDelete = (id: string) => {
    deleteInstrument(id).then((res) => {
      if (isErr(res)) {
        return
      }

      setData((prev) => prev.filter((element) => element.instrument_id !== id))
    })
  }

  const onSelect = (id: string) => {
    const instrument = data.find((ele) => ele.instrument_id === id)
    navigate(`/market-valuation/${id}`, { state: { instrument } })
  }

  const columns: MUIDataTableProps['columns'] = [
    { label: 'Name', name: 'instrument_name', options: { filter: false } },
    { label: 'Type', name: 'instrument_type' },
    { label: 'Country', name: 'country' },
    { label: 'Sector', name: 'sector' },
    { label: 'Currency', name: 'instrument_currency' },
    {
      name: 'instrument_id',
      label: 'Actions',
      options: {
        sort: false,
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Box>
              <IconButton aria-label='select' onClick={() => onSelect(value)}>
                <ShowChartIcon />
              </IconButton>
              <IconButton aria-label='edit' onClick={() => onEdit(value)}>
                <EditIcon />
              </IconButton>
              <IconButton aria-label='delete' onClick={() => onDelete(value)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          )
        }
      }
    }
  ]

  const options: MUIDataTableOptions = {
    selectableRowsHideCheckboxes: true,
    search: searchBtn,
    filter: filterBtn,
    filterType: 'dropdown',
    download: false,
    print: false,
    viewColumns: false,
    tableBodyHeight: '100%',
    tableBodyMaxHeight: '100%',
    elevation: 0
  }

  return (
    <CacheProvider value={muiCache}>
      <MUIDataTable
        title={
          <>
            <Typography variant='h4'>View Instruments</Typography>
            <Button
              size='small'
              type='button'
              onClick={() => props.onSelectI()}
            >
              Create Instrument
            </Button>
          </>
        }
        data={data}
        columns={columns}
        options={options}
      />
    </CacheProvider>
  )
}

export default InstrumentTable

import MUIDataTable, {
  MUIDataTableOptions,
  MUIDataTableProps
} from 'mui-datatables'
import { useEffect, useState } from 'react'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import { useApiSvc } from '../../context/ApiContext'
import { isErr } from '../../utils'
import { InstrumentGetData } from '../../api/types/instrument.type'
import { InvestmentGetData } from '../../api/types/investment.type'
import IconButton from '@mui/material/IconButton'
import BarChartIcon from '@mui/icons-material/BarChart'
import Box from '@mui/material/Box'
import { useNavigate } from 'react-router-dom'

const muiCache = createCache({
  key: 'mui-datatables-investments',
  prepend: true
})

type InvestmentTableProps = {
  instrument: InstrumentGetData
}

function InvestmentTable(props: InvestmentTableProps) {
  const [data, setData] = useState<InvestmentGetData[]>([])
  const navigate = useNavigate()

  const {
    investment: { getAll }
  } = useApiSvc()

  useEffect(() => {
    getAll(parseInt(props.instrument.instrument_id)).then((res) => {
      if (isErr(res)) {
        return
      }
      setData(res.data)
    })
  }, [])

  const columns: MUIDataTableProps['columns'] = [
    {
      label: 'Cumulative Quantity',
      name: 'cumulative_quantity',
      options: { filter: false }
    },
    {
      label: 'Cumulative Transaction Amount',
      name: 'cumulative_transaction_amount'
    },
    { label: 'Refreshed At', name: 'refresh_datetime' }
  ]

  const options: MUIDataTableOptions = {
    selectableRowsHideCheckboxes: true,
    filterType: 'dropdown',
    download: false,
    print: false,
    viewColumns: false,
    search: false,
    filter: false,
    elevation: 0,
    sort: true,
    tableBodyHeight: '100%',
    tableBodyMaxHeight: '100%'
  }

  return (
    <CacheProvider value={muiCache}>
      <MUIDataTable
        data={data}
        columns={columns}
        options={options}
        title={null}
      />
    </CacheProvider>
  )
}

export default InvestmentTable

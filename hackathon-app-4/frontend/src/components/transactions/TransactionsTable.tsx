import MUIDataTable, {
  MUIDataTableOptions,
  MUIDataTableProps
} from 'mui-datatables'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import { useApiSvc } from '../../context/ApiContext'
import { isErr } from '../../utils'
import DeleteIcon from '@mui/icons-material/Delete'
import { IconButton, Typography } from '@mui/material'
import { TransactionGetData } from '../../api/types/transaction.type'
import MoneyOffCsredIcon from '@mui/icons-material/MoneyOffCsred'

const muiCache = createCache({
  key: 'mui-datatables-txs',
  prepend: true
})

type TransactionTableProps = {
  onSelectTx: (d?: TransactionGetData) => void
}

function TransactionTable(props: TransactionTableProps) {
  const [data, setData] = useState<TransactionGetData[]>([])

  const navigate = useNavigate()

  const {
    transaction: { getTransactions, cancelTransaction }
  } = useApiSvc()

  useEffect(() => {
    getTransactions().then((res) => {
      if (isErr(res)) {
        return
      }
      setData(res.data)
    })
  }, [])

  const onCreate = useCallback(() => {
    props.onSelectTx()
  }, [])

  const onDelete = useCallback((id: number) => {
    cancelTransaction(id).then((res) => {
      if (isErr(res)) {
        return
      }

      setData((prev) =>
        prev.map((element) => ({
          ...element,
          is_cancelled: true
        }))
      )
    })
  }, [])

  const columns: MUIDataTableProps['columns'] = [
    // { label: 'Instrument', name: 'instrument_id', options: { filter: false } },
    { label: 'Quantity', name: 'quantity' },
    { label: 'Transaction Date', name: 'transaction_date' },
    { label: 'Amount', name: 'transaction_amount' },
    // { label: 'Type', name: 'transaction_type' },
    // { label: 'Currency', name: 'transaction_currency' },
    // { label: 'Is Cancelled', name: 'is_cancelled' },
    {
      name: 'transaction_id',
      label: 'Actions',
      options: {
        sort: false,
        filter: false,
        customBodyRender: (value: number, tableMeta, updateValue) => {
          return (
            <IconButton aria-label='delete' onClick={() => onDelete(value)}>
              <MoneyOffCsredIcon />
            </IconButton>
          )
        }
      }
    }
  ]

  const options: MUIDataTableOptions = {
    selectableRowsHideCheckboxes: true,
    filterType: 'dropdown',
    download: false,
    print: false,
    viewColumns: false,
    tableBodyHeight: '100%',
    tableBodyMaxHeight: '100%',
    elevation: 0,
    onCellClick: () => {} // navigate to market value
  }

  return (
    <CacheProvider value={muiCache}>
      <MUIDataTable
        title={
          <>
            <Typography variant='h4'>View Past Transactions</Typography>
            <Button size='small' onClick={onCreate}>
              Create transaction
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

export default TransactionTable

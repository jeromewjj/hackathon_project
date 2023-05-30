import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { Line } from 'react-chartjs-2'
import { isErr } from '../../utils'
import { MarketValuesGetData } from '../../api/types/marketValues.type'
import { useApiSvc } from '../../context/ApiContext'
import { InstrumentGetData } from '../../api/types/instrument.type'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

type MarketValueChartProps = {
  instrument: InstrumentGetData
}

function MarketValueChart(props: MarketValueChartProps) {
  const { instrument } = props

  const [marketData, setMarketData] = useState<MarketValuesGetData[]>([])
  const {
    marketValues: { getMarketValuesById }
  } = useApiSvc()

  useEffect(() => {
    getMarketValuesById(parseInt(instrument.instrument_id)).then((res) => {
      if (isErr(res)) {
        return
      }
      setMarketData(res.data)
    })
  }, [])

  const transformData = (
    data: MarketValuesGetData[]
  ): MarketValuesGetData[] => {
    return data.map((item) => {
      //item.market_value_date = String(moment(item.market_value_date.slice(0, 10)).format("MMMM Do YYYY"));
      item.market_value_date = item.market_value_date.slice(0, 10)
      return item
    })
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: true,
        text: 'Market Value'
      }
    }
  }

  const data = {
    datasets: [
      {
        label: instrument.instrument_name,
        data: transformData(marketData),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        parsing: {
          xAxisKey: 'market_value_date',
          yAxisKey: 'market_value'
        }
      }
    ]
  }

  return (
    <Box
      sx={{
        width: 3 / 4,
        height: 3 / 4,
        justifyContent: 'center'
      }}
    >
      <Line options={options} data={data} />
    </Box>
  )
}
export default MarketValueChart

import Typography from "@mui/material/Typography";
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { ReactNode, useState } from 'react'

interface TabPanelProps {
    children?: ReactNode
    index: number
    value: number
  }
  
  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props
  
    return (
      <div
        role='tabpanel'
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <>{children}</>
          </Box>
        )}
      </div>
    )
  }

function AnalyticsPage() {
    const [tab, setTab] = useState<number>(0)
    
    return (
    <>
        <Typography variant='h4'>Analytics</Typography>
        <Box sx={{ pt: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tab} onChange={(_e, num) => setTab(num)}>
            <Tab label='Time Series' />
            <Tab label='Investments' />
            {/* <Tab label='Related Transactions' /> */}
            </Tabs>
        </Box>
        <TabPanel value={tab} index={0}>
        </TabPanel>
        <TabPanel value={tab} index={1}>
        </TabPanel>
    </>);
    

}
export default AnalyticsPage
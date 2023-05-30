import LoadingButton from "@mui/lab/LoadingButton";
import { Breadcrumbs, Link, Skeleton } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import Drawer from "@mui/material/Drawer";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { InvestmentStatistics } from "../../api/types/analytics.type";
import { InstrumentGetData } from "../../api/types/instrument.type";
import InvestmentTable from "../../components/investments/InvestmentsTable";
import MarketValueChart from "../../components/marketValue/MarketValueChart";
import MarketValueForm from "../../components/marketValue/MarketValueForm";
import { useApiSvc } from "../../context/ApiContext";
import { isErr } from "../../utils";

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
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
  );
}

type PAGE_STATE = {
  instrument: InstrumentGetData;
};

function MarketValuePage() {
  const location = useLocation();
  const state: PAGE_STATE | undefined = location.state;

  const { instrumentId } = useParams();
  const [instrument, setInstrument] = useState<InstrumentGetData | undefined>(
    state?.instrument
  );
  const [stats, setStats] = useState<InvestmentStatistics | undefined>();
  const [open, setOpen] = useState<boolean>(false);
  const [tab, setTab] = useState<number>(0);

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const {
    instrument: { getInstrumentById },
    analytics: { breakdownOne },
    investment: { refresh },
  } = useApiSvc();

  useEffect(() => {
    if (state?.instrument) {
      return;
    }

    getInstrumentById(String(instrumentId!)).then((res) => {
      if (isErr(res)) {
        return;
      }

      setInstrument(res.data);
    });
  }, [state]);

  useEffect(() => {
    if (!instrumentId) {
      return;
    }

    breakdownOne(parseInt(instrumentId)).then((res) => {
      if (isErr(res)) {
        return;
      }

      setStats(res.data);
    });
  }, []);

  const onOpenDrawer = useCallback(() => {
    setOpen(true), [];
  }, []);

  const onCloseDrawer = useCallback(() => {
    setOpen(false), [];
  }, []);

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/">
          View Instruments
        </Link>
        <Typography color="text.primary">
          {instrument?.instrument_name ?? "View One"}
        </Typography>
      </Breadcrumbs>

      <Box>{/* <Typography variant='h4'>Market Valuations</Typography> */}</Box>

      {(!instrument || !stats) && (
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            <Skeleton />
          </Typography>
          <Typography variant="h5" component="div">
            <Skeleton />
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            <Skeleton />
          </Typography>
          <Typography variant="body2">
            <Skeleton />
          </Typography>
        </CardContent>
      )}

      {instrument && (
        <>
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Information
            </Typography>
            <Typography variant="h5" component="div">
              {instrument.instrument_name}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              Type: {instrument.instrument_type}
            </Typography>
            <Box pt={1}>
              <Button size="small" onClick={onOpenDrawer} variant="contained">
                Upload Market Valuations
              </Button>
              <LoadingButton
                sx={{
                  marginLeft: 1,
                }}
                loading={refreshing}
                size="small"
                onClick={() => {
                  if (!instrumentId) {
                    return;
                  }

                  setRefreshing(true);
                  refresh(instrumentId)
                    .then((res) => {
                      if (isErr(res)) {
                        return;
                      }
                    })
                    .finally(() => {
                      setRefreshing(false);
                    });
                }}
                variant="outlined"
              >
                Refresh Investment
              </LoadingButton>
            </Box>
          </CardContent>
        </>
      )}

      <Box sx={{ pt: 2, borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tab} onChange={(_e, num) => setTab(num)}>
          <Tab label="Time Series" />
          <Tab label="Investments" />
          {/* <Tab label='Related Transactions' /> */}
        </Tabs>
      </Box>
      <TabPanel value={tab} index={0}>
        {instrument && <MarketValueChart instrument={instrument} />}
      </TabPanel>
      <TabPanel value={tab} index={1}>
        {instrument && <InvestmentTable instrument={instrument} />}
      </TabPanel>
      {/* <TabPanel value={tab} index={2}>
        Item Two
      </TabPanel> */}

      <Drawer anchor="right" open={open} onClose={onCloseDrawer}>
        <Box p={2} width="30vw">
          <Typography variant="h5">Upload Market Valuations</Typography>

          <Box mt={2}>
            <MarketValueForm />
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

export default MarketValuePage;

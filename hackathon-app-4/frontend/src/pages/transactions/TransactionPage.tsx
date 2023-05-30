import { Box, Drawer, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import { TransactionGetData } from "../../api/types/transaction.type";
import TransactionsForm, {
  TransactionFormValues,
} from "../../components/transactions/TransactionsForm";
import TransactionTable from "../../components/transactions/TransactionsTable";
import { useApiSvc } from "../../context/ApiContext";

export default function TransactionPage() {
  const [formMode, setFormMode] = useState<"edit" | "create" | undefined>();
  const [formValues, setFormValues] = useState<
    TransactionFormValues | undefined
  >();

  const {
    transaction: { createTransaction },
  } = useApiSvc();
  const onSelectTx = useCallback((d?: TransactionGetData) => {
    setFormMode("create");
    setFormValues(d);
  }, []);
  const onCreate = useCallback(async (d: TransactionFormValues) => {
    createTransaction(d);
  }, []);

  const onCloseDrawer = useCallback(() => {
    setFormMode(undefined);
    setFormValues(undefined);
  }, []);

  return (
    <>
      <TransactionTable onSelectTx={onSelectTx} />

      <Drawer
        anchor="right"
        open={formMode === "create"}
        onClose={onCloseDrawer}
      >
        <Box p={2} width="50vw">
          <Typography variant="h5">Create Transaction</Typography>
          <TransactionsForm mode="create" onSubmit={onCreate} />
        </Box>
      </Drawer>
    </>
  );
}

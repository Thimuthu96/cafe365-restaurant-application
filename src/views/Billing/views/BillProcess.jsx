import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";

//components
import Tab from "../../../common/Tab";
import ToPayOrders from "../components/ToPayOrders";
import PaidOrders from "../components/PaidOrders";

const tabs = [
  {
    label: "Orders To Pay",
    value: 1,
  },
  {
    label: "Paid Orders",
    value: 2,
  },
];

const tabPanels = [
  {
    value: 1,
    element: <ToPayOrders />,
  },
  {
    value: 2,
    element: <PaidOrders />,
  },
];

const BillProcess = () => {
  const [value, setValue] = useState(1);

  const tabChangeHandler = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Grid
      container
      spacing={2}
      sx={{
        width: "100%",
        height: "auto",
        pl: 2,
      }}
    >
      <Grid item xs={12} sx={{ mt: 5 }}>
        <Tab
          tabs={tabs}
          tabPanels={tabPanels}
          value={value}
          onChange={tabChangeHandler}
        />
      </Grid>
    </Grid>
  );
};

export default BillProcess;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
import { makeStyles } from "@mui/material/styles";
import { MdOutlineNotificationsActive } from "react-icons/md";

//components
import Tab from "../../../common/Tab";
import CompleteOrders from "../components/CompletedOrders";
import Processing from "../components/Processing";
import NewOrders from "../components/NewOrders";
import ProcessingKitchen from "../components/ProcessingKitchen";

const tabs = [
  // {
  //   label: "New Orders",
  //   value: 1,
  // },
  {
    label: "Processing",
    value: 1,
  },
  {
    label: "Completed",
    value: 2,
  },
];

const tabPanels = [
  // {
  //   value: 1,
  //   element: <NewOrders />,
  // },
  {
    value: 1,
    element: <ProcessingKitchen />,
  },
  {
    value: 2,
    element: <CompleteOrders />,
  },
];

const OrdersKitchen = () => {
  const navigate = useNavigate();
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

export default OrdersKitchen;

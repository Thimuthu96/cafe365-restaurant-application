import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
import { makeStyles } from "@mui/material/styles";
import { MdOutlineNotificationsActive } from "react-icons/md";

//components
import Tab from "../../../common/Tab";
import CompletedMobileOrders from "../components/CompletedMobileOrders";
import ProcessingMobileOrders from "../components/ProcessingMobileOrders";
import NewMobileOrders from "../components/NewMobileOrders";
import ProcessingMobileOrderKitchen from "../components/ProcessingMobileOrdersKitchen";

const tabs = [
  // {
  //   label: "Pending",
  //   value: 1,
  // },
  {
    label: "Processing",
    value: 1,
  },
  {
    label: "Delivered",
    value: 2,
  },
];

const tabPanels = [
  // {
  //   value: 1,
  //   element: <NewMobileOrders />,
  // },
  {
    value: 1,
    element: <ProcessingMobileOrderKitchen />,
  },
  {
    value: 2,
    element: <CompletedMobileOrders />,
  },
];

const MobielAppOrdersKitchen = () => {
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

export default MobielAppOrdersKitchen;

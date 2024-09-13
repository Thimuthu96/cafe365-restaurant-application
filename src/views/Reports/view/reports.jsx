import React, { useState, useEffect } from "react";
import { Box, Button, Grid, CircularProgress, Toolbar } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { db } from "../../../services/firebase-config";
import { BsInfoCircle } from "react-icons/bs";
import {
  collection,
  query,
  getDocs,
  where,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import "../../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

//components
import CustomDialog from "../../../common/CustomDialog";
import OrderDetailsDialog from "../../../common/OrderDetailsDialog";
import MobileOrderDetailsDialog from "../../../common/MobileOrderDetails";

const Reports = () => {
  const theme = createTheme({
    palette: {
      secondary: {
        main: "#52575C",
      },
    },
  });

  const theme1 = createTheme({
    palette: {
      secondary: {
        main: "#0E9E52",
      },
    },
  });

  const [open, setOpen] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [rowData, setRowData] = useState({});
  const [selectedTable, setSelectedTable] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState("");

  const columns = [
    {
      field: "Date",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      // width: 150,
      flex: 1,
      align: "center",
    },
    {
      field: "OrderId",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      // width: 90,
      flex: 0.8,
      align: "center",
    },
    {
      field: "Order Details",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      // width: 404,
      flex: 2.5,
      align: "center",
      renderCell: (data) => {
        return (
          <ThemeProvider theme={theme}>
            <Grid
              sx={{ display: "flex", flexDirection: "row", columnGap: "2em" }}
            >
              <span>
                <Button
                  variant="text"
                  color="secondary"
                  onClick={() => {
                    setSelectedData(data.row.Details);
                    setSelectedTable(data.row.Table);
                    handleOpenDetails();
                  }}
                  sx={{ gap: ".5em" }}
                >
                  <BsInfoCircle style={{ fontSize: "18px" }} />
                  View order details
                </Button>
              </span>
            </Grid>
          </ThemeProvider>
        );
      },
    },
    {
      field: "Time",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      // width: 120,
      flex: 1,
      align: "center",
    },
    {
      field: "Price",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      // width: 120,
      flex: 1,
      align: "center",
    },
    {
      field: "isMobile",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      // width: 110,
      flex: 0.8,
      align: "center",
    },
  ];

  //open confirmation dialog
  const handleOpen = () => {
    setOpen(true);
  };

  //open remove confirmation dialog
  const handleOpenRemove = () => setOpenRemove(true);

  //open order details dialog
  const handleOpenDetails = () => setOpenDetails(true);

  //GET ORDER DATA FIRESTOREconst
  // const fetchData = async () => {
  //   let list = [];
  //   let list1 = [];
  //   try {
  //     setIsLoading(true);
  //     const q = query(
  //       collection(db, "order"),
  //       where("State", "==", "WAITING"),
  //       where("isMobile", "==", true)
  //     );

  //     const querySnapshot = await getDocs(q);
  //     querySnapshot.forEach((doc) => {
  //       list.push({ id: doc.id, ...doc.data() });
  //     });

  //     const q1 = query(collection(db, "checkout-info"));
  //     const querySnapshot1 = await getDocs(q1);
  //     querySnapshot1.forEach((doc) => {
  //       list1.push({ id: doc.id, ...doc.data() });
  //     });

  //     // Combine data from both lists based on OrderId/id
  //     let combinedList = list.map((item) => {
  //       const matchingItem = list1.find((item1) => item1.id === item.OrderId);
  //       return { ...item, ...matchingItem };
  //     });

  //     let combinedList2 = [];
  //     combinedList.forEach((item) => {
  //       combinedList2.push({ ...item });
  //     });

  //     setOrderData(combinedList2);
  //     setIsLoading(false);
  //   } catch (err) {
  //     console.log("*************");
  //     console.log(err);
  //     console.log("*************");
  //   }
  // };

  const customLocaleText = {
    noRowsLabel: "No data found!", // Change this to your desired message
  };

  //get report data
  const fetchData = async (date) => {
    let list = [];
    try {
      setIsLoading(true);
      const q = query(collection(db, "order"), where("Date", "==", date));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setOrderData(list);
      setIsLoading(false);
    } catch (err) {
      console.log("*************");
      console.log(err);
      console.log("*************");
    }
  };

  return (
    <Grid
      container
      sx={{
        pl: 4,
        pr: 4,
        pt: 5,
      }}
    >
      <Grid item xs={12} sx={{ justifyContent: "flex-end" }}>
        <Grid item xs={12} sm={8} md={8}></Grid>
        {/* <Grid item xs={12} sm={2} md={2} sx={{ float: "right", pb: 2 }}>
          <Button
            variant="contained"
            color="success"
            // onClick={() => navigate("/admin/menu/add-item")}
          >
            Search
          </Button>
        </Grid> */}
        <Grid item xs={12} sm={2} md={4} sx={{ float: "right", pb: 2, mr: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
              components={[
                "DatePicker",
                "TimePicker",
                "DateTimePicker",
                "DateRangePicker",
              ]}
            >
              <DemoItem>
                <DatePicker
                  size="small"
                  onChange={(newValue) => {
                    setDate(newValue);
                    console.log("********************date");
                    console.log(newValue.format("DD-MM-YYYY"));
                    console.log("********************");
                    fetchData(newValue.format("DD-MM-YYYY"));
                  }}
                />
              </DemoItem>
            </DemoContainer>
          </LocalizationProvider>
        </Grid>
      </Grid>
      <Grid
        xs={12}
        sx={{
          display: "flex",
          flexDirection: "row",
          columnGap: "1em",
        }}
      >
        {/* <Grid item xs={12} sm={2} md={2}
                    sx={{ mt: 2 }} >
                    <Filter filters={filters} />
                </Grid> */}
        <Grid item xs={12} sm={12} md={12}>
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 550,
                width: "100%",
              }}
            >
              <ThemeProvider theme={theme1}>
                <CircularProgress color="secondary" />
              </ThemeProvider>
            </Box>
          ) : (
            <Box
              sx={{
                // height: 600,
                width: "100%",
                "& .super-app-theme--header": {
                  color: "#FFFFFF",
                  backgroundColor: "#0E9E52",
                },
              }}
            >
              <DataGrid
                style={{
                  height: "570px",
                }}
                rows={orderData}
                columns={columns}
                pageSize={5}
                rowHeight={90}
                rowsPerPageOptions={[8]}
                // initialState={{
                //   sorting: {
                //     sortModel: [{ field: "Price", sort: "asc" }],
                //   },
                // }}
                localeText={customLocaleText}
              >
                <Toolbar
                  components={{
                    Toolbar: GridToolbar,
                  }}
                />
              </DataGrid>
            </Box>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Reports;

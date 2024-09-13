import React, { useState, useEffect } from "react";
import { Box, Button, Grid, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { db } from "../../../services/firebase-config";
import { collection, query, getDocs, where } from "firebase/firestore";
import { BsInfoCircle } from "react-icons/bs";
import OrderDetailsDialog from "../../../common/OrderDetailsDialog";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MobileOrderDetailsDialog from "../../../common/MobileOrderDetails";

const CompletedMobileOrders = () => {
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

  const [orderData, setOrderData] = useState([]);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [selectedTable, setSelectedTable] = useState([]);
  const [rowData, setRowData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
      flex: 1.5,
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
      flex: 0.8,
      align: "center",
    },
    {
      field: "Price",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      // width: 120,
      flex: 0.5,
      align: "center",
    },
    {
      field: "Mobile",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      // width: 110,
      flex: 0.8,
      align: "center",
    },
    {
      field: "HouseAddress",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      // width: 110,
      flex: 1.5,
      align: "center",
    },
    {
      field: "Actions",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      // width: 380,
      flex: 1.5,
      align: "center",
      renderCell: () => {
        return (
          <Grid
            sx={{ display: "flex", flexDirection: "row", columnGap: "2em" }}
          >
            <span>
              <Button variant="text" color="info" sx={{ gap: ".5em" }}>
                <IoCheckmarkDoneSharp />
                Completed
              </Button>
            </span>
          </Grid>
        );
      },
    },
  ];

  //GET ORDER DATA FIRESTORE
  useEffect(() => {
    fetchData();
  }, []);

  //GET ORDER DATA FIRESTOREconst
  const fetchData = async () => {
    let list = [];
    let list1 = [];
    try {
      setIsLoading(true);
      const q = query(
        collection(db, "order"),
        where("State", "==", "DELIVERED"),
        where("isMobile", "==", true)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });

      const q1 = query(collection(db, "checkout-info"));
      const querySnapshot1 = await getDocs(q1);
      querySnapshot1.forEach((doc) => {
        list1.push({ id: doc.id, ...doc.data() });
      });

      // Combine data from both lists based on OrderId/id
      let combinedList = list.map((item) => {
        const matchingItem = list1.find((item1) => item1.id === item.OrderId);
        return { ...item, ...matchingItem };
      });

      let combinedList2 = [];
      combinedList.forEach((item) => {
        combinedList2.push({ ...item });
      });

      setOrderData(combinedList2);
      setIsLoading(false);
    } catch (err) {
      console.log("*************");
      console.log(err);
      console.log("*************");
    }
  };

  //open order details dialog
  const handleOpenDetails = () => setOpenDetails(true);

  //close order details dialog
  const handleCloseDetails = () => setOpenDetails(false);

  const customLocaleText = {
    noRowsLabel: "No data found!", // Change this to your desired message
  };

  return (
    <>
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
            height: 550,
            width: "100%",
            "& .super-app-theme--header": {
              color: "#FFFFFF",
              backgroundColor: "#0E9E52",
            },
          }}
        >
          <DataGrid
            rows={orderData}
            columns={columns}
            pageSize={8}
            rowsPerPageOptions={[8]}
            initialState={{
              sorting: {
                sortModel: [{ field: "Time", sort: "asc" }],
              },
            }}
            localeText={customLocaleText}
          />
        </Box>
      )}

      <MobileOrderDetailsDialog
        open={openDetails}
        onClose={handleCloseDetails}
        title={selectedTable}
        data={selectedData}
      />
    </>
  );
};

export default CompletedMobileOrders;

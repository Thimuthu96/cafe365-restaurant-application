import React, { useState, useEffect } from "react";
import { Box, Button, Grid, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { db } from "../../../services/firebase-config";
import { BsInfoCircle } from "react-icons/bs";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

//components
import CustomDialog from "../../../common/CustomDialog";
import OrderDetailsDialog from "../../../common/OrderDetailsDialog";

const Processing = () => {
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
      field: "Table",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      // width: 110,
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
      field: "Actions",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      // width: 380,
      flex: 2,
      align: "center",
      renderCell: (data) => {
        return (
          <ThemeProvider theme={theme}>
            <Grid
              sx={{ display: "flex", flexDirection: "row", columnGap: "2em" }}
            >
              {/* <span>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => {
                    setRowData(data.row.id);
                    handleOpen();
                  }}
                >
                  Complete
                </Button>
              </span> */}
              <span>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setRowData(data.row.id);
                    handleOpenRemove();
                  }}
                >
                  Remove
                </Button>
              </span>
            </Grid>
          </ThemeProvider>
        );
      },
    },
  ];

  //open confirmation dialog
  const handleOpen = () => setOpen(true);

  //open remove confirmation dialog
  const handleOpenRemove = () => setOpenRemove(true);

  //open order details dialog
  const handleOpenDetails = () => setOpenDetails(true);

  //close dialog
  const handleClose = () => setOpen(false);

  //close remove dialog
  const handleCloseRemove = () => setOpenRemove(false);

  //close order details dialog
  const handleCloseDetails = () => setOpenDetails(false);

  //GET ORDER DATA FIRESTORE
  const fetchData = async () => {
    let list = [];
    try {
      setIsLoading(true);
      const q = query(
        collection(db, "order"),
        where("State", "==", "Processing")
      );
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

  useEffect(() => {
    fetchData();
  }, []);

  //COMPLETE AN ORDER
  const handleComplete = async () => {
    const data = {
      State: "Done",
    };
    await updateDoc(doc(db, "order", rowData), data);
    fetchData();
  };

  //REMOVE AN ORDER
  const handleRemove = async () => {
    await deleteDoc(doc(db, "order", rowData));
    fetchData();
    // window.location.reload(false);
  };

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

      <CustomDialog
        open={open}
        onClose={handleClose}
        handleFunc={handleComplete}
        title="Order Complete"
        desc="Are you sure to complete this order"
      />
      <CustomDialog
        open={openRemove}
        onClose={handleCloseRemove}
        handleFunc={handleRemove}
        title="Order Remove"
        desc="Are you sure to remove this order"
      />
      <OrderDetailsDialog
        open={openDetails}
        onClose={handleCloseDetails}
        title={selectedTable}
        data={selectedData}
      />
    </>
  );
};

export default Processing;

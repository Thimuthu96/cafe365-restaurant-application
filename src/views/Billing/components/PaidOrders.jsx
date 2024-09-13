import React, { useState, useEffect } from "react";
import { Box, Button, Grid, CircularProgress, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BsInfoCircle } from "react-icons/bs";
import { db } from "../../../services/firebase-config";
import { collection, query, getDocs, where } from "firebase/firestore";
import OrderDetailsDialog from "../../../common/OrderDetailsDialog";

const PaidOrders = () => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [table, setTable] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [selectedTable, setSelectedTable] = useState([]);
  const [openDetails, setOpenDetails] = useState(false);

  //open order details dialog
  const handleOpenDetails = () => setOpenDetails(true);

  //close order details dialog
  const handleCloseDetails = () => setOpenDetails(false);

  const customLocaleText = {
    noRowsLabel: "No data found!", // Change this to your desired message
  };

  //GET ORDER DATA FIRESTOREconst
  const fetchData = async () => {
    let list = [];
    try {
      setIsLoading(true);
      const q = query(collection(db, "bill"), where("State", "==", "Paid"));
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

  //Filter orders by table number
  const handleFilterOrders = async () => {
    //declare list
    let list = [];
    if (table === "") {
      fetchData();
    } else {
      try {
        setIsLoading(true);

        //firebase query
        const q = query(
          collection(db, "bill"),
          where("State", "==", "Paid"),
          where("Table", "==", table)
        );

        //get data
        const snapShot = await getDocs(q);

        //data push into list
        snapShot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });

        //data add into orderData
        setOrderData(list);
        setIsLoading(false);
      } catch (err) {
        console.log("*************");
        console.log(err);
        console.log("*************");
      }
    }
  };

  //Get search value and search while typing
  const handleChange = async (e) => {
    const value = e.target.value;
    setTable(value);

    if (value === "") {
      fetchData();
    } else {
      let list = [];
      try {
        setIsLoading(true);

        //firebase query
        const q = query(
          collection(db, "bill"),
          where("State", "==", "UnPaid"),
          where("Table", "==", value)
        );

        //get data
        const snapShot = await getDocs(q);

        //data push into list
        snapShot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });

        //data add into orderData
        setOrderData(list);
        setIsLoading(false);
      } catch (err) {
        console.log("*************");
        console.log(err);
        console.log("*************");
      }
    }
  };

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
  ];

  return (
    <>
      {/* <Grid container sx={{ pl: 0, pt: 4 }}>
        <Grid item xs={3} sx={{ pb: 2 }}>
          <TextField
            id="outlined-basic"
            label="Search table number"
            variant="outlined"
            size="small"
            sx={{
              width: "250px",
              "& label.Mui-focused": {
                color: "#0E9E52", 
              },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "#0E9E52", 
                },
            }}
            value={table}
            onChange={(e) => handleChange(e)}
          />
        </Grid>
        <Grid item xs={4} sx={{ pb: 2 }}>
          <ThemeProvider theme={theme}>
            <Button
              variant="contained"
              color="secondary"
              sx={{ width: "150px" }}
              onClick={handleFilterOrders}
            >
              Search
            </Button>
          </ThemeProvider>
        </Grid>
      </Grid> */}
      <>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 700,
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
                  sortModel: [
                    { field: "Date", sort: "ASC" },
                    { field: "Time", sort: "ASC" },
                  ],
                },
              }}
              localeText={customLocaleText}
            />
          </Box>
        )}
      </>
      <OrderDetailsDialog
        open={openDetails}
        onClose={handleCloseDetails}
        title={selectedTable}
        data={selectedData}
      />
    </>
  );
};

export default PaidOrders;

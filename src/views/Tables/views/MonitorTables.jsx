import React, { useState, useEffect } from "react";
import { Grid, Button, Box, CircularProgress } from "@mui/material";

// Components
import TableCard from "../components/TableCard";
import AccessibleHelperCard from "../components/AccessibleHelperCard";
import AddTableDialog from "../components/AddTableDialog";
import { db } from "../../../services/firebase-config";
import { collection, getDocs } from "firebase/firestore";

const MonitorTables = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const dbRef = collection(db, "table");

  // Open add table dialog
  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  // Close add table dialog
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  // GET TABLE DATA FIRESTORE
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const list = []; // Define list inside the function
      const querySnapshot = await getDocs(dbRef);
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      // Sort the list by TableNumber before setting state
      list.sort((a, b) => a.TableNumber - b.TableNumber);
      setTableData(list); // Set the new list to state
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data on component mount
  }, []);

  return (
    <Grid
      container
      sx={{
        pt: 8,
        pl: 4,
        pr: 4,
        pb: 4,
      }}
    >
      <Grid container sx={{ pb: 4 }}>
        <Grid container>
          <Grid item xs={12} sm={6} md={2}>
            <AccessibleHelperCard status="available" name="Available Table" />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <AccessibleHelperCard status="active" name="Active Table" />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <AccessibleHelperCard status="help" name="Request help" />
          </Grid>
          <Grid item xs={12} sm={6} md={4}></Grid>
          <Grid
            item
            xs={12}
            sm={2}
            md={2}
            sx={{ float: "right", pb: 2, pl: 6 }}
          >
            <Button
              variant="contained"
              color="success"
              onClick={handleOpenAddDialog}
            >
              Add New Item
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
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
            <CircularProgress color="success" />
          </Box>
        ) : (
          <Grid container rowGap={4}>
            {tableData.map((tableItem) => (
              <Grid item xs={6} sm={6} md={3} key={tableItem.id}>
                <TableCard
                  id={tableItem.id}
                  status={tableItem.Status}
                  tableNumber={tableItem.TableNumber}
                  handleFetchFunction={fetchData}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>
      <AddTableDialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        title="Add New Table"
        fetchDataFunc={fetchData}
      />
    </Grid>
  );
};

export default MonitorTables;

import React, { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Box,
  Tooltip,
  IconButton,
  CircularProgress,
  Switch,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { FiEdit3 } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { db } from "../../../services/firebase-config";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

//components
import Filter from "../components/Filter";
import AddItemDialog from "../components/AddItemDialog";
import UpdateItemDialog from "../components/UpdateItemDialod";
import RemoveConfirmationDialog from "../../../common/CustomDialog";

const Menu = () => {
  //states
  const [menuData, setMenuData] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [formValues, setFormValus] = useState(selectedData);
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const docRef = doc(db, "menu", `${selectedData?.id}`);

  const handleSwitchChange = async (e, data) => {
    const document = doc(db, "menu", `${data.id}`);
    const updatedMenuData = await menuData.map((item) => {
      if (item.id === data.id) {
        return {
          ...item,
          Availability: !data.Availability,
        };
      }
      return item;
    });
    setMenuData(updatedMenuData);

    try {
      await updateDoc(document, {
        Id: data.Id,
        ItemImage: data.ItemImage,
        Category: data.Category,
        ItemName: data.ItemName,
        Price: data.Price,
        Availability: !data.Availability,
      });

      toast.success(
        `${data.ItemName} is ${
          !data.Availability === true ? "active" : "deactive"
        } now!`,
        {
          position: "bottom-right",
        }
      );
    } catch (err) {
      console.log("*******************");
      console.log(err);
      console.log("*******************");
      toast.error("Something went wrong!", {
        position: "bottom-right",
      });
    }
  };

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

  //Change item activate or deactivate

  const columns = [
    {
      field: "Id",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      // width: 150,
      flex: 0.8,
      align: "center",
    },
    {
      field: "ItemName",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      // width: 300,
      flex: 1.6,
      align: "center",
    },
    {
      field: "ItemImage",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      // width: 220,
      flex: 1,
      align: "center",
      renderCell: (params) => (
        <img
          src={params.value}
          style={{
            width: "55%",
            borderRadius: "10%",
          }}
        />
      ),
    },
    {
      field: "Price",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      // width: 160,
      flex: 0.9,
      align: "center",
    },
    {
      field: "Category",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      // width: 160,
      flex: 0.9,
      align: "center",
    },
    {
      field: "Availability",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      // width: 160,
      flex: 0.9,
      align: "center",
      renderCell: (data) => {
        return (
          <ThemeProvider theme={theme1}>
            <Grid
              sx={{ display: "flex", flexDirection: "row", columnGap: "2em" }}
            >
              <span>
                <Tooltip title="Activate / Deactivate">
                  <Switch
                    checked={data.row.Availability}
                    onClick={(e) => {
                      setSelectedData(data.row);
                      handleSwitchChange(e, data.row);
                    }}
                    color="secondary"
                  />
                </Tooltip>
              </span>
            </Grid>
          </ThemeProvider>
        );
      },
    },
    {
      field: "Actions",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      // width: 400,
      flex: 2.2,
      align: "center",
      renderCell: (data) => {
        return (
          <ThemeProvider theme={theme}>
            <Grid
              sx={{ display: "flex", flexDirection: "row", columnGap: "2em" }}
            >
              <span>
                <Tooltip title="Edit">
                  <IconButton>
                    <FiEdit3
                      onClick={() => {
                        setSelectedData(data.row);
                        setFormValus(data.row);
                        handleUpdateDialog();
                      }}
                    />
                  </IconButton>
                </Tooltip>
              </span>
              <span>
                <Tooltip title="Remove">
                  <IconButton>
                    <RiDeleteBinLine
                      style={{ color: "#0E9E52" }}
                      onClick={() => {
                        setSelectedData(data.row);
                        handleDeleteDialog();
                      }}
                    />
                  </IconButton>
                </Tooltip>
              </span>
            </Grid>
          </ThemeProvider>
        );
      },
    },
  ];

  //formik
  const formik = useFormik({
    initialValues: {
      Id: formValues.Id,
      ItemImage: formValues.ItemImage,
      Category: formValues.Category,
      ItemName: formValues.ItemName,
      Price: formValues.Price,
    },

    enableReinitialize: true,

    // validationSchema: Yup.object().shape({
    //   ItemImage: Yup.string().required("Item image is required!"),
    //   ItemName: Yup.string().min(9).max(12).required("Item name is required"),
    //   Price: Yup.string().required("Item price is required"),
    // }),

    onSubmit: (values) => {
      try {
        updateDoc(docRef, {
          Id: formValues.Id,
          ItemImage: values.ItemImage,
          Category: values.Category,
          ItemName: values.ItemName,
          Price: parseFloat(values.Price, 10),
          Availability: formValues.Availability,
        });
        fetchData();
        toast.success("Item updated successfully!", {
          position: "bottom-right",
        });
      } catch (err) {
        console.log(err);
        toast.error("Something went wrong!", {
          position: "bottom-right",
        });
      }
    },
  });

  //open add new dialog
  const handleOpen = () => {
    setOpen(true);
  };
  //close add new dialog
  const handleClose = () => {
    setOpen(false);
  };

  //GET MENU DATA FIRESTORE
  let list = [];
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const querySnapshot = await getDocs(collection(db, "menu"));
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setMenuData(list);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  //open delete dialog
  const handleDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  //close delete dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  //const update dialog
  const handleUpdateDialog = () => {
    setOpenUpdateDialog(true);
  };

  //close update dialog
  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
  };

  const resetFunc = () => {};

  //remove item from menu
  const handleRemove = async () => {
    try {
      await deleteDoc(doc(db, "menu", selectedData.id));
      fetchData();
      toast.success("Item removed successfully!", {
        position: "bottom-right",
      });
    } catch (err) {
      console.log("failed to remove item error:" + err);
      toast.error("Something went wrong!", {
        position: "bottom-right",
      });
    }
  };

  const customLocaleText = {
    noRowsLabel: "No data found!", // Change this to your desired message
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
      <Grid item xs={12}>
        <Grid item xs={12} sm={8} md={8}></Grid>
        <Grid item xs={12} sm={2} md={2} sx={{ float: "right", pb: 2 }}>
          <Button
            variant="contained"
            color="success"
            onClick={() => navigate("/admin/menu/add-item")}
          >
            Add New Item
          </Button>
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
                height: 600,
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
                rows={menuData}
                columns={columns}
                pageSize={5}
                rowHeight={90}
                rowsPerPageOptions={[8]}
                initialState={{
                  sorting: {
                    sortModel: [{ field: "Price", sort: "asc" }],
                  },
                }}
                localeText={customLocaleText}
              />
            </Box>
          )}
        </Grid>
      </Grid>
      <AddItemDialog open={open} onClose={handleClose} handleFunc={fetchData} />
      <UpdateItemDialog
        open={openUpdateDialog}
        onClose={handleCloseUpdateDialog}
        // handleFunc={fetchData}
        title="Update Item"
        // selectedData={selectedData}
        formValues={formValues}
        formik={formik}
      />
      <RemoveConfirmationDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        handleFunc={handleRemove}
        resetFunc={resetFunc}
        // currentId={currentId}
        title="Remove Item"
        desc="Are you sure to remove this item?"
      />
    </Grid>
  );
};

export default Menu;

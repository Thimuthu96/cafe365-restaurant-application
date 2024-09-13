import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoIosArrowBack } from "react-icons/io";
import {
  Grid,
  Button,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Form } from "react-bootstrap";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { toast } from "react-toastify";
import "../../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { ref, getDownloadURL, getStorage, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { collection, addDoc, query } from "firebase/firestore";
import { db } from "../../../services/firebase-config";
import { useNavigate } from "react-router-dom";

//components
import ConfirmationDialog from "../../../common/CustomDialog";

const AddItem = () => {
  const theme = createTheme({
    palette: {
      secondary: {
        main: "#0E9E52",
      },
    },
  });

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const dbRef = collection(db, "menu");
  const itemId = v4().slice(0, 5);

  const validationSchema = Yup.object().shape({
    selectedImage: Yup.mixed().required("Image is required"),
    category: Yup.string().required("Category is required"),
    itemName: Yup.string().required("Item Name is required"),
    itemPrice: Yup.number()
      .typeError("Item Price must be a number")
      .required("Item Price is required"),
  });

  const formik = useFormik({
    initialValues: {
      category: "",
      selectedImage: null,
      lastUploadedImage: null,
      itemName: "",
      itemPrice: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      try {
        handleAdd(values);
        // formik.resetForm();
      } catch (err) {
        console.log(`Something went wrong : ${err}`);
      }
    },
  });

  const handleAdd = (values) => {
    const data = {
      Id: `item${itemId}`,
      ItemImage: values.lastUploadedImage,
      Category: values.category,
      ItemName: values.itemName,
      Price: parseFloat(values.itemPrice, 10),
      Availability: true,
    };

    try {
      addDoc(dbRef, data);
      navigate("/admin/menu");
      toast.success("Item added successfully!", {
        position: "bottom-right",
      });
    } catch (err) {
      console.log("could not updated" + err);
      toast.error("Something went wrong!", {
        position: "bottom-right",
      });
    }
  };

  const handleImageSelect = (e) => {
    formik.setFieldValue("selectedImage", e.target.files[0]);
  };

  const handleImageUpload = () => {
    const selectedImage = formik.values.selectedImage;
    if (selectedImage) {
      const storage = getStorage();
      const storageRef = ref(storage, `images/${selectedImage.name + v4()}`);
      uploadBytes(storageRef, selectedImage)
        .then((snapshot) => {
          toast.success("Image uploaded successfully!", {
            position: "bottom-right",
          });
          getDownloadURL(storageRef).then((url) => {
            formik.setFieldValue("lastUploadedImage", url);
          });
        })
        .catch((error) => {
          toast.error("Something went wrong!", {
            position: "bottom-right",
          });
        });
    }
  };

  //open confirmation dialog
  const handleOpen = () => {
    setOpen(true);
  };

  //close confirmation dialog
  const handleClose = () => {
    setOpen(false);
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
        <Grid item xs={12} sm={2} md={2} sx={{ float: "left", pb: 2 }}>
          <Button
            variant="text"
            color="inherit"
            onClick={() => navigate("/admin/menu")}
          >
            <IoIosArrowBack fontSize={22} />
            Back to menu
          </Button>
        </Grid>
        <Grid item xs={12} sm={8} md={8}></Grid>
      </Grid>
      <Grid container sx={{ pl: 10, pt: 4 }}>
        <Grid item xs={12} sx={{ pb: 2 }}>
          <h3 style={{ color: "#0E9E52" }}>Add New Item</h3>
        </Grid>
        <Grid item xs={6}>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group controlId="formFile" className="mb-2 mt-4">
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
              />
              <Button onClick={handleImageUpload}>Upload</Button>
              {formik.errors.selectedImage && formik.touched.selectedImage && (
                <div style={{ color: "red" }}>
                  {formik.errors.selectedImage}
                </div>
              )}
            </Form.Group>
            {formik.values.lastUploadedImage && (
              <img
                src={formik.values.lastUploadedImage}
                alt="Last uploaded"
                style={{ height: "100px", width: "100px" }}
              />
            )}
            <FormControl sx={{ mt: 2, rowGap: "1.5em" }} fullWidth size="small">
              <InputLabel id="demo-select-small" color="success">
                Category
              </InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                name="category"
                value={formik.values.category}
                label="Category"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                color="success"
              >
                <MenuItem defaultValue disabled>
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Breakfast Menu">Breakfast Menu</MenuItem>
                <MenuItem value="Biriyani">Biriyani</MenuItem>
                <MenuItem value="Corporate Lunch Packs">
                  Corporate Lunch Packs
                </MenuItem>
                <MenuItem value="Kottu Station">Kottu Station</MenuItem>
                <MenuItem value="Soup">Soup</MenuItem>
                <MenuItem value="Desserts">Desserts</MenuItem>
                <MenuItem value="Appetizers">Appetizers</MenuItem>
              </Select>
              {formik.errors.category && formik.touched.category && (
                <div style={{ color: "red" }}>{formik.errors.category}</div>
              )}
              <TextField
                id="outlined-basic"
                name="itemName"
                label="Item Name"
                variant="outlined"
                size="small"
                color="success"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.itemName}
              />
              {formik.errors.itemName && formik.touched.itemName && (
                <div style={{ color: "red" }}>{formik.errors.itemName}</div>
              )}
              <TextField
                id="outlined-basic"
                name="itemPrice"
                label="Item Price ($)"
                variant="outlined"
                size="small"
                color="success"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.itemPrice}
              />
              {formik.errors.itemPrice && formik.touched.itemPrice && (
                <div style={{ color: "red" }}>{formik.errors.itemPrice}</div>
              )}
            </FormControl>
          </Form>
          <Grid item xs={12} sx={{ float: "right", pt: 10 }}>
            <Button
              color="success"
              sx={{ pl: 5, pr: 5 }}
              onClick={() => navigate("/admin/menu")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="success"
              sx={{ pl: 5, pr: 5 }}
              onClick={handleOpen}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <ConfirmationDialog
        open={open}
        onClose={handleClose}
        handleFunc={formik.handleSubmit}
        resetFunc={""}
        title="Add New Item!"
        desc="Are you sure to add this item?"
      />
    </Grid>
  );
};

export default AddItem;

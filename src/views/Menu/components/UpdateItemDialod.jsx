import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  TextField,
  Grid,
} from "@mui/material";
import { Form } from "react-bootstrap";
import "../../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { ref, getDownloadURL, getStorage, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

//components
import ConfirmationDialog from "../../../common/CustomDialog";

const UpdateItemDialog = (props) => {
  const { open, onClose, title, formik, formValues } = props;

  //STATES
  const [selectedImage, setSelectedImage] = useState("");
  const [lastUploadedImage, setLastUploadedImage] = useState(
    `${formValues?.ItemImage}`
  );
  const [category, setCategory] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  //select item category
  const handleChange = (event) => {
    const value = event.target.value;
    setCategory(value);
  };

  //select image to upload
  const handleImageSelect = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  //image upload into firebase
  const handleImageUpload = () => {
    if (selectedImage) {
      const storage = getStorage();
      const storageRef = ref(storage, `images/${selectedImage.name + v4()}`);
      uploadBytes(storageRef, selectedImage)
        .then((snapshot) => {
          toast.success("Image uploaded successfully!", {
            position: "bottom-right",
          });
          getDownloadURL(storageRef).then((url) => {
            setLastUploadedImage(url);
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
  const handleDialogOpen = () => {
    setDialogOpen(true);
    onClose();
  };

  //open confirmation dialog
  const handleClose = () => {
    setDialogOpen(false);
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            backgroundColor: "#0E9E52",
            color: "#fff",
            textAlign: "center",
          }}
        >
          {title}
        </DialogTitle>

        <form onSubmit={formik.handleSubmit}>
          <DialogContent sx={{ width: "500px" }}>
            {/* <Form.Group controlId="formFile" className="mb-2 mt-4">
              <Form.Control
                type="file"
                accept="image/*"
                // onChange={handleImageSelect}
                onChange={formik.handleChange}
              />
              <Button onClick={handleImageUpload}>Upload</Button>
            </Form.Group> */}
            <Grid container spacing={2}>
              <Grid item xs={4} sm={4} lg={4}></Grid>
              <Grid item xs={4} sm={4} lg={4}>
                {formValues?.ItemImage && (
                  <img
                    src={formValues?.ItemImage}
                    alt="Last uploaded"
                    style={{
                      height: "150px",
                      width: "150px",
                      borderRadius: "100%",
                    }}
                  />
                )}
              </Grid>
              <Grid item xs={4} sm={4} lg={4}></Grid>
            </Grid>
            {/* {imageUrls ? <img src={imageUrls} style={{ height: '100px', width: '100px' }} /> : <>aa</>} */}
            <FormControl sx={{ mt: 2, rowGap: "1.5em" }} fullWidth size="small">
              <InputLabel id="demo-select-small" color="success">
                Category
              </InputLabel>
              <Select
                labelId="demo-select-small"
                id="Category"
                label="Select Category"
                name="Category"
                defaultValue={formValues?.Category}
                onChange={formik.handleChange}
                value={formik.values.Category}
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
              <TextField
                id="ItemName"
                label="Item Name"
                name="ItemName"
                defaultValue={formValues?.ItemName}
                onChange={formik.handleChange}
                value={formik.values.ItemName}
                variant="outlined"
                size="small"
                color="success"
                required
              />
              <TextField
                id="Price"
                label="Item Price"
                name="Price"
                defaultValue={formValues?.Price}
                value={formik.values.Price}
                onChange={formik.handleChange}
                variant="outlined"
                size="small"
                color="success"
              />
            </FormControl>

            <DialogActions sx={{ mt: 10 }}>
              <Button onClick={onClose} color="success">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="success"
                onClick={onClose}
              >
                Submit
              </Button>
            </DialogActions>
          </DialogContent>
        </form>
      </Dialog>
      <ConfirmationDialog
        open={dialogOpen}
        onClose={handleClose}
        handleFunc={formik.handleSubmit}
        resetFunc={""}
        title="Update Item"
        desc="Are you sure to update this item?"
      />
    </>
  );
};

export default UpdateItemDialog;

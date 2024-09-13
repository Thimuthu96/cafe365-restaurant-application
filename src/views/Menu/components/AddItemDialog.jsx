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
  DialogContentText,
  CircularProgress,
} from "@mui/material";
import { Form } from "react-bootstrap";
import "../../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { ref, getDownloadURL, getStorage, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { collection, addDoc, query } from "firebase/firestore";
import { db } from "../../../services/firebase-config";

//components
import ConfirmationDialog from "../../../common/CustomDialog";

const AddItemDialog = (props) => {
  const { open, onClose, currentId, handleFunc } = props;
  const [category, setCategory] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [lastUploadedImage, setLastUploadedImage] = useState(null);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [isloading, setIsLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);

  // const imagesListRef = ref(storage, "images/");
  const dbRef = collection(db, "menu");
  const itemId = v4().slice(0, 5);
  const data = {
    // Id: currentId,
    Id: `item${itemId}`,
    ItemImage: lastUploadedImage,
    Category: category,
    ItemName: itemName,
    Price: parseFloat(itemPrice, 10),
  };

  //add item function
  const handleAdd = () => {
    try {
      addDoc(dbRef, data);
      toast.success("Item added successfully!", {
        position: "bottom-right",
      });
    } catch (err) {
      console.log("could not updated" + err);
      toast.error("Something went wrong!", {
        position: "bottom-right",
      });
    }
    handleFunc(); // retrieve updated menu data
  };

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
      setIsLoading(true);
      const storage = getStorage();
      const storageRef = ref(storage, `images/${selectedImage.name + v4()}`);
      uploadBytes(storageRef, selectedImage)
        .then((snapshot) => {
          // toast.loading('Image uploading!', {
          //     position: "bottom-right"
          // });
          toast.success("Image uploaded successfully!", {
            position: "bottom-right",
          });
          getDownloadURL(storageRef).then((url) => {
            setLastUploadedImage(url);
            setIsLoading(false);
          });
        })
        .catch((error) => {
          // toast.loading('Image uploading!', {
          //     position: "bottom-right"
          // });
          toast.error("Something went wrong!", {
            position: "bottom-right",
          });
          setIsLoading(false);
        });
    }
  };

  //open confirmation dialog
  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  //open confirmation dialog
  const handleClose = () => {
    setDialogOpen(false);
    onClose();
  };

  //Reset form data
  const handleResetForm = () => {
    setSelectedImage(null);
    setLastUploadedImage(null);
    setCategory("");
    setItemName("");
    setItemPrice("");
  };

  useEffect(() => {
    // console.log('*******Current Id Data pass******');
    // console.log(currentId);
    // console.log('*************');
  }, []);

  return (
    <>
      <Dialog
        open={open}
        keepMounted
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
          Add New Item
        </DialogTitle>
        <DialogContent sx={{ width: "500px" }}>
          <Form>
            <Form.Group controlId="formFile" className="mb-2 mt-4">
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
              />
              <Button onClick={handleImageUpload}>Upload</Button>
            </Form.Group>
            {/* {lastUploadedImage && (
              <img
                src={lastUploadedImage}
                alt="Last uploaded"
                style={{ height: "100px", width: "100px" }}
              />
            )} */}
            {lastUploadedImage != null || lastUploadedImage != "" ? (
              <div style={{ color: "red" }}>
                {isloading == true ? <CircularProgress /> : ""}
                <img
                  src={lastUploadedImage}
                  style={{ width: "100px", height: "100px" }}
                />
              </div>
            ) : (
              ""
            )}
            {/* {imageUrls ? <img src={imageUrls} style={{ height: '100px', width: '100px' }} /> : <>aa</>} */}
            <FormControl sx={{ mt: 2, rowGap: "1.5em" }} fullWidth size="small">
              <InputLabel id="demo-select-small" color="success">
                Category
              </InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={category}
                label="Category"
                onChange={handleChange}
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
                id="outlined-basic"
                label="Item Name"
                variant="outlined"
                size="small"
                color="success"
                onChange={(e) => setItemName(e.target.value)}
              />
              <TextField
                id="outlined-basic"
                label="Item Price"
                variant="outlined"
                size="small"
                color="success"
                onChange={(e) => setItemPrice(e.target.value)}
              />
            </FormControl>
          </Form>
        </DialogContent>
        <DialogActions sx={{ mt: 10 }}>
          <Button onClick={onClose} color="success">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleDialogOpen}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      {/* <ConfirmationDialog
        open={dialogOpen}
        onClose={handleClose}
        handleFunc={handleAdd}
        resetFunc={handleResetForm}
        title="Add Item"
        desc="Are you sure to add this item?"
      /> */}
      <Dialog
        open={dialogOpen}
        keepMounted
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Add Item</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure to add this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="success">
            Cancel
          </Button>
          <Button
            onClick={async () => {
              await handleAdd();
              handleClose();
              await handleResetForm();
            }}
            variant="contained"
            color="success"
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddItemDialog;

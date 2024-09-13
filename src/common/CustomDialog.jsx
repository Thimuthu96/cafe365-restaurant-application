import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  DialogContentText,
  Button,
} from "@mui/material";

const CustomDialog = (props) => {
  const { open, onClose, title, desc, handleFunc, resetFunc } = props;
  return (
    <Dialog
      open={open}
      keepMounted
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {desc}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="success">
          Cancel
        </Button>
        <Button
          onClick={() => {
            handleFunc();
            onClose();
            // resetFunc();
          }}
          variant="contained"
          color="success"
        >
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;

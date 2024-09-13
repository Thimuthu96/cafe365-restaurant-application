import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  DialogContentText,
  Button,
  Box,
} from "@mui/material";

const MobileOrderDetailsDialog = (props) => {
  const { open, onClose, title, data } = props;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      keepMounted
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        id="alert-dialog-title"
        style={{ textAlign: "center", color: "#0E9E52" }}
      >
        Cash On Delivery
        {/* {title} */}
      </DialogTitle>
      <DialogContent style={{ width: 600 }}>
        <div style={{ textAlign: "center" }}>
          <DialogContentText id="alert-dialog-description">
            <Box
              component="table"
              sx={{
                display: "flex",
                flexDirection: "column",
                m: "auto",
                width: "fit-content",
              }}
            >
              <table>
                <tr style={{ fontSize: "20px" }}>
                  <th style={{ padding: "15px" }}>Item Id</th>
                  <th style={{ padding: "15px" }}>Item Name</th>
                  <th style={{ padding: "15px" }}>Quantity</th>
                </tr>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td>{item.ItemId}</td>
                      <td style={{ padding: "12px" }}>{item.ItemName}</td>
                      <td>{item.Quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </DialogContentText>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="success">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MobileOrderDetailsDialog;

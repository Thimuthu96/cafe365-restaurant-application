import React, { useState, useEffect } from "react";
import { db } from "../services/firebase-config";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  DialogContentText,
  Button,
  Box,
  Grid,
} from "@mui/material";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { CiMail } from "react-icons/ci";

//logo
import Logo from "../assets/images/Logo.svg";
import CustomDialog from "./CustomDialog";

const TotalBill = (props) => {
  const { open, onClose, title, data, prices, docIds, callBack, totalBill } =
    props;

  const [billPrices, setBillPrices] = useState([]);
  const [billTotal, setBillTotal] = useState(0);
  const [openConfirmation, setOpenConfirmation] = useState(false);

  //open dialog
  const handleOpen = () => {
    setOpenConfirmation(true);
  };

  //close dialog
  const handleClose = () => {
    setOpenConfirmation(false);
  };

  //Bill generate function
  const handleGenerateBill = () => {
    setBillPrices(prices);
    let total = 0;

    for (let i = 0; i < prices.length; i++) {
      total += prices[i];
    }

    setBillTotal(total);
  };

  //Mark as paid
  const handlePaid = async () => {
    try {
      const updatePromises = docIds.map(async (documentId) => {
        const docRef = doc(db, "bill", documentId);
        const tableCollectionRef = collection(db, "table");

        const q = query(
          tableCollectionRef,
          where("TableNumber", "==", title[0])
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const tableDoc = querySnapshot.docs[0];
          const tableId = tableDoc.id;

          console.log(`The id of table id is ${tableId}`);

          // Update the "bill" document state to "Paid"
          const data = { State: "Paid" };
          await updateDoc(docRef, data);

          // Update the "table" document status to "available"
          const tableData = { Status: "available" };
          await updateDoc(doc(db, "table", tableId), tableData);

          return tableId;
        } else {
          console.log("No table found with the specified number");
          return null;
        }
      });

      await Promise.all(updatePromises);
      console.log("Data updated successfully!");
      onClose();
    } catch (err) {
      console.log("**********");
      console.log(`Something went wrong : ${err}`);
      console.log("**********");
    }
  };

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
          style={{ textAlign: "center", color: "#0E9E52", fontSize: "18px" }}
        >
          <img
            src={Logo}
            alt="Logo"
            style={{ width: "100px", height: "100px" }}
          />
          <br />
          <div
            style={{
              marginTop: "-10%",
              marginBottom: "-10%",
            }}
          >
            {/* <p
              style={{
                fontSize: "12px",
                color: "black",
                fontWeight: "normal",
                lineHeight: "120%",
              }}
            >
              No 123/A,
              <br />
              Hakmana road, Matara
              <br />
              Contact us: +9441 - 1111111
              <br />
              email: cafe365.workstuff@gmail.com
            </p> */}
          </div>
          <br />
          <hr />
          <span
            style={{
              background: "black",
              color: "white",
              fontSize: "18px",
              width: "400px",
              padding: "8px 150px",
              borderRadius: "15px",
            }}
          >
            Table: {title[0]}
          </span>
          <br />
        </DialogTitle>
        <div>
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
              <DialogContent sx={{ m: "auto", width: 400 }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <table>
                    <tr style={{ fontSize: "12px" }}>
                      <th style={{ textAlign: "left" }}>Item Name</th>
                      <th style={{ padding: "15px" }}>Quantity</th>
                      <th style={{ paddingLeft: "25px", textAlign: "right" }}>
                        Price
                      </th>
                    </tr>
                    <tbody style={{ fontSize: "12px" }}>
                      {data.map((item, index) => (
                        <tr key={index}>
                          <td style={{ textAlign: "left" }}>{item.ItemName}</td>
                          <td style={{ textAlign: "center", padding: "2px" }}>
                            {item.itemQuantity}
                          </td>
                          <td style={{ textAlign: "right" }}>{item.Price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {billTotal === 0 ? (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button onClick={handleGenerateBill}>Calculate bill</Button>
                  </div>
                ) : (
                  <span>
                    <h6
                      style={{
                        textAlign: "center",
                        justifyContent: "center",
                        paddingTop: "2em",
                      }}
                    >
                      Total Bill: {billTotal} LKR
                    </h6>
                    {/* <p
                      style={{
                        fontSize: "12px",
                        textAlign: "center",
                      }}
                    >
                      Savor, Pay, Repeat. Thank you for choosing us!
                    </p> */}
                  </span>
                )}
              </DialogContent>
            </Box>
          </DialogContentText>
        </div>
        <DialogActions>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Button variant="outlined" startIcon={<CiMail />}>
                Send Bill
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={() => {
                  setBillTotal(0);
                  onClose();
                }}
                variant="text"
                color="success"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setBillTotal(0);
                  onClose();
                  handleOpen();
                }}
                variant="contained"
                color="success"
              >
                Mark as paid
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
      <CustomDialog
        open={openConfirmation}
        onClose={handleClose}
        handleFunc={handlePaid}
        title="Payment Confirmation!"
        desc="Are you sure the payment for this order has been received?"
      />
    </>
  );
};

export default TotalBill;

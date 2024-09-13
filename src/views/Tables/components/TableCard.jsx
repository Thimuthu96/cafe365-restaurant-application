import React, { useState } from "react";
import { ButtonBase, Menu, MenuItem } from "@mui/material";
import { db } from "../../../services/firebase-config";
import { doc, updateDoc } from "firebase/firestore";

const TableCard = (props) => {
  const { id, status, tableNumber, handleFetchFunction } = props;
  const [anchorEl, setAnchorEl] = useState(null); // Correct destructuring

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //update table as available
  const handleAvailable = async () => {
    const docRef = doc(db, "table", id);
    const data = {
      Status: "available",
    };
    await updateDoc(docRef, data);
    handleClose();
    handleFetchFunction();
  };

  //update table as active
  const handleActive = async () => {
    const docRef = doc(db, "table", id);
    const data = {
      Status: "active",
    };
    await updateDoc(docRef, data);
    handleClose();
    handleFetchFunction();
  };

  let cardStyle = {};
  let tableNum = {};

  if (status === "available") {
    cardStyle = {
      backgroundColor: "#ffffff",
      border: "8px solid #0E9E52",
    };
    tableNum = {
      color: "#0E9E52",
    };
  } else if (status === "active") {
    cardStyle = {
      backgroundColor: "#0E9E52",
      border: "8px solid #0E9E52",
    };
    tableNum = {
      color: "#0E9E52",
    };
  } else if (status === "help") {
    cardStyle = {
      backgroundColor: "#F03300",
      border: "8px solid #F03300",
    };
    tableNum = {
      color: "#F03300",
    };
  }

  const renderMenuItems = () => {
    if (status === "available") {
      return null;
    } else if (status === "active") {
      return <MenuItem onClick={handleAvailable}>Set As Available</MenuItem>;
    } else if (status === "help") {
      return (
        <>
          <MenuItem onClick={handleAvailable}>Set As Available</MenuItem>
          <MenuItem onClick={handleActive}>Set As Active</MenuItem>
        </>
      );
    }
  };

  return (
    <>
      <ButtonBase onClick={handleClick}>
        <div className="card-style" style={cardStyle}>
          <div className="table-number">
            <h1 style={tableNum}>{tableNumber}</h1>
            <p>Table</p>
          </div>
        </div>
      </ButtonBase>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {renderMenuItems()}
      </Menu>
    </>
  );
};

export default TableCard;

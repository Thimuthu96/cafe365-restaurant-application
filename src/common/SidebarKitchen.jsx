import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { MdRestaurantMenu, MdPrint } from "react-icons/md";
import { GrRestaurant } from "react-icons/gr";
import { FiLogOut } from "react-icons/fi";
import { logout, auth } from "../services/firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";

//components
import Logo from "../assets/images/Logo.svg";
import Calender from "../assets/images/Calendar.svg";
import DateWidget from "./DateWidget";
import TimeWidget from "./TimeWidget";
import ConfirmationDialog from "./CustomDialog";

const SidebarKitchen = () => {
  const navLinksActive = ({ isActive }) => {
    return {
      color: isActive ? "#fff" : "#000",
      backgroundColor: isActive ? "#0E9E52" : "transparent",
    };
  };

  const [user, loading, error] = useAuthState(auth);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  //open confirmation dialog for logout
  const dialogOpen = () => {
    setOpen(true);
  };

  //close confirmation dialog for logout
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    // fetchUserName();
  }, [user, loading]);

  return (
    <div className="navbar-container">
      <div className="logo-img">
        <img src={Logo} alt="logo image" />
      </div>
      <div className="navigation-area">
        <NavLink style={navLinksActive} className="links" to="/kitchen">
          <FaShoppingCart />
          <Typography>Dining Orders</Typography>
        </NavLink>
        <NavLink
          style={navLinksActive}
          className="links"
          to="/kitchen/mobile-orders"
        >
          <FaShoppingCart />
          <Typography>Online Orders</Typography>
        </NavLink>
        <NavLink style={navLinksActive} className="links" to="/kitchen/menu">
          <MdRestaurantMenu />
          <Typography>Menu</Typography>
        </NavLink>
        {/* <NavLink style={navLinksActive} className="links" to="/process-bill">
          <MdPrint />
          <Typography>Billing</Typography>
        </NavLink> */}
        <hr />
        <NavLink style={navLinksActive} className="links" onClick={dialogOpen}>
          <FiLogOut />
          <Typography>LogOut</Typography>
        </NavLink>
      </div>
      <div className="calender-area">
        {/* <div className="calender">
          <img src={Calender} alt="calender" />
        </div>
        <div className="date-time">
          <DateWidget />
          <TimeWidget />
        </div> */}
      </div>
      <ConfirmationDialog
        open={open}
        onClose={handleClose}
        handleFunc={logout}
        resetFunc={""}
        title="LogOut!"
        desc="Are you sure you want to log out?"
      />
    </div>
  );
};

export default SidebarKitchen;

import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
} from "react-router-dom";
import { Box } from "@mui/material";
import { ToastContainer } from "react-toastify";

//components
import Sidebar from "../common/Sidebar";
import Menu from "../views/Menu/views/Menu";
import Orders from "../views/Orders/views/Orders";
import AddItem from "../views/Menu/views/AddItem";
import BillProcess from "../views/Billing/views/BillProcess";
import MobileAppDate from "../views/Orders/views/MobileOrders";
import SidebarKitchen from "../common/SidebarKitchen";
import MenuKitchen from "../views/Menu/views/MenuKitchen";
import OrdersKitchen from "../views/Orders/views/OrdersKitchen";
import MobielAppOrders from "../views/Orders/views/MobileOrders";
import MobielAppOrdersKitchen from "../views/Orders/views/MobileOrdersKitchen";
import Reports from "../views/Reports/view/reports";
import MonitorTables from "../views/Tables/views/MonitorTables";
import Login from "../views/Login/views/Login";

const AppRoutes = () => {
  const router = createBrowserRouter([
    {
      path: "/admin",
      element: <Layout />,

      children: [
        {
          path: "/admin",
          element: <MonitorTables />,
        },
        {
          path: "/admin/orders",
          element: <Orders />,
        },
        {
          path: "/admin/menu",
          element: <Menu />,
        },
        {
          path: "/admin/mobile-orders",
          element: <MobielAppOrders />,
        },
        {
          path: "/admin/process-bill",
          element: <BillProcess />,
        },
        {
          path: "/admin/menu/add-item",
          element: <AddItem />,
        },
        {
          path: "/admin/reports",
          element: <Reports />,
        },
      ],
    },
    {
      path: "/kitchen",
      element: <LayoutKitchen />,

      children: [
        {
          path: "/kitchen",
          element: <OrdersKitchen />,
        },
        {
          path: "/kitchen/menu",
          element: <MenuKitchen />,
        },
        {
          path: "/kitchen/mobile-orders",
          element: <MobielAppOrdersKitchen />,
        },
      ],
    },
    {
      path: "/",
      element: <Login />,
    },
  ]);
  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
};

function Layout() {
  return (
    <Box sx={{ display: "flex" }}>
      <Box>
        <Sidebar />
      </Box>
      <Box
        sx={{
          marginLeft: "250px",
          width: { sm: `calc(100% - 250px)` },
          backgroundColor: "#ffffff",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

function LayoutKitchen() {
  return (
    <Box sx={{ display: "flex" }}>
      <Box>
        <SidebarKitchen />
      </Box>
      <Box
        sx={{
          marginLeft: "250px",
          width: { sm: `calc(100% - 250px)` },
          backgroundColor: "#ffffff",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default AppRoutes;

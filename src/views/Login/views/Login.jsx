import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { db } from "../../../services/firebase-config";
import { toast } from "react-toastify";
import { collection, query, getDocs, where } from "firebase/firestore";
import {
  auth,
  logInWithEmailAndPassword,
} from "../../../services/firebase-config";

import LoginBanner from "../../../assets/images/LoginBanner.svg";
import Logo from "../../../assets/images/Logo.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);

  const theme = createTheme({
    palette: {
      secondary: {
        main: "#0E9E52",
      },
    },
  });

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) {
      if (localStorage.getItem("usrRole") === "Admin") {
        navigate("/admin");
      } else {
        navigate("/kitchen");
      }
    }
  }, [user, loading, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      toast.error("Please check your email and password again!", {
        position: "bottom-right",
      });
      return;
    }
    setIsLoading(true);
    try {
      const q = query(
        collection(db, "restaurent-user"),
        where("email", "==", email)
      );
      const querySnapshot = await getDocs(q);
      const list = [];

      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });

      if (list.length > 0) {
        const q2 = query(
          collection(db, "restaurent-usr-role"),
          where("usrUuid", "==", list[0].id)
        );
        const querySnapshot2 = await getDocs(q2);
        const list1 = [];

        querySnapshot2.forEach((doc) => {
          list1.push({ id: doc.id, ...doc.data() });
        });

        if (list1.length > 0) {
          localStorage.setItem("usrRole", list1[0].roleName);
          await logInWithEmailAndPassword(email, password);
        } else {
          toast.error("User role not found!", {
            position: "bottom-right",
          });
        }
      } else {
        toast.error("User could not be found!", {
          position: "bottom-right",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again later.", {
        position: "bottom-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#202020b3",
            zIndex: 9999,
          }}
        >
          <ThemeProvider theme={theme}>
            <CircularProgress color="secondary" />
          </ThemeProvider>
        </div>
      )}
      <Grid container style={{ minHeight: "100vh" }}>
        <Grid item xs={12} sm={6}>
          <img
            src={LoginBanner}
            alt="Chef"
            style={{ width: "100%", height: "100%", objectFit: "fill" }}
          />
        </Grid>
        <Grid xs={12} sm={2}></Grid>
        <Grid
          item
          xs={12}
          sm={4}
          alignItems="center"
          justifyContent="center"
          style={{ padding: 10 }}
        >
          <Paper
            elevation={0}
            style={{
              padding: 20,
              maxWidth: 400,
              width: "100%",
              height: "100%",
            }}
          >
            <Box display="flex" justifyContent="center" mb={1} mt={7}>
              <img
                src={Logo}
                alt="Cafe 365 Logo"
                style={{
                  width: 150,
                  height: 150,
                }}
              />
            </Box>
            <Box pb={4}>
              <Typography variant="h5" align="center">
                Welcome to Cafe365
              </Typography>
              <Typography variant="h6" align="center">
                Admin Portal
              </Typography>
            </Box>
            <Form onSubmit={handleLogin}>
              <Box pb={5}>
                <ThemeProvider theme={theme}>
                  <TextField
                    label="Email"
                    placeholder="Enter Email"
                    fullWidth
                    size="small"
                    required
                    margin="normal"
                    value={email}
                    color="secondary"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </ThemeProvider>
                <ThemeProvider theme={theme}>
                  <TextField
                    label="Password"
                    placeholder="Enter Password"
                    type="password"
                    fullWidth
                    size="small"
                    required
                    margin="normal"
                    value={password}
                    color="secondary"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </ThemeProvider>
              </Box>
              <ThemeProvider theme={theme}>
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  fullWidth
                  style={{ marginTop: 20 }}
                >
                  Sign In
                </Button>
              </ThemeProvider>
            </Form>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;

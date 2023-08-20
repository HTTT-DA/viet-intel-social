import FactCheckTwoToneIcon from "@mui/icons-material/FactCheckTwoTone";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Link,
  Snackbar,
  TextField,
  Typography
} from "@mui/material";
import React, { useState } from "react";
import { addRequestAccess } from "../../api-services/user";

export default function RegisterUseAPI() {
  const [error, setError] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = async (event) => {
    // Prevent default behavior
    event.preventDefault();
    setError(null);

    // TODO: Handle the form submission here
    // Get and validate data
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const reason = data.get("reason");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Invalid email format");
      return;
    }

    if (/\s/.test(email)) {
      setError("Email cannot contain spaces");
      return;
    }

    // API Call
    const newData = {
      email: email,
      reason: reason,
    };

    try {
      const response = await addRequestAccess(newData);

      if (response.status === 404) {
        setError("Invalid JSON format ! Please try again !");
      } else if (response.status === 400) {
        setError("You already send a request ! Please wait for admin to accept !");
      } else if (response.status === 200) {
        setSendSuccess(true);
        setOpenSnackbar(true);
      } else {
        setSendSuccess(false);
        setOpenSnackbar(true);
      }
    } catch(error) {
      console.error(error);
      setSendSuccess(false);
      setOpenSnackbar(true);
      return;
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <FactCheckTwoToneIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up For Using API
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="reason"
              label="Reason"
              name="reason"
              multiline
              rows={5}
              autoComplete="off"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            {error && (
              <Grid container justifyContent="center">
                <Grid item>
                  <Typography component="h4" variant="h10" color="error">
                    {error}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </Box>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 8, mb: 4 }}
        >
          {"Copyright © "}
          <Link color="inherit" href="/">
            VietIntel Social
          </Link>{" "}
          {new Date().getFullYear()}
          {"."}
        </Typography>
      </Container>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          severity={sendSuccess ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {sendSuccess
            ? "Add successfully !"
            : "Something went wrong ! Add failed !"}
        </Alert>
      </Snackbar>
    </>
  );
}

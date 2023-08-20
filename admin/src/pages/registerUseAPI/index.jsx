import FactCheckTwoToneIcon from "@mui/icons-material/FactCheckTwoTone";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

export default function RegisterUseAPI() {
  const [error, setError] = useState(false);

  const handleSubmit = (event) => {
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
  };

  return (
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
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
  );
}

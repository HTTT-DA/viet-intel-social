import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import bcrypt from "bcryptjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestLogin } from "../../api-services/user";

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    if (
      window.localStorage.getItem("userId") &&
      window.localStorage.getItem("email") &&
      window.localStorage.getItem("accessToken")
    ) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    // Prevent default behavior
    event.preventDefault();
    setError(null);
    
    // Get email and password from form
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Invalid email format");
      return;
    }

    if (/\s/.test(email)) {
      setError("Email cannot contain spaces");
      return;
    }

    // Hash password before sending to server
    const hash = bcrypt.hashSync(password, "$2a$10$SYxZJIAtGW0.wS06D.hPJe");

    const newData = {
      email: email,
      password: hash,
    };
    
    try {
      const response = await requestLogin(newData);
      console.log(response)
      if (response.status === 200) {
        window.localStorage.setItem("userId", response.data.id);
        window.localStorage.setItem("email", response.data.email);
        window.localStorage.setItem("username", response.data.display_name);
        window.localStorage.setItem("accessToken", response.data.access_token);
        window.localStorage.setItem("refreshToken", response.data.refresh_token);
        navigate("/");
      } else {
        setError("Email or password is incorrect ! Please try again !");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred during login. Please try again later.");
    } 
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
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
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
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container justifyContent="center">
            <Grid item>
              {error && (
                <Typography component="h4" variant="h10" color="error">
                  {error}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mt: 8, mb: 4 }}
      >
        {"Copyright © "}
        <Link color="inherit" href="https://mui.com/">
          VietIntel Social
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    </Container>
  );
}

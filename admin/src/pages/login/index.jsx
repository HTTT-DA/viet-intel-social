// import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
// import Avatar from "@mui/material/Avatar";
// import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
// import Container from "@mui/material/Container";
// import CssBaseline from "@mui/material/CssBaseline";
// import Link from "@mui/material/Link";
// import TextField from "@mui/material/TextField";
// import Typography from "@mui/material/Typography";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { requestLogin } from "@/api-services";

// export default function Login() {
//   const navigate = useNavigate();

//   console.log(import.meta.env.VITE_API_URL);

//   useEffect(() => {
//     if (
//       window.localStorage.getItem("userId") &&
//       window.localStorage.getItem("email") &&
//       window.localStorage.getItem("accessToken")
//     ) {
//       navigate("/");
//     }
//   }, [navigate]);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const data = new FormData(event.currentTarget);
//     console.log({
//       email: data.get("email"),
//       password: data.get("password"),
//     });

//     const res = await requestLogin()
//     if(res?.data) {
//       window.localStorage.setItem("userId", res.data.id);
//       window.localStorage.setItem("email", res.data.email);
//       window.localStorage.setItem("accessToken", res.data.accessToken);
//       navigate("/");
//     }
//   };

//   return (
//     <Container component="main" maxWidth="xs">
//       <CssBaseline />
//       <Box
//         sx={{
//           marginTop: 8,
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//         }}
//       >
//         <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
//           <LockOutlinedIcon />
//         </Avatar>
//         <Typography component="h1" variant="h5">
//           Sign in
//         </Typography>
//         <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             id="email"
//             label="Email Address"
//             name="email"
//             autoComplete="email"
//             autoFocus
//           />
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             name="password"
//             label="Password"
//             type="password"
//             id="password"
//             autoComplete="current-password"
//           />
//           <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             sx={{ mt: 3, mb: 2 }}
//           >
//             Sign In
//           </Button>
//         </Box>
//       </Box>
//       <Typography
//         variant="body2"
//         color="text.secondary"
//         align="center"
//         sx={{ mt: 8, mb: 4 }}
//       >
//         {"Copyright © "}
//         <Link color="inherit" href="https://mui.com/">
//           Your Website
//         </Link>{" "}
//         {new Date().getFullYear()}
//         {"."}
//       </Typography>
//     </Container>
//   );
// }

import { Container, Typography, Box } from "@mui/material";

const NotFound = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "90vh",
          textAlign: "center",
        }}
      >
        <Typography variant="h1" component="div" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" component="div" gutterBottom>
          Page Not Found
        </Typography>
      </Box>
    </Container>
  );
};

export default NotFound;

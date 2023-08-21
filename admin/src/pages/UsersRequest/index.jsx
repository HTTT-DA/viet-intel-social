import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import debounce from "lodash/debounce";
import { useEffect, useState } from "react";
import { getRequestAccess } from "../../api-services/user";
import TableRequest from "./components/TableRequest";

function UsersRequest() {
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getRequestAccess();

        if (response.status === 500) {
          setOpenSnackbar(true);
        } else {
          setRequests(response.data);
        }
      } catch (error) {
        setOpenSnackbar(true);
        console.error("Error fetching answers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  
  return (
    <div>
      <h1 style={{ color: "#243c64" }}>User Requests</h1>
      <Box bgcolor="#ffffff" padding={2} borderRadius={8} boxShadow={1}>
        <Box
          display="flex"
          justifyContent="space-between"
          marginBottom={1}
          marginTop={3}
          marginRight={13}
        >
          <Box display="flex" gap={2}>
            <TextField
              label="Search"
              style={{ width: "300px" }}
              variant="outlined"
              onChange={(event) => {
                const debounceFunc = debounce(() => {
                  event.preventDefault();
                  const {
                    target: { value: keyword },
                  } = event;
                  // call api search below here
                  console.log(keyword);
                }, 500);
                debounceFunc();
              }}
            />
            <FormControl style={{ width: "180px" }}>
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={status}
                label="Age"
                onChange={handleChange}
              >
                <MenuItem value={"WAITING"}>PENDING</MenuItem>
                <MenuItem value={"ACCEPTED"}>ACCEPTED</MenuItem>
                <MenuItem value={"ALL"}>ALL</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "auto",
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <TableRequest
              requests={requests}
              setRequests={setRequests}
            />
          )}
        </div>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity={"error"} sx={{ width: "100%" }}>
          {"Something went wrong ! Please try again !"}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default UsersRequest;

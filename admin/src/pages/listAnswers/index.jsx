import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import debounce from "lodash/debounce";
import { useEffect, useState } from "react";
import { getListAnswers } from "../../api-services/answer";
import TableAnswer from "./components/TableAnswer";

function ListAnswers() {
  const [answers, setAnswers] = useState([
    {
      id: 1,
      user: {
        username: "user1",
      },
      status: "pending",
    },
    {
      id: 2,
      user: {
        username: "user2",
      },
      status: "accepted",
    },
  ]);
  const [status, setStatus] = useState("");

  const handleChange = (event) => {
    setStatus(event.target.value);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getListAnswers();
        if (response.status === 200) {
          setAnswers(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 style={{ color: "#243c64" }}>Content Censorship</h1>
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
                <MenuItem value={"pending"}>PENDING</MenuItem>
                <MenuItem value={"accepted"}>ACCEPTED</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        <TableAnswer answers={answers} />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          marginTop={5}
        >
          <Stack spacing={2}>
            <Pagination count={10} shape="rounded" color="primary" />
          </Stack>
        </Box>
      </Box>
    </div>
  );
}

export default ListAnswers;

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import TableQuestion from "./components/TableQuestion";
import { getListQuestions } from "../../api-services";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import debounce from "lodash/debounce";

function ContentCensorShip() {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      user: {
        username: "user1",
      },
      category: {
        name: "category1",
      },
      status: "pending",
    },
    {
      id: 2,
      user: {
        username: "user2",
      },
      category: {
        name: "category2",
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
        const response = await getListQuestions();
        if (response.status === 200) {
          setQuestions(response.data);
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
          <Button
            variant="contained"
            color="primary"
            size="large"
            // onClick={handleAutoCheck}
          >
            AUTOMATIC CHECK
          </Button>
        </Box>
        <TableQuestion questions={questions} />
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

export default ContentCensorShip;

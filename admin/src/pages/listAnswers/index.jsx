import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Select from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import debounce from "lodash/debounce";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  countAnswersOfQuestion,
  getListAnswersOfQuestion,
} from "../../api-services/answer";
import { getUserByID } from "../../api-services/user";
import TableAnswer from "./components/TableAnswer";

function ListAnswers() {
  const [answers, setAnswers] = useState([]);
  const [status, setStatus] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const { questionId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const countResponse = await countAnswersOfQuestion(questionId);
        setTotalPages(Math.ceil(countResponse.data / 6));

        const response = await getListAnswersOfQuestion(
          currentPage,
          questionId
        );

        const updatedAnswers = await Promise.all(
          response.data.map(async (answer) => {
            try {
              const userResponse = await getUserByID(answer.user_id);
              const user = userResponse.data;

              return { ...answer, user };
            } catch (error) {
              console.error("Error fetching user:", error);
              return answer;
            }
          })
        );
        setAnswers(updatedAnswers);
      } catch (error) {
        setOpenSnackbar(true);
        console.error("Error fetching answers:", error);
      } finally {
        setLoading(false);
      }

    };
    fetchData();
  }, [currentPage, questionId]);

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  
  return (
    <div>
      <h1 style={{ color: "#243c64" }}>Content Censorship - Answers</h1>
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
            <TableAnswer answers={answers} questionId={questionId} />
          )}
        </div>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          marginTop={5}
        >
          <Stack spacing={2}>
            <Pagination
              count={totalPages}
              page={currentPage}
              shape="rounded"
              color="primary"
              onChange={handlePageChange}
              boundaryCount={2} // Số lượng trang hiển thị ở hai đầu
              showFirstButton
              showLastButton
            />
          </Stack>
        </Box>
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

export default ListAnswers;

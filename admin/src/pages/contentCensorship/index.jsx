import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
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
import { getCategoryByID } from "../../api-services/category";
import { countQuestions, getListQuestions, automaticCensorQuestions } from "../../api-services/question";
import { automaticCensorAnswers } from "../../api-services/answer";
import { getUserByID } from "../../api-services/user";
import TableQuestion from "./components/TableQuestion";

function ContentCensorShip() {
  const [questions, setQuestions] = useState([]);
  const [status, setStatus] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const countResponse = await countQuestions();
        setTotalPages(Math.ceil(countResponse.data / 6));

        const response = await getListQuestions(currentPage);

        // Tạo mảng promises cho việc gọi API getCategoryByID và getUserByID
        const promises = response.data.map(async (question) => {
          const categoryPromise = getCategoryByID(question.category_id);
          const userPromise = getUserByID(question.user_id);

          // Sử dụng Promise.all để đợi tất cả các promise hoàn thành
          const [category, user] = await Promise.all([
            categoryPromise,
            userPromise,
          ]);
          // Gắn thông tin category và user vào câu hỏi
          question.category = category.data;
          question.user = user.data;

          return question;
        });

        const updatedQuestions = await Promise.all(promises);

        if (updatedQuestions) {
          // Thay thế response bằng updatedQuestions
          setQuestions(updatedQuestions);
        }
      } catch (error) {
        setOpenSnackbar(true);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage]);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleChange = (event) => {
    setStatus(event.target.value);
  };
  
  const handleAutoCheck = async () => {
    try {
      const answerResponse = await automaticCensorAnswers();
      const questionResponse = await automaticCensorQuestions();
      console.log(answerResponse, questionResponse)
      if (answerResponse.status === 500 || questionResponse.status === 500) {
        setOpenSnackbar(true);
      }
      if (answerResponse.status === 200 && questionResponse.status === 200) {
        window.location.href = "/content-censorship";
      }
    } catch (error) {
      setOpenSnackbar(true);
      console.error(error);
    }
}

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
                <MenuItem value={"WAITING"}>PENDING</MenuItem>
                <MenuItem value={"ACCEPTED"}>ACCEPTED</MenuItem>
                <MenuItem value={"ALL"}>ALL</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleAutoCheck}
          >
            <b>AUTOMATIC CHECK</b>
          </Button>
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
            <TableQuestion questions={questions} />
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

export default ContentCensorShip;

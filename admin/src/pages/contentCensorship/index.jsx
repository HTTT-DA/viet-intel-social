import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import TableQuestion from "./components/TableQuestion";
import { getListQuestions } from "../../api-services/question";
import { getCategoryByID } from "../../api-services/category";
import { getUserByID } from "../../api-services/user";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import debounce from "lodash/debounce";

function ContentCensorShip() {
  const [questions, setQuestions] = useState([]);
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleChange = (event) => {
    setStatus(event.target.value);
  };
  
useEffect(() => {
  const fetchData = async () => {
    try {
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

      // Đợi tất cả các promise hoàn thành và set lại danh sách câu hỏi
      const updatedQuestions = await Promise.all(promises);

      if (updatedQuestions) {
        // Thay thế response bằng updatedQuestions
        setQuestions(updatedQuestions);
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
                <MenuItem value={"WAITING"}>PENDING</MenuItem>
                <MenuItem value={"ACCEPTED"}>ACCEPTED</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Button
            variant="contained"
            color="primary"
            size="large"
            // onClick={handleAutoCheck}
          >
            <b>AUTOMATIC CHECK</b>
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

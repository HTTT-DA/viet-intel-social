import { getListCategories } from "@/api-services/index";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from '@mui/material/CssBaseline';
import Button from "@mui/material/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

import { useEffect, useState } from "react";

const handleDeleteRow = (id) => {
  
};

const handleAddRow = () => {

};

function Category() {
  const [categories, setCategories] = useState([]);

  console.log(import.meta.env.VITE_API_URL);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getListCategories();
        console.log(response)
        setCategories(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);


  return (
    <div>
      <h1 style={{ color: "#243c64" }}>Category</h1>
      <Box bgcolor="#ffffff" padding={2} borderRadius={8} boxShadow={1}>
        <Box
          display="flex"
          justifyContent="flex-end"
          marginBottom={1}
          marginTop={3}
          marginRight={13}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            endIcon={<AddCircleIcon />}
          >
            Add
          </Button>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>ID</b>
              </TableCell>
              <TableCell style={{ paddingLeft: "300px" }}>
                <b>Name</b>
              </TableCell>
              <TableCell style={{ paddingLeft: "60px" }}>
                <b>Status</b>
              </TableCell>
              <TableCell style={{ paddingLeft: "60px" }}></TableCell>
              {/* Thêm các tiêu đề cột khác */}
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.id}</TableCell>
                <TableCell style={{ paddingLeft: "300px" }}>
                  {category.isDeleted ? (
                    <i>{category.name}</i>
                  ) : (
                    <b>{category.name}</b>
                  )}
                </TableCell>
                <TableCell style={{ paddingLeft: "60px" }}>
                  {category.isDeleted ? <i>Inactive</i> : <b>Active</b>}
                </TableCell>
                <TableCell style={{ paddingLeft: "60px" }}>
                  <Button
                    variant="outlined"
                    color="error"
                    disabled={category.isDeleted}
                    onClick={() => handleDeleteRow(category.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
                {/* Thêm các ô dữ liệu cho các cột khác */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
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

export default Category;

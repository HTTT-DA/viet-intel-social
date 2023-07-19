import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import { getListCategories } from "@/api-services/index";


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
      <h1>Category</h1>
      <Box display="flex" justifyContent="center">
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Is Deleted</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.isDeleted ? "Yes" : "No"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </div>
  );
}

export default Category;

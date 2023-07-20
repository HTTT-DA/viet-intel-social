import { getListCategories, deleteCategory } from "@/api-services/index";
import CategoryList from "./components/categoryList";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";

const Category = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getListCategories();
        setCategories(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [categories]);

  const handleDeleteRow = async (id) => {
    try {
      const result = await deleteCategory(id);

      // Nếu chỉnh sửa thành công, cập nhật lại state categories
      if (result) {
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.id === id ? { ...category, is_deleted: true } : category
          )
        );
      } else {
        console.log("Chỉnh sửa không thành công!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddRow = () => {
    // Xử lý thêm category, có thể gọi API để thêm category trên server
    // Sau khi thêm thành công, cập nhật lại state categories
  };

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
            onClick={handleAddRow}
          >
            Add
          </Button>
        </Box>
        <CategoryList
          categories={categories}
          handleDeleteRow={handleDeleteRow}
        />
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
};

export default Category;

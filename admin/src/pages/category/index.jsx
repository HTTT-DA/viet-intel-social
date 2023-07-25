import { deleteCategory, getListCategories } from "@/api-services/index";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import CategoryList from "./components/categoryList";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [nameError, setNameError] = useState("");
  
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

  const handleAddButton = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNameError(""); // Clear the nameError when closing the dialog
  };

  const handleSaveCategory = () => {
    // Validate the input
    if (newCategoryName.length === 0) {
      setNameError("Category name is required");
    } else if (newCategoryName.length > 30) {
      setNameError("Category name must be less than 30 characters");
    } else if (
      /\d/.test(newCategoryName) ||
      /[!@#$%^&*(),.?":{}|<>]/.test(newCategoryName) ||
      /[áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựíìỉĩịýỳỷỹỵÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÍÌỈĨỊÝỲỶỸỴ]/.test(
        newCategoryName
      )
    ) {
      setNameError(
        "Category name cannot contain numbers, special characters, or Vietnamese diacritics"
      );
    } else {
      // Perform the add category action here, e.g., call API to add the category to the database
      console.log("Category added:", newCategoryName);
      // Clear the input field and error message
      setNewCategoryName("");
      setNameError("");
      setOpenDialog(false);
    }
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
            onClick={handleAddButton}
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

      {/* Form Dialogs */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          <b>Add New Category</b>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the name of the new Category:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            fullWidth
            variant="standard"
            error={Boolean(nameError)}
            helperText={nameError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            <b>Cancel</b>
          </Button>
          <Button onClick={handleSaveCategory} color="primary">
            <b>Save</b>
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Category;

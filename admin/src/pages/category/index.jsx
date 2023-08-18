import {
  addNewCategory,
  checkIsExisted,
  countCategories,
  getListCategories,
} from "@/api-services/category";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Pagination from "@mui/material/Pagination";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import CategoryList from "./components/categoryList";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isAddSuccess, setIsAddSuccess] = useState(false);
  const [nameError, setNameError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const countResponse = await countCategories();
        setTotalPages(Math.ceil(countResponse.data / 6));
        
        const response = await getListCategories(currentPage);
        setCategories(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [currentPage]);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleAddButton = () => {
    setOpenDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenDialog(false);
    setNameError(""); // Clear the nameError when closing the dialog
  };

  const handleSaveCategory = async () => {
    // Validate the input
    const categoryExist = await checkIsExisted(newCategoryName);

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
    } else if (categoryExist.isExisted) {
      setNameError("Category name is already existed");
    } else {
      // Perform the add category action here, e.g., call API to add the category to the database
      const data = {
        categoryName: newCategoryName.trim(),
      };

      try {
        // Call the handleAddCategory function to add the new category
        const newCategory = await addNewCategory(data);

        if (newCategory) {
          // Nếu add thành công
          setIsAddSuccess(true);
          setOpenSnackbar(true);
        } else {
          // Nếu add không thành công
          setIsAddSuccess(false);
          setOpenSnackbar(true);
        }
      } catch (error) {
        console.error(error);
      }

      // Clear the input field and error message
      setNewCategoryName("");
      setNameError("");
      setOpenDialog(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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
        <CategoryList categories={categories} setCategories={setCategories} />
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

      {/* Form Dialogs */}
      <Dialog open={openDialog} onClose={handleCloseAddDialog}>
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
          <Button onClick={handleCloseAddDialog} color="primary">
            <b>Cancel</b>
          </Button>
          <Button onClick={handleSaveCategory} color="primary">
            <b>Save</b>
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          severity={isAddSuccess ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {isAddSuccess
            ? "Add successfully !"
            : "Something went wrong ! Add failed !"}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Category;

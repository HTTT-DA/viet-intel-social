import { deleteCategory } from "@/api-services/category";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";

import PropTypes from "prop-types";

const CategoryList = ({ categories, setCategories }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [nameCategory, setNameCategory] = useState("");
  const [idCategory, setIDCategory] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);

  const handleDeleteCategory = async (id) => {
    try {
      const result = await deleteCategory(id);
      if (result) {
        setIsDeleteSuccess(true);
        setOpenSnackbar(true);
        // Cập nhật lại danh sách categories trong CategoryList
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.id === id ? { ...category, isDeleted: true } : category
          )
        );
      } else {
        setIsDeleteSuccess(false);
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleDeleteButton = (id, name) => {
    setIDCategory(id);
    setNameCategory(name);
    setOpenDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = () => {
    handleDeleteCategory(idCategory);
    setOpenDialog(false);
  };

  return (
    <div>
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
                  onClick={() => {
                    handleDeleteButton(category.id, category.name);
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Form Dialogs */}
      <Dialog open={openDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>
          <b>Delete Category</b>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure to delete category <b>{nameCategory}</b>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            <b>Cancel</b>
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            <b>Delete</b>
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          severity={isDeleteSuccess ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {isDeleteSuccess
            ? "Delete successfully !"
            : "Something went wrong ! Delete failed !"}
        </Alert>
      </Snackbar>
    </div>
  );
};

CategoryList.propTypes = {
  categories: PropTypes.array,
  setCategories: PropTypes.func.isRequired,
};

CategoryList.defaultProps = {
  categories: [],
};

export default CategoryList;

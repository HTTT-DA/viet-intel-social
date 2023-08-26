import { deleteTag } from "@/api-services/question";
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

const TagList = ({ tags, setTags }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [nameTag, setNameTag] = useState("");
  const [idTag, setIDTag] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);

  const handleDeleteTag = async (id) => {
    try {
      const result = await deleteTag(id);
      if (result) {
        setIsDeleteSuccess(true);
        setOpenSnackbar(true);
        // Cập nhật lại danh sách tags trong TagList
        setTags((prevTags) => prevTags.filter((tag) => tag.id !== id));
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
    setIDTag(id);
    setNameTag(name);
    setOpenDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = () => {
    handleDeleteTag(idTag);
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
            <TableCell style={{ paddingLeft: "60px" }}></TableCell>
            {/* Thêm các tiêu đề cột khác */}
          </TableRow>
        </TableHead>
        <TableBody>
          {tags.map((tag) => (
            <TableRow key={tag.id}>
              <TableCell>{tag.id}</TableCell>
              <TableCell style={{ paddingLeft: "300px" }}>{tag.name}</TableCell>
              <TableCell style={{ paddingLeft: "60px" }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    handleDeleteButton(tag.id, tag.name);
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
          <b>Delete Tag</b>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure to delete tag <b>{nameTag}</b>
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

TagList.propTypes = {
  tags: PropTypes.array,
  setTags: PropTypes.func.isRequired,
};

TagList.defaultProps = {
  tags: [],
};

export default TagList;

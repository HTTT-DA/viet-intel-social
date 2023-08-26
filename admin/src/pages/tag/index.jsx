import {
  createTag,
  findTag,
  getListTag,
} from "@/api-services/question";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import TagList from "./components/tagList";

const Tag = () => {
  const [tags, setTags] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isAddSuccess, setIsAddSuccess] = useState(false);
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getListTag();
        setTags(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleAddButton = () => {
    setOpenDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenDialog(false);
    setNameError(""); // Clear the nameError when closing the dialog
  };

  const handleSaveTag = async () => {
    // Validate the input
    const tagExist = await findTag(newTagName);
    if (newTagName.length === 0) {
      setNameError("Tag name is required");
    } else if (newTagName.length > 30) {
      setNameError("Tag name must be less than 30 characters");
    } else if (
      /\d/.test(newTagName) ||
      /[!@#$%^&*(),.?":{}|<>]/.test(newTagName) ||
      /[áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựíìỉĩịýỳỷỹỵÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÍÌỈĨỊÝỲỶỸỴ]/.test(
        newTagName
      )
    ) {
      setNameError(
        "Tag name cannot contain numbers, special characters, or Vietnamese diacritics"
      );
    } else if (tagExist.isExisted) {
      setNameError("Tag name is already existed");
    } else {
      // Perform the add tag action here, e.g., call API to add the tag to the database
      const data = {
        tagName: newTagName.trim(),
      };

      try {
        // Call the handleAddTag function to add the new tag
        const newTag = await createTag(data);

        if (newTag) {
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
      setNewTagName("");
      setNameError("");
      setOpenDialog(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      <h1 style={{ color: "#243c64" }}>Tag</h1>
      <Box bgcolor="#ffffff" padding={2} borderRadius={8} boxShadow={1}>
        <Box
          display="flex"
          justifyContent="flex-end"
          marginBottom={1}
          marginTop={3}
          marginRight={21}
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
        <TagList tags={tags} setTags={setTags} />
      </Box>

      {/* Form Dialogs */}
      <Dialog open={openDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>
          <b>Add New Tag</b>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the name of the new Tag:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Tag Name"
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
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
          <Button onClick={handleSaveTag} color="primary">
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

export default Tag;

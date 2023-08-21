import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import PropTypes from "prop-types";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import dayjs from "dayjs";
import { useState } from "react";
import { declineRequestAccess, acceptRequestAccess } from "../../../api-services/user";

const TableRequest = ({ requests, setRequests }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [idRequest, setIDRequest] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const handleDecline = async (requestId) => {
    try {
      const response = await declineRequestAccess(requestId);
      if (response.status === 200) {
        setIsSuccess(true);
        setSuccessMessage("Declined successfully !");
        setOpenSnackbar(true);
        const updatedRequests = requests.filter(
          (request) => request.id !== requestId
        );
        setRequests(updatedRequests);
      } else {
        setIsSuccess(false);
        setErrorMessage("Something went wrong ! Accepted Failed !");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setIsSuccess(false);
      setErrorMessage("Something went wrong ! Call API Failed !");
      setOpenSnackbar(true);
      console.error("Error fetching answers:", error);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      const response = await acceptRequestAccess(requestId);
      console.log(response)
      if (response.status === 200) {
        setIsSuccess(true);
        setSuccessMessage("Accepted successfully !");
        setOpenSnackbar(true);
        const updatedRequests = requests.map((request) => {
          if (request.id === requestId) {
            return { ...request, status: "ACCEPTED" };
          }
          return request;
        });
        setRequests(updatedRequests);
      } else {
        setIsSuccess(false);
        setErrorMessage("Something went wrong ! Accepted Failed !");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setIsSuccess(false);
      setErrorMessage("Something went wrong ! Call API Failed !");
      setOpenSnackbar(true);
      console.error("Error fetching answers:", error);
    }
  }

  const handleDeclineButton = (id, mail) => {
    setIDRequest(id);
    setUserEmail(mail);
    setOpenDialog(true);
  };

  const handleCloseDeclineDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmDecline = () => {
    handleDecline(idRequest);
    setOpenDialog(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <b>ID</b>
            </TableCell>
            <TableCell>
              <b>User</b>
            </TableCell>
            <TableCell>
              <b>Status</b>
            </TableCell>
            <TableCell>
              <b>Requested At</b>
            </TableCell>
            <TableCell>
              <b>Reason</b>
            </TableCell>
            <TableCell style={{ paddingLeft: "100px" }}></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.id}</TableCell>
              <TableCell>{request.user_email}</TableCell>
              <TableCell>
                {request.status === "PENDING" ? (
                  <Chip color="error" label={<b>PENDING</b>} />
                ) : (
                  <Chip color="success" label={<b>ACCEPTED</b>} />
                )}
              </TableCell>
              <TableCell>
                {dayjs(request?.requested_at).format("DD/MM/YYYY HH:mm:ss")}
              </TableCell>
              <TableCell
                style={{
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                }}
              >
                {request.reason}
              </TableCell>
              <TableCell style={{ paddingLeft: "100px" }}>
                <Button
                  variant="contained"
                  color="success"
                  disabled={request.status === "ACCEPTED"}
                  onClick={() => {
                    handleAccept(request.id);
                  }}
                >
                  <b>ACCEPT</b>
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="error"
                  disabled={request.status === "ACCEPTED"}
                  onClick={() => {
                    handleDeclineButton(request.id, request.user_email);
                  }}
                >
                  <b>DECLINE</b>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Form Dialogs */}
      <Dialog open={openDialog} onClose={handleCloseDeclineDialog}>
        <DialogTitle>
          <b>Decline Request</b>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure to decline this request {userEmail}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeclineDialog} color="primary">
            <b>Cancel</b>
          </Button>
          <Button onClick={handleConfirmDecline} color="error">
            <b>Decline</b>
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          severity={isSuccess ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {isSuccess ? successMessage : errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

TableRequest.propTypes = {
  requests: PropTypes.array,
  setRequests: PropTypes.func.isRequired,
};

TableRequest.defaultProps = {
  requests: [],
};

export default TableRequest;

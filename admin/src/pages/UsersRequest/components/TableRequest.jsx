import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import PropTypes from "prop-types";
import Chip from "@mui/material/Chip";
import dayjs from "dayjs";

function TableRequest({ requests, onAccept, onDecline }) {
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
                  onClick={() => onAccept(request.id)}
                >
                  <b>ACCEPT</b>
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="error"
                  disabled={request.status === "ACCEPTED"}
                  onClick={() => onDecline(request.id)}
                >
                  <b>DECLINE</b>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

TableRequest.propTypes = {
  requests: PropTypes.array,
  onAccept: PropTypes.func,
  onDecline: PropTypes.func,
};

TableRequest.defaultProps = {
  requests: [],
};

export default TableRequest;

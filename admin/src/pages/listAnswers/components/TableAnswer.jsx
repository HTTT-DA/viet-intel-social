import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import PropTypes from "prop-types";
import Chip from "@mui/material/Chip";

function TableAnswer({ answers }) {
  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <b>ID</b>
            </TableCell>
            <TableCell style={{ paddingLeft: "200px" }}>
              <b>User</b>
            </TableCell>
            <TableCell style={{ paddingLeft: "60px" }}>
              <b>Status</b>
            </TableCell>
            <TableCell style={{ paddingLeft: "60px" }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {answers.map((answer) => (
            <TableRow key={answer.id}>
              <TableCell>{answer.id}</TableCell>
              <TableCell style={{ paddingLeft: "200px" }}>
                {answer.user.username}
              </TableCell>
              <TableCell style={{ paddingLeft: "60px" }}>
                {answer.status === "pending" ? (
                  <Chip color="error" label="PENDING" />
                ) : (
                  <Chip color="success" label="ACCEPTED" />
                )}
              </TableCell>
              <TableCell style={{ paddingLeft: "60px" }}>
                <Button
                  href={`/content-censorship/answer/${answer.id}`}
                  variant="plain"
                >
                  DETAILS
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

TableAnswer.propTypes = {
  answers: PropTypes.array,
};

TableAnswer.defaultProps = {
  answers: [],
};

export default TableAnswer;

import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import PropTypes from "prop-types";
import Chip from "@mui/material/Chip";
import { Link } from "react-router-dom";

function TableAnswer({ answers, questionId }) {
  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <b>ID</b>
            </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell style={{ paddingLeft: "300px" }}>
              <b>User</b>
            </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell style={{ paddingLeft: "200px" }}>
              <b>Status</b>
            </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell style={{ paddingLeft: "100px" }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {answers.map((answer) => (
            <TableRow key={answer.id}>
              <TableCell>{answer.id}</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell style={{ paddingLeft: "300px" }}>
                {answer.user.email}
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell style={{ paddingLeft: "200px" }}>
                {answer.status === "WAITING" ? (
                  <Chip color="error" label={<b>PENDING</b>} />
                ) : (
                  <Chip color="success" label={<b>ACCEPTED</b>} />
                )}
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell style={{ paddingLeft: "100px" }}>
                <Link
                  to={`/content-censorship/answer/${answer.id}?questionId=${questionId}`}
                  style={{ textDecoration: "none" }}
                >
                  <Button variant="plain" sx={{ color: "blue" }}>
                    <b>DETAILS</b>
                  </Button>
                </Link>
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
  questionId: PropTypes.string.isRequired,
};

TableAnswer.defaultProps = {
  answers: [],
};

export default TableAnswer;

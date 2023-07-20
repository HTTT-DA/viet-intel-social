import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import PropTypes from "prop-types";

const CategoryList = ({ categories, handleDeleteRow }) => {
  return (
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
                onClick={() => handleDeleteRow(category.id)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

CategoryList.propTypes = {
  categories: PropTypes.array,
  handleDeleteRow: PropTypes.func.isRequired,
};

CategoryList.defaultProps = {
  categories: [],
};

export default CategoryList;

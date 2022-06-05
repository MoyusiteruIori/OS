import * as React from "react";
import {
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
} from "@mui/material";

const columns = [
  { id: "pageNum", label: "页号", minWidth: 170 },
  { id: "address", label: "地址", minWidth: 100 },
  {
    id: "nextAddress",
    label: "下一地址",
    minWidth: 170,
    align: "center",
  },
  {
    id: "status",
    label: "状态",
    minWidth: 170,
    align: "center",
  },
];

export default function InstructionTable(props) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%" }}>
      <TableContainer sx={{ maxHeight: 300 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={5} rowSpan={1}>
                地址空间
              </TableCell>
            </TableRow>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ top: 57, minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === "status" ? (
                            <Button variant="outlined">
                              <Typography
                                color={
                                  column.id === "status"
                                    ? value === "未执行"
                                      ? "red"
                                      : "green"
                                    : ""
                                }
                              >
                                {value}
                              </Typography>
                            </Button>
                          ) : (
                            <Typography
                              color={
                                column.id === "status"
                                  ? value === "未执行"
                                    ? "red"
                                    : "green"
                                  : ""
                              }
                            >
                              {value}
                            </Typography>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={props.rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

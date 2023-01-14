import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { SortDirection } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableHeader } from "../types/table";
import TableSortLabel from "@mui/material/TableSortLabel";
import { Box, Pagination, Typography } from "@mui/material";

type Props = {
  headers: TableHeader[];
  isExpandable?: boolean;
  children: React.ReactNode;
  pages?: number;
  currentPage?: number;
  setPage?: (page: number) => void;
  rowsPerPage?: number;
  onRowsPerPageChange?: (event?: React.ChangeEvent<HTMLInputElement>) => void;
  order?: SortDirection;
  orderBy?: string;
  onSortRequest?: (property: string) => void;
};

const CollapsibleTable: React.FC<Props> = ({
  headers,
  children,
  isExpandable = false,
  pages = 1,
  currentPage = 1,
  setPage = () => {},
  order = "asc",
  orderBy,
  onSortRequest = (property: string) => {},
}) => {
  const createSortHandler = (property: string) => () => {
    onSortRequest(property);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              {isExpandable && <TableCell />}
              {headers.map((header) => (
                <TableCell
                  key={header.text}
                  align={header.align}
                  sortDirection={header.sortable && orderBy === header.id ? order : false}
                >
                  {header.sortable ? (
                    <TableSortLabel
                      active={orderBy === header.id}
                      direction={orderBy === header.id ? (order as Order) : "asc"}
                      onClick={createSortHandler(header.id)}
                    >
                      <Typography fontWeight="bold">{header.text}</Typography>
                    </TableSortLabel>
                  ) : (
                    <Typography fontWeight="bold">{header.text}</Typography>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{children}</TableBody>
        </Table>
      </TableContainer>
      {!!pages && !!currentPage && pages > 1 && (
        <Box display="flex" padding="20px" justifyContent="center">
          <Pagination
            count={pages}
            showFirstButton={currentPage !== 1}
            hidePrevButton={currentPage === 1}
            showLastButton={currentPage !== pages}
            hideNextButton={currentPage === pages}
            onChange={(event, page) => setPage(page)}
          />
        </Box>
      )}
    </>
  );
};

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

export function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default CollapsibleTable;

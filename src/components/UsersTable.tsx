import React, { useState, useEffect } from "react";
import axios from "axios";
import Table, { getComparator, stableSort } from "./Table";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Address, User } from "../types/user";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import { TableCell } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { TableHeader } from "../types/table";
import SearchInput from "./SearchInput";

const usersPerPage = 10;
const url = "https://random-data-api.com/api/v2/users";

const getUsers = (size: number = 10) => axios.get<User[]>(`${url}?size=${size}`);

const tableHeaders: TableHeader[] = [
  {
    id: "id",
    text: "ID",
    align: "left",
    numeric: true,
    sortable: true,
  },
  {
    id: "avatar",
    text: "Avatar",
    align: "center",
    numeric: false,
    sortable: false,
  },
  {
    id: "name",
    text: "Name",
    align: "left",
    numeric: false,
    sortable: true,
  },
  {
    id: "username",
    text: "Username",
    align: "left",
    numeric: false,
    sortable: true,
  },
  {
    id: "email",
    text: "Email",
    align: "right",
    numeric: false,
    sortable: true,
  },
];

const addressHeaders: TableHeader[] = [
  {
    id: "street",
    text: "Street",
    align: "left",
  },
  {
    id: "city",
    text: "City",
    align: "left",
  },
  {
    id: "state",
    text: "State",
    align: "left",
  },
  {
    id: "country",
    text: "Country",
    align: "left",
  },
  {
    id: "zip",
    text: "Zip",
    align: "right",
  },
];

const UserRow = ({ user }: { user: User }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {user.id}
        </TableCell>
        <TableCell>
          <div className="flex items-center justify-center">
            <Avatar sx={{ width: 56, height: 56 }} alt={`${user.first_name} Avatar`} src={user.avatar} />
          </div>
        </TableCell>
        <TableCell align="left">
          {user.first_name} {user.last_name}
        </TableCell>
        <TableCell align="left">{user.username}</TableCell>
        <TableCell align="right">{user.email}</TableCell>
      </TableRow>
      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
        <TableCell colSpan={tableHeaders.length + 1} sx={{ paddingTop: 0, paddingBottom: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box marginTop="30px" marginBottom="30px">
              <Typography variant="h6" fontWeight="bold" marginBottom="20px" component="div">
                Address
              </Typography>

              <Table headers={addressHeaders}>
                <UserAddressRow address={user.address} />
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const UserAddressRow = ({ address }: { address: Address }) => (
  <TableRow>
    <TableCell align="left">
      {address.street_name} {address.street_address}
    </TableCell>
    <TableCell align="left">{address.city}</TableCell>
    <TableCell align="left">{address.state}</TableCell>
    <TableCell align="left">{address.country}</TableCell>
    <TableCell align="right">{address.zip_code}</TableCell>
  </TableRow>
);

const UsersTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("email");

  const onSortRequest = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setPage(1);
  };

  useEffect(() => {
    setIsLoading(true);
    getUsers(30)
      .then(({ data }) => {
        setUsers(data);
        setPage(1);
      })
      .catch((error) => {
        setError(error.response.message || "Failed to fetch users");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const sortedData = stableSort(users as any, getComparator(order, orderBy));
    setFilteredUsers(sortedData as any);
  }, [order, orderBy, users]);

  if (isLoading) return <p className="text-center text-5xl font-black p-20 animate-pulse">Loading...</p>;

  return (
    <div>
      {error && (
        <Typography color="red" textAlign="center" marginTop="20px" marginBottom="20px">
          {error}
        </Typography>
      )}

      <Box marginBottom="20px" display="flex" justifyContent="right">
        <SearchInput setValue={setFilteredUsers} values={users} searchKey="email" />
      </Box>

      <Table
        isExpandable
        headers={tableHeaders}
        pages={Math.ceil(users.length / usersPerPage)}
        currentPage={page}
        setPage={setPage}
        order={order}
        orderBy={orderBy}
        onSortRequest={onSortRequest}
      >
        {filteredUsers.slice(usersPerPage * (page - 1), usersPerPage * page).map((user) => (
          <UserRow key={user.id} user={user} />
        ))}
      </Table>
    </div>
  );
};

export default UsersTable;

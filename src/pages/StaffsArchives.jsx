import {
  Alert,
  Box,
  Button,
  CssBaseline,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { DeleteForever, RestoreFromTrash } from "@mui/icons-material";
import DropDownButtons from "../components/DropDownButtons";

export default function StaffsArchives() {
  const columns = [
    { id: "id", name: "ID" },
    { id: "name", name: "Name" },
    { id: "contact_num", name: "Contact Number" },
    { id: "address", name: "Address" },
    { id: "deleteddate", name: "Deleted Date" },
    { id: "Actions", name: "Actions" },
  ];

  const handlechangepage = (event, newpage) => {
    pagechange(newpage);
  };
  const handleRowsPerPage = (event) => {
    rowperpagechange(+event.target.value);
    pagechange(0);
  };

  const [page, pagechange] = useState(0);
  const [rowperpage, rowperpagechange] = useState(10);

  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const [message, setMessage] = useState(null);

  const getStaffsArchives = () => {
    setMessage(null);
    setStaffs([]);
    setLoading(true);
    axiosClient
      .get("/archives/staffs")
      .then(({ data }) => {
        setLoading(false);
        setStaffs(data.data);
      })
      .catch((error) => {
        const response = error.response;
        if (response && response.status === 404) {
          setMessage(response.data.message);
        }
        setLoading(false);
      });
  };

  const onRestore = (po) => {
    if (!window.confirm("Are you sure to restore this staff?")) {
      return;
    }

    axiosClient.put(`/staffs/${po.id}/restore`).then(() => {
      setNotification("Staff was successfully restored");
      getStaffsArchives();
    });
  };

  const onDelete = (po) => {
    if (!window.confirm("Are you sure permanently delete this client?")) {
      return;
    }

    axiosClient.delete(`/archives/${po.id}/forcedelete`).then(() => {
      setNotification("Staff was permanently deleted");
      getStaffsArchives();
    });
  };

  useEffect(() => {
    getStaffsArchives();
  }, []);

  return (
    <>
      <Stack direction="row" justifyContent="space-between">
        <Box flex={5}>
          <Paper
            sx={{
              minWidth: "90%",
              padding: "10px",
            }}
          >
            <Typography p={1} variant="h5">
              Archived Staffs
            </Typography>
            {notification && <Alert severity="success">{notification}</Alert>}
            <TableContainer sx={{ height: 380 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        style={{ backgroundColor: "black", color: "white" }}
                        key={column.id}
                      >
                        {column.name}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                {loading && (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={5} style={{ textAlign: "center" }}>
                        Loading...
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
                {!loading && message && (
                  <TableBody>
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        style={{ textAlign: "center" }}
                      >
                        {message}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}

                {!loading && (
                  <TableBody>
                    {staffs &&
                      staffs
                        .slice(
                          page * rowperpage,
                          page * rowperpage + rowperpage
                        )
                        .map((po) => (
                          <TableRow hover role="checkbox" key={po.id}>
                            <TableCell>{po.id}</TableCell>
                            <TableCell>{`${po.firstname} ${po.lastname}`}</TableCell>
                            <TableCell>{po.contact_num}</TableCell>
                            <TableCell>
                              {po.address.zone}, {po.address.barangay},{" "}
                              {po.address.zipcode.area}
                            </TableCell>
                            <TableCell>{po.deleted_at}</TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={2}>
                                <Button
                                  variant="contained"
                                  color="success"
                                  size="small"
                                  onClick={() => onRestore(po)}
                                >
                                  <RestoreFromTrash fontSize="small" />
                                </Button>
                                <Button
                                  variant="contained"
                                  size="small"
                                  color="error"
                                  onClick={() => onDelete(po)}
                                >
                                  <DeleteForever fontSize="small" />
                                </Button>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                )}
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 15, 25]}
              rowsPerPage={rowperpage}
              page={page}
              count={staffs.length}
              component="div"
              onPageChange={handlechangepage}
              onRowsPerPageChange={handleRowsPerPage}
            ></TablePagination>
          </Paper>
        </Box>
      </Stack>
    </>
  );
}

"use client"
import { Table } from "@mui/joy"
import { Alert, Box, Button, Container, Divider, FormControl, Grid2, IconButton, InputLabel, MenuItem, Popover, Select, Snackbar, Typography, Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { useEffect, useState } from "react";
import ModalAddUser from "./modal.add.user";
import { getUser } from "@/utils/action/actionUser";
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
const ManageUser = () => {
    const [selectedDelete, setSelectedDelete] = useState<number>()
    const [openModal, setOpenModal] = useState(false)
    const [openSnackBarRole, setOpenSnackBarRole] = useState(false)
    const [openSnackBarDeleteUser, setOpenSnackBaDeleteUser] = useState(false)
    const [changeUndo, setChangeUndo] = useState<{ id: number, role: "ADMIN" | "USER" } | null>(null);
    const [deleteId, setDeleteId] = useState<number>()
    const [openPopover, setOpenPopover] = useState(false)
    const session = useSession();
    const router = useRouter()
    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
    const [user, setUser] = useState<undefined | IUser[]>();
    const fetchUser = async () => {
        const res = await getUser();
        setUser(res.data?.result)
        console.log(res)
    }
    useEffect(() => {
        fetchUser()

    }, [])
    const updateRole = async (role: "ADMIN" | "USER", id: number) => {
        const res = await sendRequest({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/user`, method: "PATCH", headers: {
                Authorization: `Bearer ${session?.data?.access_token}`,
            },
            body: {
                role, id
            }
        })
        await fetchUser();
        setOpenSnackBarRole(true);
        // await revalidateName("get-user");
        // router.refresh()

    }
    const handleUndoRole = async () => {
        const res = await sendRequest({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/user`, method: "PATCH", headers: {
                Authorization: `Bearer ${session?.data?.access_token}`,
            },
            body: {
                role: changeUndo?.role, id: changeUndo?.id
            }
        })
        setChangeUndo(null)
        setOpenSnackBarRole(false)
        await fetchUser();
    }
    const handleDeleteUser = async (id: number) => {

        const res = await sendRequest({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/user/${id}`, method: "DELETE", headers: {
                Authorization: `Bearer ${session?.data?.access_token}`,
            }
        })
        console.log(res)
        await fetchUser();
        setOpenSnackBaDeleteUser(true);
    }
    const handleUndoDeleteUser = async () => {
        const res = await sendRequest({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/user/${deleteId}`, method: "POST", headers: {
                Authorization: `Bearer ${session?.data?.access_token}`,
            }
        })
        await fetchUser();
        setDeleteId(0);
        setOpenSnackBaDeleteUser(false);
        setAnchorEl(null);
    }
    return (
        <Container maxWidth="xl">
            <Grid2 container spacing={1}>
                <Grid2 size={3}>
                    <h2>Bộ lọc tìm kiếm</h2>
                    <Accordion defaultExpanded>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel3-content"
                            id="panel3-header"
                        >
                            <Typography component="span">Accordion Actions</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                            malesuada lacus ex, sit amet blandit leo lobortis eget.
                        </AccordionDetails>

                    </Accordion>
                </Grid2>

                <Grid2 size={9}>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between"
                    }}>
                        <Typography variant="h3" gutterBottom>
                            Manage user
                        </Typography>
                        <Button onClick={() => setOpenModal(true)}>Add user</Button>
                    </Box>
                    <Table aria-label="table variants" variant={"outlined"} color={"neutral"}>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Username</th>
                                <th>Role</th>
                                <th>Email</th>
                                <th>Type user</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {user && user.map((row) => (
                                <tr key={row.id}>
                                    <td>{row.id}</td>
                                    <td>{row.userName}</td>
                                    <td>
                                        <FormControl variant="standard" color="info" sx={{ m: 1, minWidth: 120 }}>
                                            <Select
                                                labelId="demo-simple-select-standard-label"
                                                id="demo-simple-select-standard"
                                                onChange={(e) => {
                                                    setChangeUndo({ id: row.id, role: row.role })
                                                    updateRole(e.target.value as any, row.id)
                                                }}
                                                label="Age"
                                                value={row.role}
                                            >
                                                <MenuItem value={"ADMIN"}>Admin</MenuItem>
                                                <MenuItem value={"USER"}>User</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </td>
                                    <td>{row.email}</td>
                                    <td>{row.typeEnum}</td>
                                    <td>

                                        <div onClick={(e) => {
                                            setAnchorEl(e.currentTarget)
                                            setSelectedDelete(row.id);
                                        }} aria-describedby={row.id.toString()} style={{ display: "inline-block" }}>
                                            <DeleteIcon color="error" />
                                        </div>

                                        <Popover
                                            id={row.id.toString()}
                                            open={Boolean(anchorEl) && row.id === selectedDelete}
                                            anchorEl={anchorEl}
                                            onClose={() => setAnchorEl(null)}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            transformOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                            }}
                                        >
                                            <Typography sx={{ p: 2 }}>Are you sure you want to delete?</Typography>

                                            <Button onClick={() => setAnchorEl(null)} variant="outlined" sx={{ m: 1 }}>
                                                Cancel
                                            </Button>
                                            <Button onClick={() => {
                                                setDeleteId(row.id)
                                                handleDeleteUser(row.id)
                                            }} color="error" variant="contained" sx={{ m: 1 }}>
                                                Confirm
                                            </Button>
                                        </Popover>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Grid2>

            </Grid2>

            <ModalAddUser open={openModal} setOpen={setOpenModal} fetchUser={fetchUser} />
            <Snackbar open={openSnackBarRole} autoHideDuration={6000} onClose={() => setOpenSnackBarRole(false)}>
                <Alert
                    onClose={() => setOpenSnackBarRole(false)}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Update role success
                    <Button color="inherit" size="small" onClick={handleUndoRole}>
                        UNDO
                    </Button>
                </Alert>
            </Snackbar>
            <Snackbar open={openSnackBarDeleteUser} autoHideDuration={6000} onClose={() => setOpenSnackBaDeleteUser(false)}>
                <Alert
                    onClose={() => setOpenSnackBaDeleteUser(false)}
                    severity="warning"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Update role success
                    <Button color="inherit" size="small" onClick={handleUndoDeleteUser}>
                        UNDO
                    </Button>
                </Alert>
            </Snackbar>
        </Container>
    )
}
export default ManageUser
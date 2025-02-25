"use client"
import { Table } from "@mui/joy"
import { Alert, Box, Button, Container, Divider, FormControl, Grid2, IconButton, InputLabel, MenuItem, Popover, Select, Snackbar, Typography, Accordion, AccordionDetails, AccordionSummary, TablePagination } from "@mui/material";
import { useEffect, useRef, useState } from "react";


import DeleteIcon from '@mui/icons-material/Delete';
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ModalAddFactory from "./modal.add.factory";
import Image from "next/image";
import { toast } from "react-toastify";
import { revalidateName } from "@/utils/action/action";
interface IProps {
    data?: IFactory[]
}

const ManageFactory = (props: IProps) => {
    const [openModal, setOpenModal] = useState(false)
    const { data } = props
    const [openSnackBarRole, setOpenSnackBarRole] = useState(false)
    const [openSnackBarDeleteUser, setOpenSnackBaDeleteUser] = useState(false)
    //state for undo
    const [changeUndo, setChangeUndo] = useState<{ id: number, role: "ADMIN" | "USER" } | null>(null);
    const [deleteId, setDeleteId] = useState<number>()
    const session = useSession();
    const router = useRouter();
    const pathName = usePathname()
    const searchParams = useSearchParams()

    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
    const theadRef = useRef(null);



    // const handleUndoRole = async () => {
    //     const res = await sendRequest({
    //         url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/user`, method: "PATCH", headers: {
    //             Authorization: `Bearer ${session?.data?.access_token}`,
    //         },
    //         body: {
    //             role: changeUndo?.role, id: changeUndo?.id
    //         }
    //     })
    //     setChangeUndo(null)
    //     setOpenSnackBarRole(false)
    //     await fetchUser({ page, size, filter, sort: sortParam })
    // }
    const handleDeleteFactory = async () => {

        const res = await sendRequest<IBackendRes<IFactory>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/factory/${deleteId}`, method: "DELETE", headers: {
                Authorization: `Bearer ${session?.data?.access_token}`,
            }
        })
        console.log(res)
        if (!res.error) {
            setOpenSnackBaDeleteUser(true);
            await revalidateName("get-factory");

            router.refresh();
        } else {
            toast.error(res.error)
        }
        setAnchorEl(null);

    }
    const handleUndoDeleteFactory = async () => {
        const res = await sendRequest({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/factory/${deleteId}`, method: "POST", headers: {
                Authorization: `Bearer ${session?.data?.access_token}`,
            }
        })
        await revalidateName("get-factory");
        router.refresh();
        setDeleteId(0);
        setOpenSnackBaDeleteUser(false);

    }

    return (
        <Container maxWidth="xl">

            <Box sx={{
                display: "flex",
                justifyContent: "space-between"
            }}>
                <Typography variant="h3" gutterBottom>
                    Manage user
                </Typography>
                <Button onClick={() => setOpenModal(true)}>Add user</Button>
            </Box>
            <Box sx={{ border: "1px solid gray", padding: 1 }}>


                <Table aria-label="table variants" variant={"outlined"} color={"neutral"}>
                    <thead ref={theadRef}>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Country</th>
                            <th>Image</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.map((row) => (
                            <tr key={row.id}>
                                <td>{row.id}</td>
                                <td>{row.name}</td>

                                <td>{row.country}</td>
                                <td>
                                    <Image src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/factory/${row.image}`} alt="image" width={100} height={100} />
                                </td>
                                <td>

                                    <div onClick={(e) => {
                                        setDeleteId(row.id);
                                        setAnchorEl(e.currentTarget)
                                    }}
                                        style={{ display: "inline-block", cursor: "pointer" }}>
                                        <DeleteIcon color="error" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {/* <tr>
                            <td colSpan={6}>
                                <TablePagination
                                    component="div"
                                    count={meta?.total ?? 0}
                                    page={meta?.page ? meta.page - 1 : 0}
                                    onPageChange={(e, n) => {
                                        const url = new URLSearchParams(searchParams);
                                        url.set("page", (n + 1).toString())
                                        router.replace(`${pathName}?${url.toString()}`, { scroll: false })
                                    }}
                                    rowsPerPage={meta?.pageSize ?? 10}
                                    onRowsPerPageChange={(e) => {
                                        const url = new URLSearchParams(searchParams);
                                        url.set("size", e.target.value)
                                        router.replace(`${pathName}?${url.toString()}`, { scroll: false })
                                    }}

                                />
                            </td>
                        </tr> */}
                    </tbody>
                </Table>
            </Box>


            <ModalAddFactory open={openModal} setOpen={setOpenModal} />
            <Snackbar open={openSnackBarDeleteUser} autoHideDuration={6000} onClose={() => setOpenSnackBarRole(false)}>
                <Alert
                    onClose={() => setOpenSnackBaDeleteUser(false)}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Update role success
                    <Button color="inherit" size="small" onClick={handleUndoDeleteFactory}>
                        UNDO
                    </Button>
                </Alert>
            </Snackbar>
            {/* <Snackbar open={openSnackBarDeleteUser} autoHideDuration={6000} onClose={() => setOpenSnackBaDeleteUser(false)}>
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
            </Snackbar> */}
            {/* Popup delete */}
            <Popover
                open={Boolean(anchorEl)}
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
                    handleDeleteFactory()
                }} color="error" variant="contained" sx={{ m: 1 }}>
                    Confirm
                </Button>
            </Popover>

        </Container>
    )
}
export default ManageFactory
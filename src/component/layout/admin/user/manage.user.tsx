"use client"
import { Table } from "@mui/joy"
import { Alert, Box, Button, Container, FormControl, MenuItem, Popover, Select, Snackbar, Typography, TablePagination } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ModalAddUser from "./modal.add.user";
import DeleteIcon from '@mui/icons-material/Delete';
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PopoverUserFilter from "./popover.user.filter";
import PopoverUserSearch from "./popover.user.search";
import debounce from "debounce";
import { sfAnd, sfEqual, sfGe, sfIn, sfLike, sfLt, sfOr } from "spring-filter-query-builder";
import { Dayjs } from "dayjs";
import PopoverUserSort from "./popover.user.sort";
import { revalidateName } from "@/utils/action/action";
import { Like } from "spring-filter-query-builder/dist/types/comparators";
interface IProps {
    meta?: IMeta,
    user?: IUser[],
}
const ManageUser = (props: IProps) => {
    const { meta, user } = props
    const [openModal, setOpenModal] = useState(false)
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
    //state for filter and search
    const [role, setRole] = useState<string[]>([])
    const [type, setType] = useState<string[]>([])
    const [searchEmail, setSearchEmail] = useState<string[]>([])
    const [searchUserName, setSearchUserName] = useState<string[]>([])
    const [startDate, setStartDate] = useState<Dayjs | null>(null)
    const [endDate, setEndDate] = useState<Dayjs | null>(null)

    //state for sort
    const [sort, setSort] = useState<"id" | "createdAt" | "email" | "userName" | "role" | "type" | "createdBy" | null>(null)
    const [sortBy, setSortBy] = useState<"asc" | "desc" | null>(null)

    const debouncedFilter = useRef(debounce((role, type, searchEmail: string[], searchUserName: string[], startDate, endDate, sort, sortBy) => {
        const filterBuilder = []
        if (role.length > 0) {
            filterBuilder.push(sfIn("role", role))
        }
        if (type.length > 0) {
            filterBuilder.push(sfIn("type", type))
        }
        if (searchEmail.length > 0) {
            const searchBuilder: Like[] = [];
            searchEmail.forEach((email) => {
                searchBuilder.push(sfLike("email", `*${email.trim()}*`, true))
            })
            filterBuilder.push(sfOr(searchBuilder))
        }
        if (searchUserName.length > 0) {
            const searchName: Like[] = [];
            searchUserName.forEach((name) => {
                searchName.push(sfLike("userName", `*${name.trim()}*`, true))
            })
            filterBuilder.push(sfOr(searchName))

        }
        if (startDate !== null && endDate !== null) {
            filterBuilder.push(sfLt("createdAt", endDate.format("YYYY-MM-DD")))
            filterBuilder.push(sfGe("createdAt", startDate.format("YYYY-MM-DD")))
        }
        if (role.length !== 0 || type.length !== 0 || searchEmail.length !== 0 || searchUserName.length !== 0 || startDate !== null || endDate !== null) {
            const filter = sfAnd(filterBuilder);
            const url = new URLSearchParams(searchParams);
            url.set("filter", filter.toString())
            router.replace(`${pathName}?${url.toString()}`, { scroll: false })
        } else {
            const url = new URLSearchParams(searchParams);
            url.delete("filter");
            router.replace(`${pathName}?${url.toString()}`, { scroll: false })
        }

    }, 1000)).current
    useEffect(() => {
        //han che goi api qua nhieu
        debouncedFilter(role, type, searchEmail, searchUserName, startDate, endDate, sort, sortBy);
    }, [role, type, searchEmail, searchUserName, startDate, endDate])
    //@ts-ignore
    useEffect(() => {
        const sortFunction = async () => {
            if (sort && sortBy) {
                const url = new URLSearchParams(searchParams);
                url.set("sort", `${sort},${sortBy}`)
                await revalidateName("get-user");

                router.replace(`${pathName}?${url.toString()}`, { scroll: false })
            }
        }
        sortFunction()
    }, [sort, sortBy])
    const updateRole = async (role: "ADMIN" | "USER", id: number) => {
        const res = await sendRequest({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/user`, method: "PATCH", headers: {
                Authorization: `Bearer ${session?.data?.access_token}`,
            },
            body: {
                role, id
            }
        })

        setOpenSnackBarRole(true);
        // await revalidateName("get-user");
        router.refresh()

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
        router.refresh();
    }
    const handleDeleteUser = async () => {

        const res = await sendRequest({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/user/${deleteId}`, method: "DELETE", headers: {
                Authorization: `Bearer ${session?.data?.access_token}`,
            }
        })
        setAnchorEl(null);
        setOpenSnackBaDeleteUser(true);

        await revalidateName("get-user");
        router.refresh();
    }
    const handleUndoDeleteUser = async () => {
        const res = await sendRequest({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/user/${deleteId}`, method: "POST", headers: {
                Authorization: `Bearer ${session?.data?.access_token}`,
            }
        })
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
                <PopoverUserFilter theadRef={theadRef}
                    role={role}
                    setRole={setRole}
                    type={type}
                    setType={setType}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    setStartDate={setStartDate}
                    startDate={startDate}
                />
                <PopoverUserSort setSort={setSort} sort={sort} setSortBy={setSortBy} sortBy={sortBy} theadRef={theadRef} />
                {/* <Button variant="text" endIcon={<GetAppIcon />}>Export</Button> */}
                <PopoverUserSearch theadRef={theadRef} searchEmail={searchEmail} setSearchEmail={setSearchEmail} searchUserName={searchUserName} setSearchUserName={setSearchUserName} />
                <Table aria-label="table variants" variant={"outlined"} color={"neutral"}>
                    <thead ref={theadRef}>
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
                                <td>{row.type}</td>
                                <td>

                                    <div onClick={(e) => {
                                        setDeleteId(row.id);
                                        setAnchorEl(e.currentTarget)
                                    }}
                                        style={{ display: "inline-block" }}>
                                        <DeleteIcon color="error" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        <tr>
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
                                    onRowsPerPageChange={async (e) => {
                                        const url = new URLSearchParams(searchParams);
                                        url.set("size", e.target.value)
                                        router.replace(`${pathName}?${url.toString()}`, { scroll: false })
                                    }}

                                />
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Box>


            <ModalAddUser open={openModal} setOpen={setOpenModal} meta={meta} />
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
                    Delete user success
                    <Button color="inherit" size="small" onClick={handleUndoDeleteUser}>
                        UNDO
                    </Button>
                </Alert>
            </Snackbar>
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
                    handleDeleteUser()
                }} color="error" variant="contained" sx={{ m: 1 }}>
                    Confirm
                </Button>
            </Popover>

        </Container>
    )
}
export default ManageUser
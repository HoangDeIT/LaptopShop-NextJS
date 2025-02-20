"use client"
import { Table } from "@mui/joy"
import { Alert, Box, Button, Container, Divider, FormControl, Grid2, IconButton, InputLabel, MenuItem, Popover, Select, Snackbar, Typography, Accordion, AccordionDetails, AccordionSummary, TablePagination } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ModalAddUser from "./modal.add.user";
import { getUser } from "@/utils/action/actionUser";
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import GetAppIcon from '@mui/icons-material/GetApp';
import SearchIcon from '@mui/icons-material/Search';
import PopoverUserFilter from "./popover.user.filter";
import PopoverUserSearch from "./popover.user.search";
import debounce from "debounce";
import { sfAnd, sfEqual, sfGe, sfIn, sfLike, sfLt } from "spring-filter-query-builder";
import dayjs, { Dayjs } from "dayjs";
import PopoverUserSort from "./popover.user.sort";
const ManageUser = () => {
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
    const [user, setUser] = useState<undefined | IUser[]>();
    const [meta, setMeta] = useState<undefined | IMeta>();

    const page = searchParams.get("page")
    let size = searchParams.get("size")
    let filter = searchParams.get("filter")
    let sortParam = searchParams.get("sort")
    //state for filter and search
    const [role, setRole] = useState<string[]>([])
    const [type, setType] = useState<string[]>([])
    const [searchEmail, setSearchEmail] = useState<string>("")
    const [searchUserName, setSearchUserName] = useState<string>("")
    const [startDate, setStartDate] = useState<Dayjs | null>(null)
    const [endDate, setEndDate] = useState<Dayjs | null>(null)

    //state for sort
    const [sort, setSort] = useState<"id" | "createdAt" | "email" | "userName" | "role" | "type" | "createdBy" | null>(null)
    const [sortBy, setSortBy] = useState<"asc" | "desc" | null>(null)
    const fetchUser = async (param?: Object) => {
        console.log(param)
        const res = await getUser(param);
        setUser(res.data?.result)
        setMeta(res.data?.meta)
        const meta1 = res.data?.meta
        if (meta1?.page.toString() !== searchParams.get("page")) {
            const url = new URLSearchParams(searchParams);
            url.set("page", meta1?.page === undefined ? "1" : meta1?.page.toString())
            router.replace(`${pathName}?${url.toString()}`, { scroll: false })
        }
    }
    useEffect(() => {
        if (size !== "10" && size !== "25" && size !== "50" && size !== "100") {
            const url = new URLSearchParams(searchParams);
            url.set("size", "25")
            router.replace(`${pathName}?${url.toString()}`, { scroll: false })
        }
        if (page == null) {
            const url = new URLSearchParams(searchParams);
            url.set("page", "1")
            router.replace(`${pathName}?${url.toString()}`, { scroll: false })
        }
        fetchUser({ page, size, filter, sort: sortParam })
        console.log("dsda")
    }, [page, size, filter, sortParam])
    const debouncedFilter = useRef(debounce((role, type, searchEmail, searchUserName, startDate, endDate, sort, sortBy) => {
        const filterBuilder = []
        if (role.length > 0) {
            filterBuilder.push(sfIn("role", role))
            console.log("hello guy")
        }
        if (type.length > 0) {
            filterBuilder.push(sfIn("type", type))
        }
        if (searchEmail.length > 0) {
            filterBuilder.push(sfLike("email", `*${searchEmail}*`, true))
        }
        if (searchUserName.length > 0) {
            filterBuilder.push(sfLike("userName", `*${searchUserName}*`, true))
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
    useEffect(() => {
        if (sort && sortBy) {
            const url = new URLSearchParams(searchParams);
            url.set("sort", `${sort},${sortBy}`)
            router.replace(`${pathName}?${url.toString()}`, { scroll: false })
        }
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
        await fetchUser({ page, size, filter, sort: sortParam })
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
        await fetchUser({ page, size, filter, sort: sortParam })
    }
    const handleDeleteUser = async () => {

        const res = await sendRequest({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/user/${deleteId}`, method: "DELETE", headers: {
                Authorization: `Bearer ${session?.data?.access_token}`,
            }
        })
        setAnchorEl(null);
        await fetchUser({ page, size, filter, sort: sortParam })
        setOpenSnackBaDeleteUser(true);
    }
    const handleUndoDeleteUser = async () => {
        const res = await sendRequest({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/user/${deleteId}`, method: "POST", headers: {
                Authorization: `Bearer ${session?.data?.access_token}`,
            }
        })
        await fetchUser({ page, size, filter, sort: sortParam })
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
                                    onRowsPerPageChange={(e) => {
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
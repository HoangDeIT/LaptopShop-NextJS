"use client"
import { Sheet, Table } from "@mui/joy"
import { Alert, Box, Button, Container, FormControl, MenuItem, Popover, Select, Snackbar, Typography, TablePagination } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import DeleteIcon from '@mui/icons-material/Delete';
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import debounce from "debounce";
import { sfAnd, sfEqual, sfGe, sfIn, sfLike, sfLt } from "spring-filter-query-builder";
import { Dayjs } from "dayjs";

import { revalidateName } from "@/utils/action/action";
import Image from "next/image";
import ModalAddProduct from "./modal.add.product";
interface IProps {
    meta?: IMeta,
    products?: IProduct[],
    factories?: IFactory[]
}

const ManageProduct = (props: IProps) => {
    const { meta, products, factories } = props
    const [openModal, setOpenModal] = useState(false)
    const [openSnackBarRole, setOpenSnackBarRole] = useState(false)
    const [openSnackBarDeleteUser, setOpenSnackBaDeleteUser] = useState(false)
    //state for undo
    const [deleteId, setDeleteId] = useState<number>()
    const session = useSession();
    const router = useRouter();
    const pathName = usePathname()
    const searchParams = useSearchParams()

    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
    const theadRef = useRef(null);
    //state for filter and search
    const [filter, setFilter] = useState<{
        maxPrice: number,
        minPrice: number,
        minQuantity: number,
        maxQuantity: number,
        minSold: number,
        maxSold: number,
        factory: string,
        type: string,
        cpu: string,
        maxRom: number,
        minRom: number,
        maxRam: number,
        minRam: number,
        minScreen: number,
        maxScreen: number,
        os: string,
        gpu: string,
        minCreatedAt: string,
        maxCreatedAt: string
    } | null>(null)

    //state for sort
    const [sort, setSort] = useState<"id" | "createdAt" | "email" | "userName" | "role" | "type" | "createdBy" | null>(null)
    const [sortBy, setSortBy] = useState<"asc" | "desc" | null>(null)

    // const debouncedFilter = useRef(debounce((role, type, searchEmail, searchUserName, startDate, endDate, sort, sortBy) => {
    //     const filterBuilder = []
    //     if (role.length > 0) {
    //         filterBuilder.push(sfIn("role", role))
    //     }
    //     if (type.length > 0) {
    //         filterBuilder.push(sfIn("type", type))
    //     }
    //     if (searchEmail.length > 0) {
    //         filterBuilder.push(sfLike("email", `*${searchEmail}*`, true))
    //     }
    //     if (searchUserName.length > 0) {
    //         filterBuilder.push(sfLike("userName", `*${searchUserName}*`, true))
    //     }
    //     if (startDate !== null && endDate !== null) {
    //         filterBuilder.push(sfLt("createdAt", endDate.format("YYYY-MM-DD")))
    //         filterBuilder.push(sfGe("createdAt", startDate.format("YYYY-MM-DD")))
    //     }
    //     if (role.length !== 0 || type.length !== 0 || searchEmail.length !== 0 || searchUserName.length !== 0 || startDate !== null || endDate !== null) {
    //         const filter = sfAnd(filterBuilder);
    //         const url = new URLSearchParams(searchParams);
    //         url.set("filter", filter.toString())
    //         router.replace(`${pathName}?${url.toString()}`, { scroll: false })
    //     } else {
    //         const url = new URLSearchParams(searchParams);
    //         url.delete("filter");
    //         router.replace(`${pathName}?${url.toString()}`, { scroll: false })
    //     }

    // }, 1000)).current
    // useEffect(() => {
    //     //han che goi api qua nhieu
    //     debouncedFilter(role, type, searchEmail, searchUserName, startDate, endDate, sort, sortBy);
    // }, [role, type, searchEmail, searchUserName, startDate, endDate])
    // //@ts-ignore
    // useEffect(() => {
    //     const sortFunction = async () => {
    //         if (sort && sortBy) {
    //             const url = new URLSearchParams(searchParams);
    //             url.set("sort", `${sort},${sortBy}`)
    //             await revalidateName("get-user");

    //             router.replace(`${pathName}?${url.toString()}`, { scroll: false })
    //         }
    //     }
    //     sortFunction()
    // }, [sort, sortBy])
    // const updateRole = async (role: "ADMIN" | "USER", id: number) => {
    //     const res = await sendRequest({
    //         url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/user`, method: "PATCH", headers: {
    //             Authorization: `Bearer ${session?.data?.access_token}`,
    //         },
    //         body: {
    //             role, id
    //         }
    //     })

    //     setOpenSnackBarRole(true);
    //     // await revalidateName("get-user");
    //     router.refresh()

    // }
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
    //     router.refresh();
    // }
    // const handleDeleteUser = async () => {

    //     const res = await sendRequest({
    //         url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/user/${deleteId}`, method: "DELETE", headers: {
    //             Authorization: `Bearer ${session?.data?.access_token}`,
    //         }
    //     })
    //     setAnchorEl(null);
    //     setOpenSnackBaDeleteUser(true);

    //     await revalidateName("get-user");
    //     router.refresh();
    // }
    // const handleUndoDeleteUser = async () => {
    //     const res = await sendRequest({
    //         url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/user/${deleteId}`, method: "POST", headers: {
    //             Authorization: `Bearer ${session?.data?.access_token}`,
    //         }
    //     })
    //     router.refresh();
    //     setDeleteId(0);
    //     setOpenSnackBaDeleteUser(false);

    // }

    return (
        <Container maxWidth={false}>
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
                <Sheet
                    variant="outlined"
                    sx={(theme) => ({
                        '--TableCell-height': '40px',
                        // the number is the amount of the header rows.
                        '--TableHeader-height': 'calc(1 * var(--TableCell-height))',
                        '--Table-firstColumnWidth': '80px',
                        '--Table-lastColumnWidth': '144px',
                        // background needs to have transparency to show the scrolling shadows
                        '--TableRow-stripeBackground': 'rgba(0 0 0 / 0.04)',
                        '--TableRow-hoverBackground': 'rgba(0 0 0 / 0.08)',
                        overflow: 'auto',
                        background: `linear-gradient(to right, ${theme.vars.palette.background.surface} 30%, rgba(255, 255, 255, 0)),
            linear-gradient(to right, rgba(255, 255, 255, 0), ${theme.vars.palette.background.surface} 70%) 0 100%,
            radial-gradient(
              farthest-side at 0 50%,
              rgba(0, 0, 0, 0.12),
              rgba(0, 0, 0, 0)
            ),
            radial-gradient(
                farthest-side at 100% 50%,
                rgba(0, 0, 0, 0.12),
                rgba(0, 0, 0, 0)
              )
              0 100%`,
                        backgroundSize:
                            '40px calc(100% - var(--TableCell-height)), 40px calc(100% - var(--TableCell-height)), 14px calc(100% - var(--TableCell-height)), 14px calc(100% - var(--TableCell-height))',
                        backgroundRepeat: 'no-repeat',
                        backgroundAttachment: 'local, local, scroll, scroll',
                        backgroundPosition:
                            'var(--Table-firstColumnWidth) var(--TableCell-height), calc(100% - var(--Table-lastColumnWidth)) var(--TableCell-height), var(--Table-firstColumnWidth) var(--TableCell-height), calc(100% - var(--Table-lastColumnWidth)) var(--TableCell-height)',
                        backgroundColor: 'background.surface',
                    })}
                >
                    <Table aria-label="table variants" variant={"outlined"} color={"neutral"}
                        borderAxis="bothBetween"
                        stripe="odd"
                        hoverRow
                        sx={{
                            '& tr > *:first-child': {
                                position: 'sticky',
                                left: 0,
                                boxShadow: '1px 0 var(--TableCell-borderColor)',
                                bgcolor: 'background.surface',
                            },
                            '& tr > *:last-child': {
                                position: 'sticky',
                                right: 0,
                                bgcolor: 'var(--TableCell-headBackground)',
                            },
                            '& tfoot td': {
                                position: 'sticky',
                                bottom: 0,
                                background: 'white',
                                boxShadow: '0px -1px 3px rgba(0, 0, 0, 0.1)',
                                zIndex: 1,
                            },
                        }}
                    >
                        <thead ref={theadRef}>
                            <tr>
                                <th style={{ width: "200px" }}>Id</th>
                                <th style={{ width: "70px" }}>Image</th>
                                <th style={{ width: "200px" }}>Name</th>
                                <th style={{ width: "200px" }}>Factory Name</th>
                                <th style={{ width: "200px" }}>Type</th>
                                <th style={{ width: "200px" }}>CPU</th>
                                <th style={{ width: "200px" }}>RAM (GB)</th>
                                <th style={{ width: "200px" }}>Screen (Inch)</th>
                                <th style={{ width: "200px" }}>Price (USD)</th>
                                <th style={{ width: "200px" }}>Quantity</th>
                                <th style={{ width: "200px" }}>GPU</th>
                                <th style={{ width: "200px" }}>OS</th>
                                <th style={{ width: "200px" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products && products.map((row) => (
                                <tr key={row.id}>
                                    <td>{row.id}</td>
                                    <td>
                                        <Image alt={row.name + " image"} width={50} height={50} src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/product/${row.mainImage}`} />
                                    </td>
                                    <td>{row.name}</td>
                                    <td>
                                        {row.factory.name}
                                    </td>
                                    <td>{row.type}</td>
                                    <td>{row.cpu}</td>
                                    <td>{row.ram} GB</td>
                                    <td>{row.screen} Inch</td>
                                    <td>{row.price} USD</td>
                                    <td>{row.quantity}</td>
                                    <td>{row.gpu}</td>
                                    <td>{row.os}</td>
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

                        </tbody>



                    </Table>
                </Sheet>
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
            </Box>


            <ModalAddProduct open={openModal} setOpen={setOpenModal} factories={factories} />
            <Snackbar open={openSnackBarRole} autoHideDuration={6000} onClose={() => setOpenSnackBarRole(false)}>
                <Alert
                    onClose={() => setOpenSnackBarRole(false)}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Update role success
                    <Button color="inherit" size="small" >
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
                    <Button color="inherit" size="small" >
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
                    //   handleDeleteUser()
                }} color="error" variant="contained" sx={{ m: 1 }}>
                    Confirm
                </Button>
            </Popover>

        </Container>
    )
}
export default ManageProduct
"use client"
import { Sheet, Table } from "@mui/joy"
import { Alert, Box, Button, Container, FormControl, MenuItem, Popover, Select, Snackbar, Typography, TablePagination } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import DeleteIcon from '@mui/icons-material/Delete';
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import EditIcon from '@mui/icons-material/Edit';
import Image from "next/image";
import ModalAddProduct from "./modal.add.product";
import PopoverProductFilterAndSearch from "./popover.product.filter.seach";
import ModalUpdateProduct from "./modal.update.product";
import PopoverSortProduct from "./popover.sort";
interface IProps {
    meta?: IMeta,
    products?: IProduct[],
    factories?: IFactory[]
}

const ManageProduct = (props: IProps) => {
    const { meta, products, factories } = props
    const [openModal, setOpenModal] = useState(false)
    const [updateModal, setUpdateModal] = useState(false)
    const [openSnackBarUpdate, setOpenSnackBarUpdate] = useState(false)
    const [openSnackBarDelete, setOpenSnackBaDelete] = useState(false)
    //state for undo
    const [deleteId, setDeleteId] = useState<number>()
    const session = useSession();
    const router = useRouter();
    const pathName = usePathname()
    const searchParams = useSearchParams()
    const [updated, setUpdated] = useState<IProduct>()
    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
    const theadRef = useRef(null);
    //state for filter and search

    const handleDeleteProduct = async () => {
        console.log(deleteId)
        const res = await sendRequest({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/product/${deleteId}`, method: "DELETE", headers: {
                Authorization: `Bearer ${session?.data?.access_token}`,
            }
        })
        console.log(res)
        setAnchorEl(null);
        setOpenSnackBaDelete(true);
        console.log("truoc khi refresh")

        await router.refresh();
        console.log("sau khi refresh")
    }
    const handleUndoDeleteProduct = async () => {
        const res = await sendRequest({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/product/${deleteId}`, method: "POST", headers: {
                Authorization: `Bearer ${session?.data?.access_token}`,
            }
        })
        router.refresh();
        setDeleteId(0);
        setOpenSnackBaDelete(false);

    }

    return (
        <Container maxWidth={false}>
            <Box sx={{
                display: "flex",
                justifyContent: "space-between"
            }}>
                <Typography variant="h3" gutterBottom>
                    Manage product
                </Typography>
                <Button onClick={() => setOpenModal(true)}>Add product</Button>
            </Box>
            <Box sx={{ border: "1px solid gray", padding: 1 }}>
                <PopoverProductFilterAndSearch factoryList={factories} theadRef={theadRef} />
                <PopoverSortProduct theadRef={theadRef} />
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
                            '& thead': {
                                position: 'sticky',
                                top: 0, // Stick to the top
                                zIndex: 2, // Ensure it appears above other content
                                background: 'white', // Prevent underlying content from showing through
                            },
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
                                    <td >
                                        <Box sx={{
                                            display: "flex",
                                            justifyContent: "space-around"
                                        }}>
                                            <div onClick={(e) => {
                                                setDeleteId(row.id);
                                                setAnchorEl(e.currentTarget)
                                            }}
                                            >
                                                <DeleteIcon color="error" />
                                            </div>
                                            <div
                                                onClick={() => {
                                                    setUpdated(row);
                                                    setUpdateModal(true);
                                                }}>
                                                <EditIcon color="warning" />

                                            </div>
                                        </Box>

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
            <ModalUpdateProduct open={updateModal} setOpen={setUpdateModal} product={updated} factories={factories} />
            <Snackbar open={openSnackBarUpdate} autoHideDuration={6000} onClose={() => setOpenSnackBarUpdate(false)}>
                <Alert
                    onClose={() => setOpenSnackBarUpdate(false)}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Update role success
                    <Button color="inherit" size="small">
                        UNDO
                    </Button>
                </Alert>
            </Snackbar>
            <Snackbar open={openSnackBarDelete} autoHideDuration={6000} onClose={() => setOpenSnackBaDelete(false)}>
                <Alert
                    onClose={() => setOpenSnackBaDelete(false)}
                    severity="warning"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Delete product success
                    <Button color="inherit" size="small" onClick={handleUndoDeleteProduct}>
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
                    handleDeleteProduct()
                }} color="error" variant="contained" sx={{ m: 1 }}>
                    Confirm
                </Button>
            </Popover>

        </Container>
    )
}
export default ManageProduct
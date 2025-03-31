"use client"
import * as React from 'react';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Alert, Button, Chip, Container, Snackbar, TablePagination } from '@mui/material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import FaceIcon from '@mui/icons-material/Face';
import DeleteIcon from '@mui/icons-material/Delete';
import { sendRequest } from '@/utils/api';
import { useSession } from 'next-auth/react';

interface IProps {
    orders?: IOrder[],
    meta?: IMeta
}
function Row(
    { order, idChange, setIdChange, statusBefore, setStatusBefore, postStatus, rollBackStatus }:
        { order?: IOrder, idChange?: number, setIdChange: (v: number) => void, statusBefore?: "REFUSED" | "PENDING" | "APPROVED" | "DELIVERED", setStatusBefore?: any, postStatus?: any, rollBackStatus?: any }) {

    const [open, setOpen] = React.useState(false);
    //rollback state

    const colorChip = (status: "REFUSED" | "PENDING" | "APPROVED" | "DELIVERED") => {
        switch (status) {
            case 'APPROVED':
                return "secondary"
            case 'DELIVERED':
                return "success"
            case 'PENDING':
                return "warning"
            case 'REFUSED':
                return "error"
            default:
                break;
        }
    }
    const actionButton = (id: number, status: "REFUSED" | "PENDING" | "APPROVED" | "DELIVERED") => {
        switch (status) {
            case 'APPROVED':
                return (
                    <>
                        <Button color='success' variant='contained'
                            onClick={() => {
                                setIdChange(id)
                                setStatusBefore(status)
                                postStatus(id, "DELIVERED")
                            }}
                        >DELIVERED</Button>
                        <Button color='error'
                            onClick={() => {
                                setIdChange(id)
                                setStatusBefore(status)
                                postStatus(id, "REFUSED")
                            }}
                        >REFUSED</Button>
                    </>
                )
            case 'DELIVERED':
                return (
                    <p onClick={(e) => {

                    }}
                    >
                        <DeleteIcon color="error" />
                    </p>
                )
            case 'PENDING':
                return (
                    <>
                        <Button
                            onClick={() => {
                                setIdChange(id)
                                setStatusBefore(status)
                                postStatus(id, "APPROVED")
                            }}
                            color='info' sx={{ m: 1 }} variant='contained'>APPROVED</Button>
                        <Button color='warning'
                            onClick={() => {
                                setIdChange(id)
                                setStatusBefore(status)
                                postStatus(id, "REFUSED")
                            }}
                            sx={{ m: 1 }} variant='outlined'>REFUSED</Button>
                    </>
                )
            case 'REFUSED':
                return (
                    <p onClick={(e) => {
                        // setDeleteId(row.id);
                        // setAnchorEl(e.currentTarget)
                    }}
                    >
                        <DeleteIcon color="error" />
                    </p>
                )
            default:
                break;
        }
    }

    return (
        <React.Fragment>
            {order &&
                <>
                    <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                        <TableCell>
                            <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={() => setOpen(!open)}
                            >
                                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                        </TableCell>
                        <TableCell component="th" scope="row">
                            {order.id}
                        </TableCell>
                        <TableCell align="right">{order.user.userName}</TableCell>
                        <TableCell align="right">{order.totalPrice}</TableCell>
                        <TableCell align="right">{order.receiverAddress}</TableCell>
                        <TableCell align="right">{order.receiverPhone}</TableCell>
                        <TableCell align="right"> <Chip variant="outlined" color={colorChip(order.status)} size="small" icon={<FaceIcon />} label={order.status} /></TableCell>
                        <TableCell align='center'>{actionButton(order.id, order.status)}</TableCell>


                    </TableRow>
                    <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                            <Collapse in={open} timeout="auto" unmountOnExit>
                                <Box sx={{ margin: 1 }}>
                                    <Typography variant="h6" gutterBottom component="div">
                                        History
                                    </Typography>
                                    <Table size="small" aria-label="purchases">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>ID</TableCell>
                                                <TableCell align="right">Product</TableCell>
                                                <TableCell align="right">Price per product</TableCell>
                                                <TableCell align="right">Quantity</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {order.orderDetails.map((orderDetails) => (
                                                <TableRow key={orderDetails.id}>

                                                    <TableCell component="th" scope="row">
                                                        {orderDetails.id}
                                                    </TableCell>
                                                    <TableCell align="right">{orderDetails.product.name}</TableCell>
                                                    <TableCell align="right">{orderDetails.product.price}</TableCell>
                                                    <TableCell align="right">{orderDetails.quantity}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Box>
                            </Collapse>
                        </TableCell>
                    </TableRow>
                </>
            }

        </React.Fragment>
    );
}

export default function ManageOrder({ orders, meta }: IProps) {
    const router = useRouter()
    const pathName = usePathname()
    const searchParams = useSearchParams()
    const [statusBefore, setStatusBefore] = React.useState<"REFUSED" | "PENDING" | "APPROVED" | "DELIVERED">();
    const [idChange, setIdChange] = React.useState<number>(0)
    const { data } = useSession();

    const postStatus = async (id: number, status: "REFUSED" | "PENDING" | "APPROVED" | "DELIVERED") => {
        const res = await sendRequest<IBackendRes<IOrder>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/orders`, method: "PATCH", headers: {
                Authorization: `Bearer ${data?.access_token}`,
            },
            queryParams: {
                id, action: status
            }
        })
        console.log(res)
        if (!res.error) {
            setSnackBarStatus(true)
        }
        router.refresh()

    }
    const rollBackStatus = async (id: number, status: "REFUSED" | "PENDING" | "APPROVED" | "DELIVERED") => {
        const res = await sendRequest<IBackendRes<IOrder>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/orders`, method: "PATCH", headers: {
                Authorization: `Bearer ${data?.access_token}`,
            },
            queryParams: {
                id: idChange, action: statusBefore
            }
        })
        if (!res.error) {
            setSnackBarStatus(false)
        }
        router.refresh()
    }
    const [snackBarStatus, setSnackBarStatus] = React.useState<boolean>(false)
    return (
        <Container maxWidth={false}>
            <Box sx={{
                display: "flex",
                justifyContent: "space-between"
            }}>
                <Typography variant="h3" gutterBottom>
                    Manage user
                </Typography>

            </Box>
            <Box sx={{ border: "1px solid gray", padding: 1 }}>
                {/* <PopoverProductFilterAndSearch factoryList={factories} theadRef={theadRef} />
                <PopoverSortProduct theadRef={theadRef} /> */}
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>ID</TableCell>
                                <TableCell>User name</TableCell>
                                <TableCell align="right">Total price</TableCell>
                                <TableCell align="right">Receiver address</TableCell>
                                <TableCell align="right">Receiver phone</TableCell>
                                <TableCell align="right">Status</TableCell>
                                <TableCell align='center'>Action status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders && orders.map((row) => (
                                <Row
                                    key={row.id}
                                    order={row}
                                    postStatus={postStatus}
                                    statusBefore={statusBefore}
                                    rollBackStatus={rollBackStatus}
                                    idChange={idChange}
                                    setIdChange={setIdChange}
                                    setStatusBefore={setStatusBefore} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
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
            <Snackbar open={snackBarStatus} autoHideDuration={6000} onClose={() => setSnackBarStatus(false)}>
                <Alert
                    onClose={() => setSnackBarStatus(false)}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Update role success
                    <Button color="inherit" size="small"
                        onClick={() => {
                            rollBackStatus(idChange!, statusBefore!)
                        }

                        }
                    >
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
                    <Button color="inherit" size="small" >
                        UNDO
                    </Button>
                </Alert>
            </Snackbar> */}
            {/* Popup delete */}
            {/* <Popover
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
            </Popover> */}

        </Container>
    )
    // return (

    // );
}
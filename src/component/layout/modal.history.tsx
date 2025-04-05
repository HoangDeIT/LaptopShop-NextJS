"use client"

import { Box, Button, Chip, Collapse, IconButton, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useState } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FaceIcon from '@mui/icons-material/Face';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1200,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
interface IProps {
    open: boolean,
    setOpen: (v: boolean) => void,
    history?: IOrder[]
}
function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
    price: number,
) {
    return {
        name,
        calories,
        fat,
        carbs,
        protein,
        price,
        history: [
            {
                date: '2020-01-05',
                customerId: '11091700',
                amount: 3,
            },
            {
                date: '2020-01-02',
                customerId: 'Anonymous',
                amount: 1,
            },
        ],
    };
}
function Row(
    { order }:
        { order?: IOrder }) {

    const [open, setOpen] = useState(false);
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


    return (
        <>
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

        </>
    );
}

const ModalUpdateProfile = (props: IProps) => {
    const { open, setOpen, history } = props
    const fetchData = () => {

    }
    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"

        >

            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    History
                </Typography>
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

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {history && history.map((row) => (
                                <Row
                                    key={row.id}
                                    order={row}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Modal>
    )
}
export default ModalUpdateProfile
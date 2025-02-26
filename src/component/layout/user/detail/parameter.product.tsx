import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


interface IProps {
    product?: IProduct
}
export default function ParameterProduct(props: IProps) {
    const { product } = props;
    return (
        <TableContainer component={Paper}>
            <Table sx={{ width: "100%" }} aria-label="simple table">
                {/* <TableHead>
                    <TableRow>
                        <TableCell>Dessert (100g serving)</TableCell>
                        <TableCell align="left">Calories</TableCell>

                    </TableRow>
                </TableHead> */}
                <TableBody>

                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">
                            Name
                        </TableCell>
                        <TableCell align="left">{product?.name}</TableCell>
                    </TableRow>

                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">
                            Price
                        </TableCell>
                        <TableCell align="left">{product?.price} USD</TableCell>
                    </TableRow>


                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">
                            Short Description
                        </TableCell>
                        <TableCell align="left">{product?.shortDesc}</TableCell>
                    </TableRow>

                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">
                            Quantity
                        </TableCell>
                        <TableCell align="left">{product?.quantity}</TableCell>
                    </TableRow>

                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">
                            Sold
                        </TableCell>
                        <TableCell align="left">{product?.sold}</TableCell>
                    </TableRow>

                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">
                            Factory
                        </TableCell>
                        <TableCell align="left">{product?.factory.name}</TableCell> {/* assuming factory has a name */}
                    </TableRow>

                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">
                            Type
                        </TableCell>
                        <TableCell align="left">{product?.type}</TableCell>
                    </TableRow>

                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">
                            CPU
                        </TableCell>
                        <TableCell align="left">{product?.cpu}</TableCell>
                    </TableRow>

                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">
                            ROM
                        </TableCell>
                        <TableCell align="left">{product?.rom} GB</TableCell>
                    </TableRow>

                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">
                            RAM
                        </TableCell>
                        <TableCell align="left">{product?.ram} GB</TableCell>
                    </TableRow>

                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">
                            Screen
                        </TableCell>
                        <TableCell align="left">{product?.screen} inches</TableCell>
                    </TableRow>

                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">
                            OS
                        </TableCell>
                        <TableCell align="left">{product?.os}</TableCell>
                    </TableRow>

                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">
                            GPU
                        </TableCell>
                        <TableCell align="left">{product?.gpu}</TableCell>
                    </TableRow>

                </TableBody>
            </Table>
        </TableContainer>
    );
}
"use client"
import { useCurrentApp } from "@/context/app.context"
import { Box, Breadcrumbs, Checkbox, Container, FormControlLabel, Grid2, Link, Typography } from "@mui/material"
import Image from "next/image"

interface IProps {
    carts?: ICart[]
}
const OrderPage = (props: IProps) => {
    const { cart } = useCurrentApp();
    console.log(cart)

    return (
        <Container sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="/">
                    MUI
                </Link>
                <Link
                    underline="hover"
                    color="inherit"
                    href="/material-ui/getting-started/installation/"
                >
                    Core
                </Link>
                <Typography sx={{ color: 'text.primary' }}>Breadcrumbs</Typography>
            </Breadcrumbs>
            <Grid2 container spacing={2}>
                <Grid2 size={8} sx={{ backgroundColor: 'white', padding: 2, borderRadius: 4 }}>
                    <Box>
                        Sản phẩm trong đơn
                    </Box>
                    {
                        cart?.map((cart, index) => (
                            <div key={index}>
                                <Grid2 container sx={{}}>
                                    <Grid2 container size={3}>
                                        <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
                                        <div style={{ padding: 4, border: "1px solid grey" }}>
                                            <Image src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/product/${cart.product.mainImage}`} alt='Logo' width={70} height={70} />
                                        </div>
                                    </Grid2>

                                    <Grid2 size={9} container>

                                        <Grid2 size={7}>
                                            {cart.product.name} / {cart.product.cpu}/ {cart.product.ram}/ {cart.product.gpu}/ {cart.product.factory.name}
                                        </Grid2>
                                        <Grid2 size={5} sx={{ borderRadius: 3, display: "flex", justifyContent: "flex-end", paddingRight: 2 }}>
                                            <h3 style={{ color: "red" }}>
                                                {cart.product.price * cart.quantity}
                                            </h3>
                                        </Grid2>
                                    </Grid2>
                                </Grid2>
                                <hr />
                            </div>
                        ))
                    }
                </Grid2>
                <Grid2 size={4}>
                    <h1>Cart</h1>
                </Grid2>
            </Grid2>
        </Container>
    )
}
export default OrderPage
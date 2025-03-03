"use client"
// Import Swiper styles
// import required modules
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import React, { useRef, useState } from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SwiperProduct from './swiper.product';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Box, Breadcrumbs, Button, Container, Grid2, Link, Typography } from '@mui/material';
import ParameterProduct from './parameter.product';
import { addCart } from '@/utils/action/actionUser';
import { useCurrentApp } from '@/context/app.context';
import { useRouter } from 'next/navigation';
interface SwiperStyle extends React.CSSProperties {
    '--swiper-navigation-color': string;
    '--swiper-pagination-color': string;
}
interface IProps {
    product?: IProduct
}
export default function DetailProduct(props: IProps) {
    const { product } = props
    const router = useRouter();
    const { fetchCart } = useCurrentApp();
    return (
        <Container style={{
            minHeight: "80vh",
            marginTop: "50px"
        }}>
            <Container maxWidth={false}>
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
            </Container>

            <Grid2 container spacing={4} sx={{
                minHeight: "80vh"
            }}>
                <Grid2 size={7} sx={{ padding: "10px" }}>
                    <SwiperProduct product={product} />

                    <ParameterProduct product={product} />
                </Grid2>
                <Grid2 size={5} sx={{ backgroundColor: "white" }}>
                    <Typography typography={"h5"} sx={{
                        color: 'text.primary',
                        fontWeight: "bold"
                    }}>
                        {`${product?.name} /${product?.cpu} /${product?.ram} /${product?.rom} /${product?.screen} /${product?.os} ,${product?.gpu} ,${product?.type}`}

                    </Typography>
                    <div style={{ color: "grey" }}>No: {product?.id}</div>
                    <div style={{ color: "grey" }}>Quantity: {product?.quantity} {product?.quantity == 0 ? <span style={{ color: "red" }}>Out of stock</span> : <span style={{ color: "green" }}>In stock</span>}</div>
                    <Box sx={{
                        backgroundAttachment: 'scroll', // background-attachment
                        backgroundClip: 'border-box', // background-clip
                        backgroundColor: 'rgba(0, 0, 0, 0)', // background-color
                        backgroundImage: 'linear-gradient(rgb(255, 251, 235) 0px, rgb(255, 255, 255) 43.98%)', // background-image
                        backgroundOrigin: 'padding-box', // background-origin
                        backgroundPositionX: '0%', // background-position-x
                        backgroundPositionY: '0%', // background-position-y
                        border: '1px solid yellow', // Viền để dễ nhìn
                        padding: '10px',
                    }}>
                        <p>Mua ngay với giá</p>
                        <Typography typography={"h5"} sx={{
                            color: 'text.primary',
                            fontWeight: "bold"
                        }}>
                            {product?.price} USD

                        </Typography>
                        <div style={{

                        }}>
                            <div style={{
                                color: 'grey',
                                fontWeight: "bold",
                                textDecoration: "line-through",
                                fontSize: "15px",
                                display: 'inline', /* Đảm bảo cùng một dòng */
                            }
                            }>
                                {Math.round(product?.price! / 0.85)} USD
                            </div>

                            <span style={{ color: "red", textDecoration: "none", display: "inline" }}> 15%</span>


                        </div>
                        <div style={{
                            border: "1px solid red",
                            padding: "10px",
                            borderRadius: 10,
                            position: "relative"
                        }}>
                            <div style={{ position: "absolute", right: "0px", top: "0px", height: "16px", width: "16px", overflow: "hidden" }}>
                                <span style={{
                                    position: "absolute",
                                    zIndex: 10,
                                    height: "100%",
                                    width: "100%",
                                    transformOrigin: "top right",
                                    transform: "translateX(100%) rotate(45deg) scale(1.4)",
                                    backgroundColor: "red"
                                }}></span>
                                <svg width="7" height="8" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
                                    position: "absolute",
                                    right: "1px",
                                    top: "1px",
                                    zIndex: 20,
                                    color: "white"
                                }}>
                                    <path d="M7.03212 13.9072L3.56056 10.0017C3.28538 9.69214 2.81132 9.66425 2.50174 9.93944C2.19215 10.2146 2.16426 10.6887 2.43945 10.9983L6.43945 15.4983C6.72614 15.8208 7.2252 15.8355 7.53034 15.5303L18.0303 5.03033C18.3232 4.73744 18.3232 4.26256 18.0303 3.96967C17.7374 3.67678 17.2626 3.67678 16.9697 3.96967L7.03212 13.9072Z" fill="currentColor" />
                                </svg>
                            </div>
                            Khuyến mãi
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                            }}>
                                <CheckCircleOutlineIcon color='success' fontSize='small' />
                                <span>Giảm 15% </span>
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                            }}>
                                <CheckCircleOutlineIcon color='success' fontSize='small' />
                                <span>Free ship </span>
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                            }}>
                                <CheckCircleOutlineIcon color='success' fontSize='small' />
                                <span>Bảo hành 1 năm </span>
                            </div>
                        </div>
                        <Box sx={{
                            display: "flex",
                            gap: 2,
                            marginTop: 3
                        }}>
                            <Button
                                disabled={product?.quantity! <= 0}
                                variant="outlined" sx={{ borderRadius: 5 }} color='error'
                                onClick={() => {
                                    addCart(product?.id!)
                                    fetchCart()
                                }}
                            >
                                <ShoppingCartIcon />
                            </Button>
                            <Button
                                onClick={() => router.push("order?productId=" + product?.id)}
                                color='error'
                                disabled={product?.quantity! <= 0}
                                variant="contained" sx={{ width: "100%", height: 60, borderRadius: 5 }}>Mua ngay</Button>
                        </Box>
                    </Box>
                </Grid2>

            </Grid2>

        </Container>
    );
}

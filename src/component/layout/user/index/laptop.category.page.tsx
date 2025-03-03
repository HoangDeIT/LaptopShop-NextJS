"use client";

import { useState } from "react";
import { Box, Typography, Grid, Card, CardMedia, Button } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
interface IProps {
    factories?: IFactory[],
    type: string[],
    setType: (v: string[]) => void,
    factory: number[],
    setFactory: (v: number[]) => void
}
export default function LaptopCategoryPage(props: IProps) {
    const { factories, factory, setFactory, setType, type } = props


    const banners = [
        "/banner/banner_1.png",
        "/banner/banner_2.png",
        "/banner/banner_3.png",
        "/banner/banner_4.png",
        "/banner/banner_5.png",
        "/banner/banner_6.png",
        "/banner/banner_7.png",
        "/banner/banner_8.png",
        "/banner/banner_9.png",
        "/banner/banner_10.jpg",
        "/banner/banner_11.jpg"
    ];

    const categories = [
        { name: "AI", image: "/type-laptop/LaptopAi.jpg" },
        { name: "GAMING", image: "/type-laptop/LaptopGaming.jpg" },
        { name: "NORMAL", image: "/type-laptop/LaptopNormal.jpg" },
        { name: "LIGHTWEIGHT", image: "/type-laptop/LaptopLightWeight.jpg" },
        { name: "BUSINESS", image: "/type-laptop/LaptopBusiness.png" },
    ];

    return (
        <Box sx={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
            {/* Danh sách hãng laptop */}
            <Typography variant="h5" fontWeight="bold" sx={{
                marginBottom: "10px",

            }}>
                Laptop
            </Typography>
            {/* <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", marginBottom: "20px" }}>
                
            </Box> */}
            <Swiper
                slidesPerView={4}
                spaceBetween={10}
                navigation={true} modules={[Navigation]} className="mySwiper">
                {factories && factories.map((brand) => (
                    <SwiperSlide key={brand.name}>
                        <Card

                            onClick={() => {
                                if (factory.includes(brand.id)) {
                                    setFactory(factory.filter(id => id !== brand.id))
                                } else {
                                    setFactory([...factory, brand.id])
                                }
                            }}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 1,
                                padding: "10px",
                                borderRadius: "10px",
                                cursor: "pointer",
                                border: factory.includes(brand.id) ? "2px solid red" : "1px solid #ddd",
                                boxShadow: factory.includes(brand.id) ? "0px 4px 10px rgba(255,0,0,0.3)" : "none",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1
                                }}>
                                <Box style={{ border: "1px solid #ccc", borderRadius: "5px", padding: "4px 4px 0 4px" }}>
                                    <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/factory/${brand.image}`} style={{ overflow: "hidden" }} alt={brand.name} width={48} height={48} />
                                </Box>
                                <Typography sx={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    // width: '100%',
                                    width: '100px'
                                }} fontWeight="bold">{brand.name}</Typography>
                            </Box>

                            <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/factory/${brand.laptopImage}`} alt={brand.name} width={78} height={78} />
                        </Card>
                    </SwiperSlide>
                ))}
            </Swiper>
            {/* Swiper Banner */}
            <Swiper
                spaceBetween={10}
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000 }}
                loop={true}
                modules={[Pagination, Autoplay]}
                style={{ borderRadius: "10px", overflow: "hidden", margin: "20px 0" }}
            >
                {banners.map((image, index) => (
                    <SwiperSlide key={index}>
                        <CardMedia component="img" image={image} alt={`Banner ${image}`} sx={{ width: "100%", borderRadius: "10px" }} />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Danh mục laptop */}
            <Grid container spacing={2} sx={{ marginTop: "20px" }}>
                {categories.map((category) => (
                    <Grid
                        sx={{

                        }}
                        onClick={() => {
                            if (type.includes(category.name)) {
                                setType(type.filter(id => id !== category.name))
                            } else {
                                setType([...type, category.name])
                            }
                        }}
                        item xs={6} md={2.4} key={category.name}>
                        <Card sx={{
                            padding: "10px", cursor: "pointer",
                            display: "flex",
                            height: 90,
                            border: type.includes(category.name) ? "2px solid red" : "1px solid #ddd",
                            boxShadow: type.includes(category.name) ? "0px 4px 10px rgba(255,0,0,0.3)" : "none",
                            borderRadius: "10px",
                            alignItems: "center",
                            gap: 2
                        }}>
                            <CardMedia component="img" image={category.image} alt={category.name} sx={{ width: "60px", height: "60px" }} />
                            <Typography fontSize={14} sx={{ marginTop: "5px" }}>
                                {category.name}
                            </Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

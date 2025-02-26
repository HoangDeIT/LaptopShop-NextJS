"use client"
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';



// import required modules
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperProps, SwiperSlide } from 'swiper/react';
import Swiper1 from 'swiper';

interface SwiperStyle extends React.CSSProperties {
    '--swiper-navigation-color': string;
    '--swiper-pagination-color': string;
}
interface IProps {
    product?: IProduct
}
export default function SwiperProduct(props: IProps) {
    const { product } = props
    const [thumbsSwiper, setThumbsSwiper] = useState<Swiper1 | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);


    return (
        <>
            <Swiper
                style={{
                    '--swiper-navigation-color': 'blue',
                    '--swiper-pagination-color': '#fff',
                    width: "100%",
                    height: "300px",
                    overflowY: "hidden",
                    backgroundColor: "#fff",
                    ".swiperButtonNext": {
                        border: "1px solid red",
                    }
                } as SwiperStyle}
                loop={true}
                spaceBetween={10}
                navigation={true}
                slidesPerView={1}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper2"
                centeredSlides={true}
                onSlideChange={(s) => setActiveIndex(s.realIndex)}

            >
                <SwiperSlide style={{
                    display: "flex",
                    justifyContent: "center"
                }}>
                    <img
                        style={{
                            width: 'auto',
                            height: '100%',
                            display: "block"
                        }}
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/product/${product?.mainImage}`} />
                </SwiperSlide>
                {
                    product?.images && product?.images.map((image: IProductImage, index: number) => (
                        <SwiperSlide key={index} style={{
                            display: "flex",
                            justifyContent: "center"
                        }}>
                            <img
                                style={{
                                    width: "auto",
                                    height: "100%",
                                    display: "block"
                                }}
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/product/${image?.image}`} />
                        </SwiperSlide>
                    ))
                }
            </Swiper>
            <Swiper
                onSwiper={(swiper) => {
                    setThumbsSwiper(swiper)
                }}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper"
                style={{
                    width: "100%",
                    height: "50px",
                    overflowY: "hidden",
                    margin: 2,
                    padding: 2
                }}
            >
                <SwiperSlide style={{
                    display: "flex",
                    justifyContent: "center",
                    outline: activeIndex === 0 ? '1px solid grey' : 'none',


                }}>
                    <img
                        style={{
                            width: "auto",
                            height: "100%"

                        }}
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/product/${product?.mainImage}`} />
                </SwiperSlide>
                {
                    product?.images && product?.images.map((image: IProductImage, index: number) => (
                        <SwiperSlide key={index} style={{
                            display: "flex",
                            justifyContent: "center",
                            outline: activeIndex === 1 + index ? '2px solid grey' : 'none',
                        }}>
                            <img
                                style={{
                                    width: "auto",
                                    height: "100%"

                                }}

                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/product/${image?.image}`} />
                        </SwiperSlide>
                    ))
                }
            </Swiper>

        </>
    );
}

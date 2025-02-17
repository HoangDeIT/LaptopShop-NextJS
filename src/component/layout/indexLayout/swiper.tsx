"use client"
import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
// import required modules
import { Autoplay, Pagination } from 'swiper/modules';
import Image from 'next/image';
import Logo from "@/../public/logo.png"

export default function SlideShow() {
    return (
        <>
            <Swiper
                slidesPerView={3}
                spaceBetween={30}
                pagination={{
                    clickable: true,
                }}
                modules={[Pagination, Autoplay]}
                className="mySwiper"
                loop={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                navigation={true}
            >

                <SwiperSlide> <Image src={Logo} alt='Logo' width={300} height={100} /></SwiperSlide>
                <SwiperSlide> <Image src={Logo} alt='Logo' width={300} height={100} /></SwiperSlide>

                <SwiperSlide> <Image src={Logo} alt='Logo' width={300} height={100} /></SwiperSlide>

                <SwiperSlide> <Image src={Logo} alt='Logo' width={300} height={100} /></SwiperSlide>

                <SwiperSlide> <Image src={Logo} alt='Logo' width={300} height={100} /></SwiperSlide>
                <SwiperSlide> <Image src={Logo} alt='Logo' width={300} height={100} /></SwiperSlide>
                <SwiperSlide> <Image src={Logo} alt='Logo' width={300} height={100} /></SwiperSlide>

                <SwiperSlide> <Image src={Logo} alt='Logo' width={300} height={100} /></SwiperSlide>

                <SwiperSlide> <Image src={Logo} alt='Logo' width={300} height={100} /></SwiperSlide>

                <SwiperSlide> <Image src={Logo} alt='Logo' width={300} height={100} /></SwiperSlide>
                <SwiperSlide> <Image src={Logo} alt='Logo' width={300} height={100} /></SwiperSlide>
                <SwiperSlide> <Image src={Logo} alt='Logo' width={300} height={100} /></SwiperSlide>

                <SwiperSlide> <Image src={Logo} alt='Logo' width={300} height={100} /></SwiperSlide>

                <SwiperSlide> <Image src={Logo} alt='Logo' width={300} height={100} /></SwiperSlide>

                <SwiperSlide> <Image src={Logo} alt='Logo' width={300} height={100} /></SwiperSlide>

            </Swiper>
        </>
    );
}

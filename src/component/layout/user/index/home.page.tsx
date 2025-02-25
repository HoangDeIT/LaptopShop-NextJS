"use client"
import { Box, Button, Container, Grid2, Skeleton } from "@mui/material"
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Accordion, AccordionDetails, AccordionGroup, AccordionSummary } from "@mui/joy";
import FilterProduct from "./filter.product";
import CardProduct from "./card.product";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { sendRequest } from "@/utils/api";
interface IProps {
    factories?: IFactory[],
    data?: IProduct[],
    meta?: IMeta
}
const NoData = () => (
    <div style={{
        fontSize: 100
    }}>
        NOT FOULD
    </div>
)
const HomePage = (props: IProps) => {
    const { factories, meta } = props
    const [data, setData] = useState<IProduct[]>([])
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams()
    const page = searchParams.get("page");
    const filter = searchParams.get("filter");
    console.log(filter)
    const getNewPage = () => {
        const url = new URLSearchParams(searchParams);
        url.set("page", (meta!.page + 1).toString());
        router.replace(`${pathName}?${url.toString()}`, { scroll: false });
    }

    useEffect(() => {
        const url = new URLSearchParams(searchParams);
        url.set("page", "1");
        router.replace(`${pathName}?${url.toString()}`, { scroll: false });
    }, [])
    useEffect(() => {
        if (searchParams.get("page") !== "1")
            setData([...data, ...props.data!])
        else
            setData(props.data!)
    }, [page])
    useEffect(() => {
        setData([...props.data!])
    }, [filter])
    console.log(data)
    return (

        <Container style={{ minHeight: "100vh" }}>
            {/* <Swiper
                slidesPerView={3}
                spaceBetween={30}
                pagination={{
                    clickable: true,
                }}
                centeredSlides={true}

                modules={[Pagination, Autoplay]}
                className="mySwiper"
                loop={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}

            >
                {
                    factories && factories.map((factory) => {
                        return (
                            <SwiperSlide key={factory.id}>

                                <Image src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/factory/${factory.image}`} alt='Logo' width={100} height={100} />

                            </SwiperSlide>
                        )
                    })
                }


            </Swiper> */}

            <Grid2 container spacing={2} sx={{ m: 2 }}>
                <Grid2 size={4} sx={{

                }}>
                    <div style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 100,
                        height: "98vh",
                        overflow: "scroll",
                        msOverflowStyle: "none",
                        scrollbarWidth: "none"
                    }}>
                        <h1>Filter</h1>
                        <FilterProduct factories={factories} />
                    </div>

                </Grid2>
                <Grid2 size={8} container>
                    {data.length > 0 ?

                        <>
                            {
                                data && data.map((product, index) => {
                                    return (
                                        <Grid2 size={4} key={index}>
                                            <CardProduct product={product} />
                                        </Grid2>
                                    )
                                }
                                )
                            }
                            {meta!.page !== meta!.pages ?

                                <Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "baseline" }}>
                                    <Button endIcon={<ExpandMoreIcon />} style={{
                                        border: "1px solid grey",
                                        padding: "10px",
                                        cursor: "pointer",
                                        borderRadius: "35px",
                                        color: "black"
                                    }}
                                        onClick={getNewPage}>Xem thêm {meta?.total! - meta?.pageSize! * meta?.page!} kết quả</Button>
                                </Box> : <></>
                            }
                        </> : <NoData />
                    }

                </Grid2>

            </Grid2>
        </Container>

    )
}
export default HomePage
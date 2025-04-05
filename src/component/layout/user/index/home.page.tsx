"use client"
import { Box, Button, Container, FormControl, Grid2, InputLabel, MenuItem, Select, Skeleton } from "@mui/material"
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
import Link from "next/link";
import LaptopCategoryPage from "./laptop.category.page";
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
    //upstate
    const [type, setType] = useState<string[]>([])
    const [factory, setFactory] = useState<number[]>([])
    const [sort, setSort] = useState<"asc" | "desc" | "none">("none")
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
    }, [page, meta])
    // useEffect(() => {
    //     setData([...props.data!])
    // }, [filter])
    useEffect(() => {
        if (sort !== "none") {
            const url = new URLSearchParams(searchParams);
            url.set("sort", `price,${sort}`)
            url.set("page", "1")
            router.replace(`${pathName}?${url.toString()}`, { scroll: false });
        } else {
            const url = new URLSearchParams(searchParams);
            url.delete("sort")
            url.set("page", "1")
            router.replace(`${pathName}?${url.toString()}`, { scroll: false });
        }

    }, [sort])
    return (

        <Container style={{ minHeight: "100vh" }}>
            <LaptopCategoryPage factories={factories} factory={factory} setFactory={setFactory} type={type} setType={setType} />
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
                        <FilterProduct factories={factories} factory={factory} setFactory={setFactory} type={type} setType={setType} sort={sort} />
                    </div>

                </Grid2>

                <Grid2 size={8} >
                    <div style={{
                        display: "flex",
                        justifyContent: "flex-end"
                    }} >


                        <FormControl>
                            <InputLabel id="demo-simple-select-label">Sort</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={sort}
                                label="Sort"
                                onChange={(event) => setSort(event.target.value as any)}
                            >
                                <MenuItem value={"none"}>Không sắp xếp</MenuItem>
                                <MenuItem value={"asc"}>Tăng dần</MenuItem>
                                <MenuItem value={"desc"}>Giảm dần</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <Grid2 container>
                        {data.length > 0 ?

                            <>
                                {
                                    data && data.map((product, index) => {
                                        return (
                                            <Grid2 size={4} key={index}>
                                                <Link href={product.id.toString()} style={{ textDecoration: "none" }}>
                                                    <CardProduct product={product} />
                                                </Link>
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
            </Grid2>
        </Container>

    )
}
export default HomePage
import { Box, Button, Checkbox, Popover, TextField } from "@mui/material"
import { RefObject, useEffect, useState } from "react";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import SortIcon from '@mui/icons-material/Sort';
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface IProps {
    theadRef: RefObject<HTMLTableCellElement | null>

}
const PopoverSortProduct = (props: IProps) => {
    const { theadRef } = props
    const [filterEl, setFilterEl] = useState<HTMLTableCellElement | null>(null);
    const [sort, setSort] = useState<"id" | "createdAt" | "price" | "quantity" | "sold" | "type" | "cpu" | "ram" | "rom" | "screen" | "os" | "gpu" | "createdBy" | null>(null)
    const [sortBy, setSortBy] = useState<"asc" | "desc" | null>(null)

    const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSort(event.target.value as any === sort ? null : event.target.value as any);
    };

    const handleSortByChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSortBy(event.target.value as any === sortBy ? null : event.target.value as any);
    }
    const router = useRouter()
    const pathName = usePathname()
    const searchParams = useSearchParams()
    useEffect(() => {
        const sortFunction = async () => {
            if (sort && sortBy) {
                const url = new URLSearchParams(searchParams);
                url.set("sort", `${sort},${sortBy}`)
                router.replace(`${pathName}?${url.toString()}`, { scroll: false })
            }
        }
        sortFunction()
    }, [sort, sortBy])
    return (
        <>
            <Button variant="text" endIcon={<SortIcon />}
                onClick={e => setFilterEl(theadRef.current)}>Sort</Button>

            <Popover
                open={Boolean(filterEl)}

                anchorEl={filterEl}
                onClose={() => setFilterEl(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <Box sx={{
                    padding: "10px",
                    display: "flex",
                    gap: 10
                }}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Sort By</FormLabel>
                        <FormControlLabel
                            control={<Checkbox checked={sort === "id"} onChange={handleSortChange} value="id" />}
                            label="ID"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={sort === "createdAt"} onChange={handleSortChange} value="createdAt" />}
                            label="Create At"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={sort === "price"} onChange={handleSortChange} value="price" />}
                            label="Price"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={sort === "quantity"} onChange={handleSortChange} value="quantity" />}
                            label="Quantity"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={sort === "sold"} onChange={handleSortChange} value="sold" />}
                            label="Sold"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={sort === "type"} onChange={handleSortChange} value="type" />}
                            label="Type"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={sort === "cpu"} onChange={handleSortChange} value="cpu" />}
                            label="CPU"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={sort === "ram"} onChange={handleSortChange} value="ram" />}
                            label="RAM"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={sort === "rom"} onChange={handleSortChange} value="rom" />}
                            label="ROM"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={sort === "screen"} onChange={handleSortChange} value="screen" />}
                            label="Screen"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={sort === "os"} onChange={handleSortChange} value="os" />}
                            label="OS"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={sort === "gpu"} onChange={handleSortChange} value="gpu" />}
                            label="GPU"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={sort === "createdBy"} onChange={handleSortChange} value="createdBy" />}
                            label="Created By"
                        />
                    </FormControl>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Sort Order</FormLabel>
                        <FormControlLabel
                            control={<Checkbox checked={sortBy === "asc"} onChange={handleSortByChange} value="asc" />}
                            label="Ascending"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={sortBy === "desc"} onChange={handleSortByChange} value="desc" />}
                            label="Descending"
                        />
                    </FormControl>
                </Box>
            </Popover>
        </>
    )
}
export default PopoverSortProduct
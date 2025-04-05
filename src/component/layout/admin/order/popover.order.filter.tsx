import { Button, Checkbox, FormControl, FormControlLabel, FormLabel, InputLabel, ListItemText, MenuItem, Popover, Select, SelectChangeEvent, TextField } from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';
import { RefObject, useEffect, useRef, useState } from "react";
import OutlinedInput from '@mui/material/OutlinedInput';
import debounce from "debounce";
import { sfAnd, sfIn, sfLike, sfOr } from "spring-filter-query-builder";
import { Like } from "spring-filter-query-builder/dist/types/comparators";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface IProps {

    theadRef: RefObject<HTMLTableCellElement | null>
}
const PopoverOrderFilter = (props: IProps) => {
    const [filterEl, setFilterEl] = useState<HTMLTableCellElement | null>(null);
    const { theadRef } = props
    const [status, setStatus] = useState<Array<"PENDING" | "APPROVED" | "DELIVERED" | "REFUSED">>([]);
    const [searchUserName, setSearchUserName] = useState<string[]>([]);
    const ITEM_HEIGHT = 40;
    const ITEM_PADDING_TOP = 8;
    const router = useRouter()
    const pathName = usePathname()
    const searchParams = useSearchParams()

    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 200,
            },
        },
    };
    const handleChangeStatus = (event: SelectChangeEvent<typeof status>) => {
        const {
            target: { value },
        } = event;
        setStatus(
            // On autofill we get a stringified value.
            typeof value === 'string' ? (value.split(',') as ("PENDING" | "APPROVED" | "DELIVERED" | "REFUSED")[]) : value
        );
    };

    const debouncedFilter = useRef(debounce((status, searchUserName: string[]) => {
        const filterBuilder = []
        if (status.length > 0) {
            filterBuilder.push(sfIn("status", status))
        }
        if (searchUserName.length > 0) {
            const searchName: Like[] = [];
            searchUserName.forEach((name) => {
                searchName.push(sfLike("user.userName", `*${name.trim()}*`, true))
            })
            filterBuilder.push(sfOr(searchName))

        }
        if (status.length !== 0 || searchUserName.length !== 0) {
            const filter = sfAnd(filterBuilder);
            const url = new URLSearchParams(searchParams);
            url.set("filter", filter.toString())
            router.replace(`${pathName}?${url.toString()}`, { scroll: false })
        } else {
            const url = new URLSearchParams(searchParams);
            url.delete("filter");
            router.replace(`${pathName}?${url.toString()}`, { scroll: false })
        }

    }, 1000)).current
    useEffect(() => {
        //han che goi api qua nhieu
        debouncedFilter(status, searchUserName);
    }, [status, searchUserName])


    return (
        <>

            <Button variant="text" endIcon={<FilterListIcon />}
                onClick={e => setFilterEl(theadRef.current)}
                aria-describedby={"filterEl"}
            >Filter</Button>
            <Popover
                open={Boolean(filterEl)}
                sx={{
                    padding: 10
                }}
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

                <FormControl sx={{ m: 1, width: 250 }}>
                    <InputLabel id="demo-multiple-checkbox-label">Status</InputLabel>
                    <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        variant="standard"
                        value={status}
                        onChange={handleChangeStatus}
                        input={<OutlinedInput label="Status" />}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                    >
                        <MenuItem value={"PENDING"}>
                            <Checkbox checked={status.includes('PENDING')} />
                            <ListItemText primary={"PENDING"} />
                        </MenuItem>

                        <MenuItem value={"APPROVED"}>
                            <Checkbox checked={status.includes('APPROVED')} />
                            <ListItemText primary={"APPROVED"} />
                        </MenuItem>

                        <MenuItem value={"DELIVERED"}>
                            <Checkbox checked={status.includes('DELIVERED')} />
                            <ListItemText primary={"DELIVERED"} />
                        </MenuItem>

                        <MenuItem value={"REFUSED"}>
                            <Checkbox checked={status.includes('REFUSED')} />
                            <ListItemText primary={"REFUSED"} />
                        </MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ m: 1, width: 300 }}>
                    <TextField label="Search username"
                        onChange={e => setSearchUserName(typeof e.target.value === 'string' ? e.target.value.split(',') : [])}
                        value={searchUserName}
                        variant="outlined" />
                </FormControl>
            </Popover>

        </>
    )
}
export default PopoverOrderFilter
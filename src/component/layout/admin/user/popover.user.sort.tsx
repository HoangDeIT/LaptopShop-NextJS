import { Box, Button, Checkbox, Popover, TextField } from "@mui/material"
import { RefObject, useState } from "react";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import SortIcon from '@mui/icons-material/Sort';

interface IProps {
    theadRef: RefObject<HTMLTableCellElement | null>
    sort: "id" | "createdAt" | "email" | "userName" | "role" | "type" | "createdBy" | null,
    sortBy: "asc" | "desc" | null,
    setSortBy: (v: "asc" | "desc" | null) => void
    setSort: (v: "id" | "createdAt" | "email" | "userName" | "role" | "type" | "createdBy" | null) => void
}
const PopoverUserSort = (props: IProps) => {
    const { setSort, setSortBy, sort, sortBy, theadRef } = props
    const [filterEl, setFilterEl] = useState<HTMLTableCellElement | null>(null);



    const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSort(event.target.value as any);
    };

    const handleSortByChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSortBy(event.target.value as any);
    }

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
                            control={<Checkbox checked={sort === "email"} onChange={handleSortChange} value="email" />}
                            label="Email"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={sort === "userName"} onChange={handleSortChange} value="userName" />}
                            label="User Name"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={sort === "role"} onChange={handleSortChange} value="role" />}
                            label="Role"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={sort === "type"} onChange={handleSortChange} value="type" />}
                            label="Type"
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
export default PopoverUserSort
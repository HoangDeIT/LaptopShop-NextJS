import { Box, Button, Popover, TextField } from "@mui/material"
import { RefObject, useState } from "react";

import { Search } from "@mui/icons-material";
interface IProps {
    theadRef: RefObject<HTMLTableCellElement | null>
    searchUserName: string[],
    setSearchUserName: (v: string[]) => void
    searchEmail: string[],
    setSearchEmail: (v: string[]) => void
}
const PopoverUserSearch = (props: IProps) => {
    const { searchEmail, searchUserName, setSearchEmail, setSearchUserName, theadRef } = props
    const [filterEl, setFilterEl] = useState<HTMLTableCellElement | null>(null);



    return (
        <>
            <Button variant="text" endIcon={<Search />}
                onClick={e => setFilterEl(theadRef.current)}
                aria-describedby={"filterEl"}
            >Filter</Button>
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
                    <TextField
                        label="Search Email"
                        variant="standard"
                        onChange={e => setSearchEmail(typeof e.target.value === 'string' ? e.target.value.split(',') : [])}
                        value={searchEmail} />
                    <TextField label="Search username"
                        onChange={e => setSearchUserName(typeof e.target.value === 'string' ? e.target.value.split(',') : [])}
                        value={searchUserName}
                        variant="standard" />
                </Box>
            </Popover>
        </>
    )
}
export default PopoverUserSearch
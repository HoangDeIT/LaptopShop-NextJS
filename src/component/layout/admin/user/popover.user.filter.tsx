import { Box, Button, Popover } from "@mui/material"
import { RefObject, useState } from "react";
import FilterListIcon from '@mui/icons-material/FilterList';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
interface IProps {
    theadRef: RefObject<HTMLTableCellElement | null>
    role: string[],
    setRole: (v: string[]) => void,
    type: string[],
    setType: (v: string[]) => void,
    startDate: Dayjs | null,
    setStartDate: (v: Dayjs | null) => void,
    endDate: Dayjs | null,
    setEndDate: (v: Dayjs | null) => void
}
const PopoverUserFilter = (props: IProps) => {
    const { theadRef, role, setRole, type, setType, endDate, setEndDate, setStartDate, startDate } = props
    const [filterEl, setFilterEl] = useState<HTMLTableCellElement | null>(null);
    const ITEM_HEIGHT = 32;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 125,
            },
        },
    };
    const handleChange = (event: SelectChangeEvent<typeof role>) => {
        const {
            target: { value },
        } = event;
        setRole(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    const handleChangeType = (event: SelectChangeEvent<typeof type>) => {
        const {
            target: { value },
        } = event;
        setType(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };
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
                <Box sx={{
                    padding: 1
                }}>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-around"
                    }}>
                        <FormControl sx={{ m: 1, width: 150 }}>
                            <InputLabel id="demo-multiple-checkbox-label">Role</InputLabel>
                            <Select
                                labelId="demo-multiple-checkbox-label"
                                id="demo-multiple-checkbox"
                                multiple
                                variant="standard"
                                value={role}
                                onChange={handleChange}
                                input={<OutlinedInput label="Role" />}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={MenuProps}
                            >

                                <MenuItem value={"ADMIN"}>
                                    <Checkbox checked={role.includes('ADMIN')} />
                                    <ListItemText primary={"ADMIN"} />
                                </MenuItem>

                                <MenuItem value={"USER"}>
                                    <Checkbox checked={role.includes('USER')} />
                                    <ListItemText primary={"USER"} />
                                </MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl sx={{ m: 1, width: 150 }}>
                            <InputLabel id="demo-multiple-checkbox-label">Type</InputLabel>
                            <Select
                                labelId="demo-multiple-checkbox-label"
                                id="demo-multiple-checkbox"
                                multiple
                                variant="standard"
                                value={type}
                                onChange={handleChangeType}
                                input={<OutlinedInput label="Type" />}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={MenuProps}
                            >

                                <MenuItem value={"SYSTEM"}>
                                    <Checkbox checked={type.includes('SYSTEM')} />
                                    <ListItemText primary={"SYSTEM"} />
                                </MenuItem>

                                <MenuItem value={"GOOGLE"}>
                                    <Checkbox checked={type.includes('GOOGLE')} />
                                    <ListItemText primary={"GOOGLE"} />
                                </MenuItem>
                                <MenuItem value={"GITHUB"}>
                                    <Checkbox checked={type.includes('GITHUB')} />
                                    <ListItemText primary={"GITHUB"} />
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-around",
                        gap: 2
                    }}>
                        <DatePicker
                            label="Create at begin"
                            value={startDate}
                            onChange={(newValue) => {
                                setStartDate(newValue);
                            }}
                        />
                        <DatePicker
                            label="Create at end"
                            value={endDate}
                            onChange={(newValue) => {
                                setEndDate(newValue);
                            }}

                        />
                    </Box>
                </Box>
            </Popover>
        </>
    )
}
export default PopoverUserFilter
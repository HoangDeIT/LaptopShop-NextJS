"use client"
import { Box, Button, Divider, InputAdornment, Popover, Slider, TextField } from "@mui/material"
import { RefObject, useEffect, useRef, useState } from "react";
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
import { Search } from "@mui/icons-material";
import debounce from "debounce";
import { sfAnd, sfGe, sfIn, sfLe, sfLike, sfLt } from "spring-filter-query-builder";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
function valuetext(value: number) {
    return `${value}°C`;
}
interface IProps {
    factoryList?: IFactory[];
    theadRef: RefObject<HTMLTableCellElement | null>
}
const PopoverProductFilterAndSearch = ({ factoryList, theadRef }: IProps) => {
    const [filterEl, setFilterEl] = useState<HTMLTableCellElement | null>(null);
    const ITEM_HEIGHT = 50;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 125,
            },
        },
    };

    const minPrice = 10;
    const minRam = 10;
    const minRom = 128;
    const minScreen = 10;
    const router = useRouter()
    const pathName = usePathname()
    const searchParams = useSearchParams()

    const [price, setPrice] = useState<[number, number]>([0, 2000]);
    const [ram, setRam] = useState<[number, number]>([0, 256]);
    const [rom, setRom] = useState<[number, number]>([0, 2560]);
    const [screen, setScreen] = useState<[number, number]>([0, 32]);
    const [quantity, setQuantity] = useState<[number, number]>([0, 2560]);
    const [sold, setSold] = useState<[number, number]>([0, 2560]);
    const [os, setOs] = useState<string>('');
    const [cpu, setCpu] = useState<string>('');
    const [gpu, setGpu] = useState<string>('');
    const [name, setName] = useState<string>('');

    const [factory, setFactory] = useState<number[]>([]);
    const [type, setType] = useState<string[]>([]);
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const debouncedFilter = useRef(debounce((price, ram, rom, screen, quantity, sold, os, cpu, gpu, name, factory, type, startDate, endDate) => {
        const filterBuilder = []
        if (price[0] >= 0 && price[1] >= price[0]) {
            filterBuilder.push(sfAnd([sfGe("price", price[0]), sfLe("price", price[1])]))
        }
        if (ram[0] >= 0 && ram[1] >= ram[0]) {
            filterBuilder.push(sfAnd([sfGe("ram", ram[0]), sfLe("ram", ram[1])]))
        }
        if (rom[0] >= 0 && rom[1] >= rom[0]) {
            filterBuilder.push(sfAnd([sfGe("rom", rom[0]), sfLe("rom", rom[1])]))
        }
        if (screen[0] >= 0 && screen[1] >= screen[0]) {
            filterBuilder.push(sfAnd([sfGe("screen", screen[0]), sfLe("screen", screen[1])]))
        }
        if (quantity[0] >= 0 && quantity[1] >= quantity[0]) {
            filterBuilder.push(sfAnd([sfGe("quantity", quantity[0]), sfLe("quantity", quantity[1])]))
        }
        if (sold[0] >= 0 && sold[1] >= sold[0]) {
            filterBuilder.push(sfAnd([sfGe("sold", sold[0]), sfLe("sold", sold[1])]))
        }
        if (os.length > 0) {
            filterBuilder.push(sfLike("os", `*${os}*`, true))
        }
        if (cpu.length > 0) {
            filterBuilder.push(sfLike("cpu", `*${cpu}*`, true))
        }
        if (gpu.length > 0) {
            filterBuilder.push(sfLike("gpu", `*${gpu}*`, true))
        }
        if (name.length > 0) {
            filterBuilder.push(sfLike("name", `*${name}*`, true))
        }
        if (factory.length > 0) {
            filterBuilder.push(sfIn("factory.id", factory))
        }
        if (type.length > 0) {
            filterBuilder.push(sfIn("type", type))
        }
        if (startDate !== null && endDate !== null) {
            filterBuilder.push(sfLt("createdAt", endDate.format("YYYY-MM-DD")))
            filterBuilder.push(sfGe("createdAt", startDate.format("YYYY-MM-DD")))
        }
        if (filterBuilder.length > 0) {
            const filter = sfAnd(filterBuilder);
            const url = new URLSearchParams(searchParams);
            url.set("filter", filter.toString())
            console.log("How")
            router.replace(`${pathName}?${url.toString()}`, { scroll: false })
        } else {
            const url = new URLSearchParams(searchParams);
            url.delete("filter");
            console.log(url)
            router.replace(`${pathName}?${url.toString()}`, { scroll: false })
        }



    }, 1000)).current
    useEffect(() => {
        //han che goi api qua nhieu
        console.log(":v222")
        debouncedFilter(price, ram, rom, screen, quantity, sold, os, cpu, gpu, name, factory, type, startDate, endDate);
    }, [price, ram, rom, screen, quantity, sold, os, cpu, gpu, name, factory, type, startDate, endDate])
    const handleChangeFactory = (event: SelectChangeEvent<number[]>) => {
        const {
            target: { value },
        } = event;

        setFactory(
            typeof value === "string"
                ? [] // Nếu giá trị là string, giữ danh sách rỗng (tránh lỗi)
                : value.map((id) => Number(id)) // Chuyển thành số
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
    const handleChangeRam = (
        event: Event,
        newValue: number | number[],
        activeThumb: number,
    ) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (newValue[1] - newValue[0] < minRam) {
            if (activeThumb === 0) {
                const clamped = Math.min(newValue[0], 256 - minRam);
                setRam([clamped, clamped + minRam]);
            } else {
                const clamped = Math.max(newValue[1], minRam);
                setRam([clamped - minRam, clamped]);
            }
        } else {
            //@ts-ignore
            setRam(newValue as number[]);
        }
    };
    const handleChangeRom = (
        event: Event,
        newValue: number | number[],
        activeThumb: number,
    ) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (newValue[1] - newValue[0] < minRom) {
            if (activeThumb === 0) {
                const clamped = Math.min(newValue[0], 2560 - minRom);
                setRom([clamped, clamped + minRom]);
            } else {
                const clamped = Math.max(newValue[1], minRom);
                setRom([clamped - minRom, clamped]);
            }
        } else {
            //@ts-ignore
            setRom(newValue as number[]);
        }
    };
    const handleChangeScreen = (
        event: Event,
        newValue: number | number[],
        activeThumb: number,
    ) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (newValue[1] - newValue[0] < minScreen) {
            if (activeThumb === 0) {
                const clamped = Math.min(newValue[0], 32 - minScreen);
                setScreen([clamped, clamped + minScreen]);
            } else {
                const clamped = Math.max(newValue[1], minScreen);
                setScreen([clamped - minScreen, clamped]);
            }
        } else {
            //@ts-ignore
            setScreen(newValue as number[]);
        }
    };
    return (
        <>
            <Button variant="text" endIcon={<FilterListIcon />}
                onClick={e => setFilterEl(theadRef.current)}
                aria-describedby={"filterEl"}
            >Filter & Search</Button>
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
                    <TextField
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        placeholder="Search by name"
                        value={name}

                        onChange={(e) => {
                            setName(e.target.value)
                        }}
                        sx={{
                            borderRadius: "10px",
                            marginBottom: "10px",
                            width: "100%"
                        }}
                    />
                    <Divider />
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-around"
                    }}>


                        <FormControl sx={{ m: 1, width: 150 }}>
                            <InputLabel id="demo-multiple-checkbox-label">Factory</InputLabel>
                            <Select
                                labelId="demo-multiple-checkbox-label"
                                id="demo-multiple-checkbox"
                                multiple
                                variant="standard"
                                value={factory}
                                onChange={handleChangeFactory}
                                input={<OutlinedInput label="Factory" />}
                                renderValue={(selected) =>
                                    factoryList?.filter((f) => selected.includes(f.id)).map((f) => f.name).join(", ")
                                } // Hiển thị tên các factory
                                MenuProps={MenuProps}
                            >
                                {
                                    factoryList && factoryList.map((f) => (
                                        <MenuItem key={f.id} value={f.id}>
                                            <Checkbox checked={factory.includes(f.id)} />
                                            <ListItemText primary={f.name} />
                                        </MenuItem>
                                    ))
                                }
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

                                <MenuItem value={"GAMING"}>
                                    <Checkbox checked={type.includes('GAMING')} />
                                    <ListItemText primary={"GAMING"} />
                                </MenuItem>

                                <MenuItem value={"NORMAL"}>
                                    <Checkbox checked={type.includes('NORMAL')} />
                                    <ListItemText primary={"NORMAL"} />
                                </MenuItem>
                                <MenuItem value={"AI"}>
                                    <Checkbox checked={type.includes('AI')} />
                                    <ListItemText primary={"AI"} />
                                </MenuItem>
                                <MenuItem value={"LIGHTWEIGHT"}>
                                    <Checkbox checked={type.includes('LIGHTWEIGHT')} />
                                    <ListItemText primary={"LIGHT WEIGHT"} />
                                </MenuItem>
                                <MenuItem value={"BUSINESS"}>
                                    <Checkbox checked={type.includes('BUSINESS')} />
                                    <ListItemText primary={"BUSINESS"} />
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
                    <div style={{
                        display: "flex",
                        gap: 50,
                        border: "1px solid #ccc",
                        padding: 20,
                        margin: 10,
                        maxWidth: 600
                    }}>
                        <div>
                            <p style={{ margin: 0 }}>Ram</p>
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <TextField value={ram[0]} type="number" onChange={e => setRam([e.target.value as any, ram[1]])} />
                                <p>~</p>
                                <TextField value={ram[1]} type="number" onChange={e => setRam([ram[0], e.target.value as any])} />
                            </Box>

                            <Slider
                                getAriaLabel={() => 'Minimum distance shift'}
                                value={ram}
                                max={256}
                                onChange={handleChangeRam}
                                valueLabelDisplay="auto"
                                getAriaValueText={valuetext}
                                disableSwap

                            />
                        </div>
                        <div>
                            <p style={{ margin: 0 }}>Screen</p>
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <TextField value={screen[0]} type="number" onChange={e => setScreen([e.target.value as any, screen[1]])} />
                                <p>~</p>
                                <TextField value={screen[1]} type="number" onChange={e => setScreen([screen[0], e.target.value as any])} />
                            </Box>

                            <Slider
                                getAriaLabel={() => 'Minimum distance shift'}
                                value={screen}
                                max={32}
                                onChange={handleChangeScreen}
                                valueLabelDisplay="auto"
                                getAriaValueText={valuetext}
                                disableSwap
                            />
                        </div>


                    </div>
                    <div style={{
                        display: "flex",
                        gap: 50,
                        border: "1px solid #ccc",
                        padding: 20,
                        margin: 10,
                        maxWidth: 600
                    }}>

                        <div style={{ maxWidth: 300 }}>
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <TextField label="ROM" value={rom[0]} type="number" onChange={e => setRom([e.target.value as any, rom[1]])} />
                                <p>~</p>
                                <TextField value={rom[1]} type="number" onChange={e => setRom([rom[0], e.target.value as any])} />
                            </Box>

                            <Slider
                                sx={{ marginTop: 4 }}
                                getAriaLabel={() => 'Minimum distance shift'}
                                value={rom}
                                max={2560}
                                onChange={handleChangeRom}
                                valueLabelDisplay="auto"
                                getAriaValueText={valuetext}
                                disableSwap
                            />
                        </div>
                        <div style={{ display: "flex", gap: 10, flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                            <TextField
                                value={gpu}
                                onChange={e => setGpu(e.target.value)}
                                label="GPU"
                            />
                            <TextField
                                value={cpu}
                                onChange={e => setCpu(e.target.value)}
                                label="CPU"
                            />
                            <TextField
                                value={os}
                                onChange={e => setOs(e.target.value)}
                                label="OS"
                            />
                        </div>
                    </div>

                </Box>



                <Box sx={{ display: "flex", gap: 2, flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <TextField label="Price" value={price[0]} type="number" onChange={e => setPrice([e.target.value as any, price[1]])} />
                        <p>~</p>
                        <TextField value={price[1]} type="number" onChange={e => setPrice([price[0], e.target.value as any])} />
                    </Box>
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <TextField label="Sold" value={sold[0]} type="number" onChange={e => setSold([e.target.value as any, sold[1]])} />
                        <p>~</p>
                        <TextField value={sold[1]} type="number" onChange={e => setSold([sold[0], e.target.value as any])} />
                    </Box>
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <TextField label="Quantity" value={quantity[0]} type="number" onChange={e => setQuantity([e.target.value as any, quantity[1]])} />
                        <p>~</p>
                        <TextField value={quantity[1]} type="number" onChange={e => setQuantity([quantity[0], e.target.value as any])} />
                    </Box>

                </Box>

            </Popover>
        </>
    )
}
export default PopoverProductFilterAndSearch
import { AccordionGroup, Accordion, AccordionDetails, AccordionSummary } from "@mui/joy"
import { Box, FormControlLabel, FormGroup, Input, Slider, TextField } from "@mui/material"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import Checkbox from '@mui/material/Checkbox';
import debounce from "debounce";
import { sfAnd, sfGe, sfIn, sfLe, sfLike } from "spring-filter-query-builder";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
function valuetext(value: number) {
    return `${value}°C`;
}
interface IProps {
    factories?: IFactory[],
    type: string[],
    setType: (v: string[]) => void,
    factory: number[],
    setFactory: (v: number[]) => void

}
const FilterProduct = (props: IProps) => {
    const { factories, setFactory, setType, factory, type } = props
    const minPrice = 10;
    const minRam = 10;
    const minRom = 128;
    const minScreen = 10;

    const [price, setPrice] = useState<[number, number]>([1, 2000]);
    const [ram, setRam] = useState<[number, number]>([1, 256]);
    const [rom, setRom] = useState<[number, number]>([1, 2560]);
    const [screen, setScreen] = useState<[number, number]>([1, 32]);
    const [os, setOs] = useState<string>('');
    const [cpu, setCpu] = useState<string>('');
    const [gpu, setGpu] = useState<string>('');

    const router = useRouter();
    const searchParams = useSearchParams()
    const pathName = usePathname()
    const debouncedFilter = useRef(debounce((type: string[],
        price: number[],
        ram: [number, number],
        rom: [number, number],
        screen: [number, number],
        os: string,
        cpu: string,
        gpu: string,
        factory: number[]) => {
        const filterBuilder = []
        if (factory?.length > 0) {
            filterBuilder.push(sfIn("factory.id", factory));
        }
        if (type.length > 0) {
            filterBuilder.push(sfIn("type", type));
        }
        if (os.length > 0) {
            filterBuilder.push(sfLike("os", `*${os}*`, true));
        }
        if (cpu.length > 0) {
            filterBuilder.push(sfLike("cpu", `*${cpu}*`, true));
        }
        if (gpu.length > 0) {
            filterBuilder.push(sfLike("gpu", `${type}`, true));
        }
        filterBuilder.push(sfLe("price", price[1]));
        filterBuilder.push(sfGe("price", price[0]));
        filterBuilder.push(sfLe("ram", ram[1]));
        filterBuilder.push(sfGe("ram", ram[0]));
        filterBuilder.push(sfLe("rom", rom[1]));
        filterBuilder.push(sfGe("rom", rom[0]));
        filterBuilder.push(sfLe("screen", screen[1]));
        filterBuilder.push(sfGe("screen", screen[0]));
        const filter = sfAnd(filterBuilder);
        const url = new URLSearchParams(searchParams);
        url.set("filter", filter.toString())
        url.set("page", "1")
        router.replace(`${pathName}?${url.toString()}`, { scroll: false })


    }, 1000)).current
    useEffect(() => {
        console.log("Test")
        debouncedFilter(type, price, ram, rom, screen, os, cpu, gpu, factory)
    }, [type, price, ram, rom, screen, os, cpu, gpu, factory])
    const handleChangeType = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setType([...type, e.target.value])
        } else {
            setType(type.filter(item => item !== e.target.value))
        }
    }
    const handleChangePrice = (
        event: Event,
        newValue: number | number[],
        activeThumb: number,
    ) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (newValue[1] - newValue[0] < minPrice) {
            if (activeThumb === 0) {
                const clamped = Math.min(newValue[0], 2000 - minPrice);
                setPrice([clamped, clamped + minPrice]);
            } else {
                const clamped = Math.max(newValue[1], minPrice);
                setPrice([clamped - minPrice, clamped]);
            }
        } else {
            //@ts-ignore
            setPrice(newValue as number[]);
        }
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
        <AccordionGroup sx={{ maxWidth: 400, backgroundColor: "white" }}>
            <Accordion defaultExpanded>
                <AccordionSummary>Factory</AccordionSummary>
                <AccordionDetails >
                    <Box sx={{
                        display: "flex", gap: 1,
                        flexWrap: "wrap"
                    }}>
                        {factories && factories.map(item => (
                            <div key={item.id} style={{
                                border: "1px solid", borderRadius: 20, padding: 1,
                                textAlign: "center",
                                cursor: "pointer", flexBasis: "45%", boxSizing: "border-box", borderColor: factory.includes(item.id) ? "red" : "#e0e0e0"
                            }}
                                onClick={() => {
                                    if (factory.includes(item.id)) {
                                        setFactory(factory.filter(id => id !== item.id))
                                    } else {
                                        setFactory([...factory, item.id])
                                    }
                                }}
                            >
                                {item.name}
                            </div>
                        ))}


                    </Box>


                </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded >
                <AccordionSummary>Type</AccordionSummary>
                <AccordionDetails>
                    <FormGroup >
                        <FormControlLabel control={<Checkbox
                            value="GAMING" checked={type.includes("GAMING")} onChange={handleChangeType} />} label="GAMING" />
                        <FormControlLabel control={<Checkbox
                            value="NORMAL" checked={type.includes("NORMAL")} onChange={handleChangeType} />} label="NORMAL" />
                        <FormControlLabel control={<Checkbox
                            value="AI" checked={type.includes("AI")} onChange={handleChangeType} />} label="AI" />
                        <FormControlLabel control={<Checkbox
                            value="LIGHTWEIGHT" checked={type.includes("LIGHTWEIGHT")} onChange={handleChangeType} />} label="LIGHTWEIGHT" />
                        <FormControlLabel control={<Checkbox
                            value="BUSINESS" checked={type.includes("BUSINESS")} onChange={handleChangeType} />} label="BUSINESS" />

                    </FormGroup>
                </AccordionDetails>
            </Accordion>
            <Accordion  >
                <AccordionSummary>Price USD</AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <TextField value={price[0]} type="number" onChange={e => setPrice([e.target.value as any, price[1]])} />
                        <p>~</p>
                        <TextField value={price[1]} type="number" onChange={e => setPrice([price[0], e.target.value as any])} />
                    </Box>

                    <Slider
                        sx={{ marginTop: 4 }}
                        getAriaLabel={() => 'Minimum distance shift'}
                        value={price}
                        max={2000}
                        onChange={handleChangePrice}
                        valueLabelDisplay="auto"
                        getAriaValueText={valuetext}
                        disableSwap
                    />
                </AccordionDetails>
            </Accordion>
            <Accordion  >
                <AccordionSummary>Ram GB</AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <TextField value={ram[0]} type="number" onChange={e => setRam([e.target.value as any, ram[1]])} />
                        <p>~</p>
                        <TextField value={ram[1]} type="number" onChange={e => setRam([ram[0], e.target.value as any])} />
                    </Box>

                    <Slider
                        sx={{ marginTop: 4 }}
                        getAriaLabel={() => 'Minimum distance shift'}
                        value={ram}
                        max={256}
                        onChange={handleChangeRam}
                        valueLabelDisplay="auto"
                        getAriaValueText={valuetext}
                        disableSwap
                    />
                </AccordionDetails>
            </Accordion>
            <Accordion  >
                <AccordionSummary>Rom GB</AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <TextField value={rom[0]} type="number" onChange={e => setRom([e.target.value as any, rom[1]])} />
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
                </AccordionDetails>
            </Accordion>
            <Accordion  >
                <AccordionSummary>Screen</AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <TextField value={screen[0]} type="number" onChange={e => setScreen([e.target.value as any, screen[1]])} />
                        <p>~</p>
                        <TextField value={screen[1]} type="number" onChange={e => setScreen([screen[0], e.target.value as any])} />
                    </Box>

                    <Slider
                        sx={{ marginTop: 4 }}
                        getAriaLabel={() => 'Minimum distance shift'}
                        value={screen}
                        max={32}
                        onChange={handleChangeScreen}
                        valueLabelDisplay="auto"
                        getAriaValueText={valuetext}
                        disableSwap
                    />
                </AccordionDetails>
            </Accordion>
            <Accordion >
                <AccordionSummary>Order</AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
                        <TextField
                            value={os}
                            onChange={e => setOs(e.target.value)}
                            label="OS"
                        />
                        <TextField
                            value={cpu}
                            onChange={e => setCpu(e.target.value)}
                            label="CPU"
                        />
                        <TextField
                            value={gpu}
                            onChange={e => setGpu(e.target.value)}
                            label="GPU"
                        />
                    </Box>
                </AccordionDetails>
            </Accordion>
        </AccordionGroup>
    )
}
export default FilterProduct
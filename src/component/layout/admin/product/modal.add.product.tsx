"use client"
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';

import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { forwardRef, useRef, useState } from 'react';
import { Box, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Input, InputLabel, MenuItem, Select, Slider, styled, TextField } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});
const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<unknown>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
interface IProps {
    open: boolean,
    setOpen: (v: boolean) => void,
    factories?: IFactory[]
}
export default function ModalAddProduct(props: IProps) {
    const { open, setOpen, factories } = props
    {
        const nameRef = useRef<HTMLInputElement>(null);
        const priceRef = useRef<HTMLInputElement>(null);
        const quantityRef = useRef<HTMLInputElement>(null);
        const [factory, setFactory] = useState<string>("")
        const [type, setType] = useState<string>("")
        const cpuRef = useRef<HTMLInputElement>(null);
        const [ram, setRam] = useState(0);
        const [rom, setRom] = useState(0);

        const screenRef = useRef<HTMLInputElement>(null);
        const osRef = useRef<HTMLInputElement>(null);
        const gpuRef = useRef<HTMLInputElement>(null);
        const [previewUrlMain, setPreviewUrl] = useState<string | null>(null);
        const [file, setFile] = useState<File | null>(null);

        const handleClickOpen = () => {
            setOpen(true);
        };

        const handleClose = () => {
            setOpen(false);
        };

        return (
            <>
                <Dialog
                    maxWidth="xl"
                    fullWidth
                    open={open}
                    onClose={handleClose}
                    TransitionComponent={Transition}
                >
                    <DialogTitle>Subscribe</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To subscribe to this website, please enter your email address here. We
                            will send updates occasionally.
                        </DialogContentText>
                        <Box>
                            <TextField
                                required
                                margin="dense"
                                label="Name"
                                type="text"
                                sx={{ width: "20%" }}
                                variant="outlined"
                                inputRef={nameRef}
                            />

                            <FormControl color="info" sx={{ m: 1, width: "10%" }}>
                                <InputLabel>Factory</InputLabel>
                                <Select
                                    value={factory}
                                    onChange={(e) => setFactory(e.target.value)}
                                    label="Factory"
                                >
                                    {
                                        factories && factories.map((d) => (
                                            <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                                        ))
                                    }

                                </Select>
                            </FormControl>
                            <FormControl color="info" sx={{ m: 1, width: "10%" }}>
                                <InputLabel>Type</InputLabel>
                                <Select
                                    value={factory}
                                    onChange={(e) => setFactory(e.target.value)}
                                    label="Factory"
                                >


                                    <MenuItem value={"GAMING"}>GAMING</MenuItem>
                                    <MenuItem value={"NORMAL"}>NORMAL</MenuItem>
                                    <MenuItem value={"AL"}>AL</MenuItem>
                                    <MenuItem value={"LIGHTWEIGHT"}>LIGHTWEIGHT</MenuItem>
                                    <MenuItem value={"BUSINESS"}>BUSINESS</MenuItem>


                                </Select>
                            </FormControl>

                            <TextField
                                sx={{ m: 1, width: "10%" }}
                                required
                                margin="dense"
                                label="Price"
                                type="number"

                                variant="outlined"
                                inputRef={priceRef}
                            />
                            <TextField
                                sx={{ m: 1, width: "10%" }}
                                required
                                margin="dense"
                                label="Quantity"
                                type="number"
                                fullWidth
                                variant="outlined"
                                inputRef={quantityRef}
                            />

                            <TextField
                                sx={{ m: 1, width: "10%" }}
                                required
                                margin="dense"
                                label="CPU"
                                type="text"
                                fullWidth
                                variant="outlined"
                                inputRef={cpuRef}
                            />
                            <TextField
                                sx={{ m: 1, width: "10%" }}

                                required
                                margin="dense"
                                label="Quantity"
                                type="number"
                                fullWidth
                                variant="outlined"
                                inputRef={quantityRef}
                            />

                            <TextField
                                sx={{ m: 1, width: "10%" }}

                                required
                                margin="dense"
                                label="GPU"
                                type="text"
                                fullWidth
                                variant="outlined"
                                inputRef={gpuRef}
                            />


                        </Box>
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                        }}>

                            <TextField
                                sx={{ m: 1, width: "10%" }}

                                required
                                margin="dense"
                                label="Screen"
                                type="number"
                                fullWidth
                                variant="outlined"
                                inputRef={screenRef}
                            />

                            <TextField
                                sx={{ m: 1, width: "10%" }}

                                required
                                margin="dense"
                                label="OS"
                                type="text"
                                fullWidth
                                variant="outlined"
                                inputRef={osRef}
                            />

                            <Box sx={{ display: 'flex', m: 1, gap: 2, alignItems: 'center', alignContent: "end", width: "20%" }}>
                                <Typography gutterBottom>Ram</Typography>
                                <Slider
                                    max={256}
                                    value={typeof ram === 'number' ? ram : 0}
                                    onChange={(e, v) => setRam(v as number)}
                                    aria-labelledby="input-slider"
                                />
                                <Input
                                    value={ram}
                                    size="small"
                                    onChange={(e) => setRam(parseInt(e.target.value))}
                                    onBlur={() => {
                                        if (ram > 1000) setRam(1000);
                                        else if (ram < 0) setRam(0);
                                    }}
                                    inputProps={{
                                        step: 2,
                                        min: 0,
                                        max: 256,
                                        type: 'number',
                                        'aria-labelledby': 'input-slider',
                                    }}
                                />
                                <p>GB</p>
                            </Box>
                            <Box sx={{ display: 'flex', m: 1, gap: 2, alignItems: 'center', alignContent: "end", width: "20%" }}>
                                <Typography gutterBottom>Rom</Typography>
                                <Slider
                                    max={10000}
                                    value={typeof rom === 'number' ? rom : 0}
                                    onChange={(e, v) => setRom(v as number)}
                                    aria-labelledby="input-slider"
                                />
                                <Input
                                    value={rom}
                                    size="small"
                                    onChange={(e) => setRom(parseInt(e.target.value))}
                                    onBlur={() => {
                                        if (ram > 10000) setRam(10000);
                                        else if (ram < 0) setRam(0);
                                    }}
                                    inputProps={{
                                        step: 32,
                                        min: 0,
                                        max: 10000,
                                        type: 'number',
                                        'aria-labelledby': 'input-slider',
                                    }}
                                />
                                <p>GB</p>
                            </Box>
                            <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<CloudUploadIcon />}
                            >
                                Upload main image
                                <VisuallyHiddenInput
                                    type="file"
                                    onChange={(event) => console.log(event.target.files)}
                                    multiple
                                />
                            </Button>
                            <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<CloudUploadIcon />}
                            >
                                Upload files
                                <VisuallyHiddenInput
                                    type="file"
                                    onChange={(event) => console.log(event.target.files)}
                                    multiple
                                />
                            </Button>
                        </Box>









                        {/* <FormControl variant="standard" color="info" sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel>Role</InputLabel>
                            <Select
                                value={role}
                                onChange={(e) => setRole(e.target.value as "USER" | "ADMIN")}
                            >
                                <MenuItem value="ADMIN">Admin</MenuItem>
                                <MenuItem value="USER">User</MenuItem>
                            </Select>
                        </FormControl> */}

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit">Subscribe</Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

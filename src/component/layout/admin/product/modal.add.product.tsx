"use client"
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';

import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { Badge, Box, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, ImageList, ImageListItem, Input, InputLabel, MenuItem, Select, Slider, styled, TextField } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Image from 'next/image';

import { sendRequest } from '@/utils/api';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

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

    const nameRef = useRef<HTMLInputElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);
    const quantityRef = useRef<HTMLInputElement>(null);
    const cpuRef = useRef<HTMLInputElement>(null);
    const screenRef = useRef<HTMLInputElement>(null);
    const osRef = useRef<HTMLInputElement>(null);
    const detailDescRef = useRef<HTMLInputElement>(null);
    const shortDescRef = useRef<HTMLInputElement>(null);
    const gpuRef = useRef<HTMLInputElement>(null);

    const [factory, setFactory] = useState<string>("")
    const [type, setType] = useState<string>("")

    const [ram, setRam] = useState(0);
    const [rom, setRom] = useState(0);


    const [mainImage, setMainImage] = useState<File | null>(null);
    const [images, setImages] = useState<File[] | null>(null);
    const [imageURLs, setImageURLs] = useState<string[]>([]);
    const [mainImageURL, setMainImageURL] = useState<string | null>(null);
    const { data } = useSession();
    const router = useRouter();
    function fileArrayToFileList(files: File[]) {
        const dataTransfer = new DataTransfer();

        files.forEach(file => {
            dataTransfer.items.add(file);
        });

        return dataTransfer.files;
    }
    useEffect(() => {
        imageURLs.forEach(url => URL.revokeObjectURL(url));

        if (!images) {
            setImageURLs([]);
            return;
        }

        // Tạo URLs cho các images mới
        const newURLs = images.map(file => URL.createObjectURL(file));
        setImageURLs(newURLs);

        // Cleanup URLs khi images thay đổi hoặc component unmount
        return () => {
            newURLs.forEach(url => URL.revokeObjectURL(url));
        };
    }, [images]);

    useEffect(() => {
        if (!mainImage) {
            setMainImageURL(null);
            return;
        }

        const newURL = URL.createObjectURL(mainImage);
        setMainImageURL(newURL);

        return () => URL.revokeObjectURL(newURL);
    }, [mainImage]);
    const handleDeleteImage = (item: number) => {
        URL.revokeObjectURL(imageURLs[item]);

        const newImages = images?.filter((image, index) => index !== item);
        setImages(newImages ?? null);
    }
    const handleClose = () => {
        setOpen(false);
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!images || !mainImage) {
            toast.error("Vui lòng nhập ảnh")
            return;
        }
        //step 1
        console.log("hello guy")
        const name = nameRef.current?.value
        const price = priceRef.current?.value
        const quantity = Number(quantityRef.current?.value)
        const cpu = cpuRef.current?.value
        const screen = screenRef.current?.value
        const os = osRef.current?.value
        const detailDesc = detailDescRef.current?.value
        const gpu = gpuRef.current?.value
        const shortDesc = shortDescRef.current?.value
        console.log({
            name, price, quantity, cpu, screen, os, detailDesc, gpu, shortDesc, type, ram, rom,
            factory: {
                id: factory
            }
        })
        const res = await sendRequest<IBackendRes<IProduct>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/product`, method: "POST", headers: {
                Authorization: `Bearer ${data?.access_token}`,
            },
            body: {
                name, price, quantity, cpu, screen, os, detailDesc, gpu, shortDesc, type, ram, rom,
                factory: {
                    id: factory
                }
            }
        })

        if (res.error) {
            toast.error(res.message ?? "Lỗi")
        }
        //step 2
        if (res.data) {
            const id = res.data?.id
            const form = new FormData();
            form.append("id", id.toString());
            form.append("file", mainImage as Blob);

            for (let i = 0; i < images!.length; i++) {
                form.append('files', images![i]);
            }
            const res1 = await sendRequest<IBackendRes<IProduct>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/product/upload-image`, method: "POST", headers: {
                    Authorization: `Bearer ${data?.access_token}`,
                },
                body: form
            })
            if (res1.data) {
                toast.success("Create success");
                setOpen(false);
                nameRef.current!.value = ""
                priceRef.current!.value = ""
                quantityRef.current!.value = ""
                cpuRef.current!.value = ""
                screenRef.current!.value = ""
                osRef.current!.value = ""
                detailDescRef.current!.value = ""
                gpuRef.current!.value = ""
                shortDescRef.current!.value = ""
                setFactory("")
                setRam(0)
                setRom(0)
                setMainImage(null)
                setImages(null)
                setImageURLs([])
                setMainImageURL(null)
                router.refresh();
            } else {
                toast.error(res.error ?? "Thông tin sai");
            }
        }
    }
    return (
        <>
            <Dialog
                maxWidth="xl"
                fullWidth
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
                slotProps={{
                    paper: {
                        component: 'form',
                        onSubmit: (event: React.FormEvent<HTMLFormElement>) => handleSubmit(event),
                    },
                }}
            >
                <DialogTitle>Add laptop</DialogTitle>
                <DialogContent>
                    {/* <DialogContentText>
                        To subscribe to this website, please enter your email address here. We
                        will send updates occasionally.
                    </DialogContentText> */}
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
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                label="Factory"
                            >


                                <MenuItem value={"GAMING"}>GAMING</MenuItem>
                                <MenuItem value={"NORMAL"}>NORMAL</MenuItem>
                                <MenuItem value={"AI"}>AI</MenuItem>
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
                            sx={{ width: "10%" }}

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
                            label="OS"
                            type="text"
                            fullWidth
                            variant="outlined"
                            inputRef={osRef}
                        />
                        <TextField
                            sx={{ width: "30%", m: 1 }}
                            inputRef={shortDescRef}
                            id="outlined-textarea"
                            label="Short description"
                            placeholder="Short description"
                            multiline
                        />
                        <TextField
                            sx={{ width: "50%", m: 1 }}
                            inputRef={detailDescRef}

                            id="outlined-textarea"
                            label="Long description"
                            placeholder="Long description"
                            multiline
                        />

                    </Box>
                    <Box>
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
                                sx={{ width: "100px" }}
                                onChange={(e) => {
                                    const newValue = parseInt(e.target.value);
                                    // Cập nhật giá trị RAM chỉ khi giá trị hợp lệ
                                    if (!isNaN(newValue)) {
                                        setRam(newValue);
                                    }

                                }}
                                onBlur={() => {
                                    if (ram > 256) setRam(256);
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
                        <Box sx={{ display: 'flex', m: 1, gap: 2, alignItems: 'center', alignContent: "end", width: "30%" }}>
                            <Typography gutterBottom>Rom</Typography>
                            <Slider
                                max={10000}
                                value={typeof rom === 'number' ? rom : 0}
                                onChange={(e, v) => setRom(v as number)}
                                aria-labelledby="input-slider"
                            />
                            <Input
                                value={rom}
                                sx={{ width: "100px" }}
                                onChange={(e) => {
                                    const newValue = parseInt(e.target.value);
                                    // Cập nhật giá trị RAM chỉ khi giá trị hợp lệ
                                    if (!isNaN(newValue)) {
                                        setRom(newValue);
                                    }
                                }}
                                onBlur={() => {
                                    if (rom > 10000) setRom(10000);
                                    else if (rom < 0) setRom(0);
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
                                onChange={(event) => setMainImage(event.target.files?.[0] ?? null)}
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
                                onChange={(event) => setImages((prev) => [...prev ?? [], ...Array.from(event.target.files ?? [])])}
                                multiple
                            />
                        </Button>
                    </Box>


                    <Box sx={{
                        display: 'flex',
                        justifyContent: "space-around",
                        alignItems: "center",

                    }}>

                        {imageURLs && imageURLs?.length > 0 &&
                            <Badge badgeContent={
                                <div style={{
                                    cursor: "pointer"
                                }}
                                    onClick={() => {
                                        imageURLs.forEach(url => URL.revokeObjectURL(url));
                                        setImages(null);
                                    }}>
                                    X
                                </div>
                            } color="error">
                                <Box sx={{ border: "1px solid grey", }}>
                                    <h3>Laptop image</h3>
                                    <ImageList
                                        sx={{ width: 500, height: 450, p: 1 }}
                                        variant="quilted"
                                        cols={4}
                                        rowHeight={121}
                                    >
                                        {imageURLs.map((item, index) => {
                                            return (
                                                <Badge badgeContent={
                                                    <div
                                                        onClick={() => handleDeleteImage(index)}
                                                        style={{ cursor: "pointer" }}>X</div>
                                                } color="info" key={index} >
                                                    <ImageListItem >
                                                        <img
                                                            src={item}
                                                            alt={"preview"}
                                                            loading="lazy"
                                                        />
                                                    </ImageListItem>
                                                </Badge>
                                            )
                                        })}
                                    </ImageList>
                                </Box>
                            </Badge>
                        }


                        {mainImageURL &&
                            <Badge badgeContent={
                                <div style={{
                                    cursor: "pointer"
                                }}
                                    onClick={() => {
                                        if (mainImageURL) URL.revokeObjectURL(mainImageURL);
                                        setMainImage(null)
                                    }}>
                                    X
                                </div>
                            } color="error">
                                <Image src={mainImageURL} alt={"preview"} width={300} height={300} />
                            </Badge>
                        }
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

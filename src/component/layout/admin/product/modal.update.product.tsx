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
    factories?: IFactory[],
    product?: IProduct
}
export default function ModalUpdateProduct(props: IProps) {
    const { open, setOpen, factories, product } = props


    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [cpu, setCpu] = useState('');
    const [screen, setScreen] = useState(0);
    const [os, setOs] = useState('');
    const [detailDesc, setDetailDesc] = useState('');
    const [shortDesc, setShortDesc] = useState('');
    const [gpu, setGpu] = useState('');

    const [factory, setFactory] = useState<number | null>(null)
    const [type, setType] = useState<string>("")

    const [ram, setRam] = useState(0);
    const [rom, setRom] = useState(0);
    const [mainImageDB, setMainImageDB] = useState<string | null>(null)
    const [imagesDB, setImagesDB] = useState<{
        id: number,
        image: string
    }[]>([])
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
    useEffect(() => {
        if (product) {
            setGpu(product.gpu);
            setRam(product.ram);
            setRom(product.rom);
            setFactory(product?.factory?.id);
            setName(product.name);
            setPrice(product.price);
            setQuantity(product.quantity);
            setCpu(product.cpu);
            setScreen(product.screen);
            setOs(product.os);
            setDetailDesc(product.detailDesc);
            setShortDesc(product.shortDesc);
            setType(product.type);
            setMainImageDB(product.mainImage);
            setImagesDB(product.images.map((image) => ({ id: image.id, image: image.image })));
        }
    }, [product]);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        //step 1

        const res = await sendRequest<IBackendRes<IProduct>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/product`, method: "PATCH", headers: {
                Authorization: `Bearer ${data?.access_token}`,
            },
            body: {
                id: product?.id, name, price, quantity, cpu, screen, os, detailDesc, gpu, shortDesc, type, ram, rom,
                mainImage: mainImageDB,
                factory: {
                    id: factory
                },

                images: imagesDB.map((image) => ({ id: image.id }))
            }
        })

        console.log(res)

        //step 2
        if (res.data) {

            const id = res.data?.id
            const form = new FormData();
            form.append("id", id.toString());
            if (mainImage) {
                form.append("file", mainImage as Blob);

            }
            if (images) {
                for (let i = 0; i < images!.length; i++) {
                    form.append('files', images![i]);
                }

            }

            const res1 = await sendRequest<IBackendRes<IProduct>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/product/upload-image`, method: "PATCH", headers: {
                    Authorization: `Bearer ${data?.access_token}`,
                },
                body: form
            })
            console.log(res1)
            if (res1.data) {
                toast.success("Create success");
                setOpen(false);
                setName('');
                setPrice(0);
                setQuantity(0);
                setCpu('');
                setScreen(0);
                setOs('');
                setDetailDesc('');
                setGpu('');
                setShortDesc('');
                setRam(0)
                setRom(0)
                setMainImage(null)
                setImages(null)
                setImageURLs([])
                setMainImageURL(null)
                router.refresh();
            } else {
                toast.error(res.error);
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
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <FormControl color="info" sx={{ m: 1, width: "10%" }}>
                            <InputLabel>Factory</InputLabel>
                            <Select
                                value={factory}
                                onChange={(e) => setFactory(e.target.value as number)}
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
                            value={price}
                            onChange={(e) => setPrice(e.target.value as any)}
                        />
                        <TextField
                            sx={{ m: 1, width: "10%" }}
                            required
                            margin="dense"
                            label="Quantity"
                            type="number"
                            fullWidth
                            variant="outlined"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value as any)}
                        />

                        <TextField
                            sx={{ m: 1, width: "10%" }}
                            required
                            margin="dense"
                            label="CPU"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={cpu}
                            onChange={(e) => setCpu(e.target.value)}
                        />
                        <TextField
                            sx={{ width: "10%" }}

                            required
                            margin="dense"
                            label="Screen"
                            type="number"
                            fullWidth
                            variant="outlined"
                            value={screen}
                            onChange={(e) => setScreen(e.target.value as any)}
                        />

                        <TextField
                            sx={{ m: 1, width: "10%" }}

                            required
                            margin="dense"
                            label="GPU"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={gpu}
                            onChange={(e) => setGpu(e.target.value)}
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
                            value={os}
                            onChange={(e) => setOs(e.target.value)}
                        />
                        <TextField
                            sx={{ width: "30%", m: 1 }}
                            value={shortDesc}
                            onChange={(e) => setShortDesc(e.target.value)}
                            id="outlined-textarea"
                            label="Multiline Placeholder"
                            placeholder="Short description"
                            multiline
                        />
                        <TextField
                            sx={{ width: "50%", m: 1 }}
                            value={detailDesc}
                            onChange={(e) => setDetailDesc(e.target.value)}
                            id="outlined-textarea"
                            label="Multiline Placeholder"
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
                                sx={{ width: "80px" }}
                                onChange={(e) => setRam(parseInt(e.target.value))}
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
                                onChange={(e) => setRom(parseInt(e.target.value))}
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

                        {(imageURLs || imagesDB) && (imageURLs?.length > 0 || imagesDB?.length > 0) &&
                            <Badge badgeContent={
                                <div style={{
                                    cursor: "pointer"
                                }}
                                    onClick={() => {
                                        imageURLs.forEach(url => URL.revokeObjectURL(url));
                                        setImages(null);
                                        setImagesDB([]);
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


                                        {
                                            imagesDB?.map((item, index) => {
                                                return (
                                                    <Badge badgeContent={
                                                        <div
                                                            onClick={() => setImagesDB((prev) => prev.filter((_, i) => i !== index))}
                                                            style={{ cursor: "pointer" }}>X</div>
                                                    } color="info" key={index} >
                                                        <ImageListItem >
                                                            <img
                                                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/product/${item.image}`}
                                                                alt={"preview"}
                                                                loading="lazy"
                                                            />
                                                        </ImageListItem>
                                                    </Badge>
                                                )
                                            })
                                        }
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


                        {mainImageURL ?
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
                            :
                            <Badge color="error">
                                <Image src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/product/${mainImageDB}`} alt={"preview"} width={300} height={300} />
                            </Badge>
                        }
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Subscribe</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

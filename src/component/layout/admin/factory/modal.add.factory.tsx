"use client"

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Badge, Box, FormControl, InputLabel, MenuItem, Select, styled } from '@mui/material';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { sendRequest } from '@/utils/api';
import { toast } from 'react-toastify';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Image from 'next/image';

import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { useRouter } from 'next/navigation';
interface IProps {
    open: boolean,
    setOpen: (v: boolean) => void,

}
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
export default function ModalAddFactory(props: IProps) {
    const { open, setOpen } = props
    const [name, setName] = useState("")
    const [country, setCountry] = useState("")
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [fileLaptop, setFileLaptop] = useState<File | null>(null);
    const [previewUrlLaptop, setPreviewUrlLaptop] = useState<string | null>(null);

    const { data } = useSession();
    const router = useRouter();
    const handleClose = () => {
        setOpen(false);
    };
    const handleFileChange = (event: any) => {
        const file = event.target.files[0];
        setFile(file);
        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setPreviewUrl(reader.result?.toString() ?? null);
            };

            reader.readAsDataURL(file);
        }
    };
    const handleFileChangeLaptop = (event: any) => {
        const file = event.target.files[0];
        setFileLaptop(file);
        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setPreviewUrlLaptop(reader.result?.toString() ?? null);
            };

            reader.readAsDataURL(file);
        }
    };
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const form = new FormData();
        form.append("name", name)
        form.append("country", country)
        form.append("file", file as Blob)
        form.append("fileLaptop", fileLaptop as Blob)
        const res = await sendRequest<IBackendRes<IUser>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/factory`, method: "POST", headers: {
                Authorization: `Bearer ${data?.access_token}`,
            },
            body: form
        })
        if (res.data) {
            setCountry("")
            setName("")
            setPreviewUrl(null)
            setFile(null)
            setOpen(false);
            setFileLaptop(null)
            setPreviewUrlLaptop("")
            toast.success("Create success");

        } else {
            console.log(res)
            toast.error(res.error);

        }
        router.refresh();
    }
    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        component: 'form',
                        onSubmit: (event: React.FormEvent<HTMLFormElement>) => handleSubmit(event),
                    },
                }}
            >
                <DialogTitle>Add factory</DialogTitle>
                <DialogContent>
                    {/* <DialogContentText>
                        To subscribe to this website, please enter your email address here. We
                        will send updates occasionally.
                    </DialogContentText> */}
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        label="Name factory"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <TextField
                        required
                        margin="dense"
                        label="Country"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />


                    {!previewUrl ? <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        sx={{
                            marginTop: "20px"
                        }}
                        startIcon={<CloudUploadIcon />}
                    >
                        Upload files
                        <VisuallyHiddenInput
                            type="file"
                            onChange={(event) => handleFileChange(event)}
                            multiple={false}

                        />
                    </Button> :
                        <div>
                            <h3>Preview Image</h3>
                            <Box
                                sx={{

                                    width: '100%',
                                    display: "flex",
                                    justifyContent: "center"

                                }}>
                                <Badge

                                    color="default" badgeContent={
                                        <div onClick={() => {
                                            setFile(null)
                                            setPreviewUrl(null)
                                        }}
                                            style={{
                                                cursor: 'pointer'
                                            }}>
                                            <DisabledByDefaultIcon color='info' />
                                        </div>
                                    }>
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        style={{ maxWidth: '300px', marginTop: '20px' }}
                                    />
                                </Badge>
                            </Box>
                        </div>
                    }
                    {!previewUrlLaptop ? <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        sx={{
                            marginLeft: "20px",
                            marginTop: "20px"
                        }}
                        startIcon={<CloudUploadIcon />}
                    >
                        Upload files laptop
                        <VisuallyHiddenInput
                            type="file"
                            onChange={(event) => handleFileChangeLaptop(event)}
                            multiple={false}

                        />
                    </Button> :
                        <div>
                            <h3>Preview Image</h3>
                            <Box
                                sx={{

                                    width: '100%',
                                    display: "flex",
                                    justifyContent: "center"

                                }}>
                                <Badge

                                    color="default" badgeContent={
                                        <div onClick={() => {
                                            setFileLaptop(null)
                                            setPreviewUrlLaptop(null)
                                        }}
                                            style={{
                                                cursor: 'pointer'
                                            }}>
                                            <DisabledByDefaultIcon color='info' />
                                        </div>
                                    }>
                                    <img
                                        src={previewUrlLaptop}
                                        alt="Preview"
                                        style={{ maxWidth: '300px', marginTop: '20px' }}
                                    />
                                </Badge>
                            </Box>
                        </div>
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Save</Button>
                </DialogActions>
            </Dialog >
        </>
    );
}
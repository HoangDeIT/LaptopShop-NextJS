"use client"

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { sendRequest } from '@/utils/api';
import { toast } from 'react-toastify';


interface IProps {
    open: boolean,
    setOpen: (v: boolean) => void,
    fetchUser: () => Promise<void>
}
export default function ModalAddUser(props: IProps) {
    const { open, setOpen, fetchUser } = props
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [userName, setUserName] = useState("")
    const [role, setRole] = useState<"USER" | "ADMIN">("USER");
    const { data } = useSession();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleSubmit = async () => {
        const res = await sendRequest<IBackendRes<IUser>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/user`, method: "POST", headers: {
                Authorization: `Bearer ${data?.access_token}`,
            },
            body: {
                email, password, userName, role
            }
        })
        if (res.data) {
            await fetchUser();
            toast.success("Create success");
            setEmail("")
            setPassword("")
            setUserName("")
            setRole("USER")
        } else {
            toast.error(res.error);

        }
    }
    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        component: 'form',
                        onSubmit: (event: React.FormEvent<HTMLFormElement>) => handleSubmit(),
                    },
                }}
            >
                <DialogTitle>Subscribe</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To subscribe to this website, please enter your email address here. We
                        will send updates occasionally.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        label="User name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />

                    <TextField
                        required
                        margin="dense"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="standard"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <TextField
                        required
                        margin="dense"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <FormControl variant="standard" color="info" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel>Role</InputLabel>
                        <Select
                            value={role}
                            onChange={(e) => setRole(e.target.value as "USER" | "ADMIN")}
                        >
                            <MenuItem value="ADMIN">Admin</MenuItem>
                            <MenuItem value="USER">User</MenuItem>
                        </Select>
                    </FormControl>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Subscribe</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
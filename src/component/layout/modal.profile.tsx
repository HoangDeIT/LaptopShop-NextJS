import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Avatar } from '@mui/material';
import { useRef, useState } from 'react';
import { sendRequest } from '@/utils/api';
import { toast } from 'react-toastify';
import { getSession } from 'next-auth/react';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const ModalProfile = ({ open, setOpen, profile }: { open: boolean, setOpen: (v: boolean) => void, profile?: IUser }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    function formatImageUrl(url: string) {
        if (!url) return "";

        // Kiểm tra nếu ảnh là từ localhost (tức là không có domain hoặc chỉ là tên file)
        const isLocalhostImage = url.startsWith("/") || /^[a-zA-Z0-9_-]+\.(png|jpg|jpeg|gif|webp)$/i.test(url);

        // Nếu là ảnh localhost, thêm backend URL vào trước
        if (isLocalhostImage) {
            return `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/avatar/${url}`;
        }

        return url; // Nếu không phải ảnh localhost, trả về URL gốc
    }
    const handleAvatarClick = async () => {
        const session = await getSession();
        console.log(session)
        if (fileInputRef.current && session?.user.type === "SYSTEM") {
            fileInputRef.current.click();
        }
    }
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const session = await getSession();
        const file = e.target.files?.[0];

        const formData = new FormData();
        formData.append('file', file as Blob);
        const res = await sendRequest<IBackendRes<IUser>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/upload-avatar`,
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${session?.access_token}`
            }
        })
        if (res?.data) {
            toast.success("Update avatar success");
        } else {
            toast.error(res?.error);
        }
    }
    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    {/* Input file ẩn */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />
                    <div onClick={handleAvatarClick}>
                        <Avatar
                            src={formatImageUrl(profile?.image || "")}
                            sx={{ width: 100, height: 100 }}
                        />
                    </div>

                    <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
                        {profile?.userName}
                    </Typography>
                    <Typography variant="subtitle1" component="p" sx={{ mt: 1 }}>
                        Email: {profile?.email}
                    </Typography>
                    <Typography variant="subtitle1" component="p" sx={{ mt: 1 }}>
                        Role: {profile?.role}
                    </Typography>
                    <Typography variant="subtitle1" component="p" sx={{ mt: 1 }}>
                        Type: {profile?.type}
                    </Typography>
                </Box>
            </Box>
        </Modal>
    )
}

export default ModalProfile
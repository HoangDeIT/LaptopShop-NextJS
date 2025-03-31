"use client"
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Container, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import { sendRequest } from '@/utils/api';
interface IProps {
    code?: string
}
const ResetPassword = (props: IProps) => {
    const { code } = props
    const searchParams = useSearchParams();
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);
        const res = await sendRequest<IBackendRes<String>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/reset-password`,
            method: "POST",
            body: { code, password },
        });
        setIsLoading(false);

        if (res?.error && res.error !== "") {
            toast.error(res?.data ?? "Some thing went wrong");
        } else {
            toast.success("Reset thành công", { autoClose: 5000 });
            router.push("/login");
        }
    };

    return (
        <Container
            sx={{
                backgroundColor: 'white',
                borderRadius: '20px',
                padding: "40px"
            }}
            maxWidth="xs"
        >
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: "20px"
            }}>
                <h1 style={{ fontSize: "30px" }}>Reset Password</h1>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: "20px",
                marginBottom: "20px"
            }}>
                <TextField
                    style={{ width: "100%" }}
                    label="New Password"
                    type="password"
                    variant="outlined"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
                <TextField
                    style={{ width: "100%" }}
                    label="Confirm Password"
                    type="password"
                    variant="outlined"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                />
            </div>
            <Button
                variant="contained"
                disabled={isLoading}
                sx={{
                    width: "100%",
                    color: "white",
                    '&:hover': {
                        backgroundColor: "blue",
                    },
                    margin: "10px 0 20px 0"
                }}
                onClick={handleSubmit}
            >
                Reset Password
            </Button>
        </Container>
    );
};

export default ResetPassword;

"use client"
import { useEffect, useState } from 'react';


import TextField from '@mui/material/TextField';

import { useRouter, useSearchParams } from 'next/navigation';

import { Button, Container, FormControl, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';

import { toast } from 'react-toastify';
import { sendRequest } from '@/utils/api';
const ForgotPasswordPage = () => {
    const searchParams = useSearchParams()
    const router = useRouter();
    const [userName, setUserName] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const handleSubmit = async () => {
        setIsLoading(true)
        const res = await sendRequest<IBackendRes<String>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/email/forgot-password`,
            method: "POST",
            body: {
                user: userName,

            }
        });
        setIsLoading(false)
        if (res?.error && res.error != "") {
            toast.error(res?.data ?? "Vui lòng kiểm tra email của bạn")

        } else {
            toast.success("Kiểm tra email trong hợp thư của bạn", { autoClose: 5000 });
            router.push("/login")
        }

    }
    useEffect(() => {
        if (searchParams.get("error") === "CredentialsSignin") {
            toast.error("Tài khoản hoặc mật khẩu không chính xác")
        }
    }, [searchParams])
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
                <h1 style={{
                    fontSize: "30px",

                }}>Forgot password</h1>

            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: "20px",
                marginBottom: "20px"
            }}>
                <TextField style={{ width: "100%" }}
                    label="User name or email address"
                    variant="outlined"
                    onChange={(e) => setUserName(e.target.value)}
                    value={userName}
                />


            </div>

            <Button variant="contained" loading={isLoading} sx={{
                width: "100%",
                color: "white",
                '&:hover': {
                    backgroundColor: "blue",
                },
                margin: "10px 0 20px 0"
            }}
                onClick={handleSubmit}
            >
                Forgot password
            </Button>


        </Container>

    )

}
export default ForgotPasswordPage;
"use client"
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { useRouter } from 'next/navigation';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Button, Container, FormControl, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import Link from 'next/link'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginSocial from './login.social';
import { toast } from 'react-toastify';
import { sendRequest } from '@/utils/api';
import { env } from 'process';
export function Register() {
    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [address, setAddress] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [userName, setUserName] = useState("")
    const [errorConfirmPassword, setErrorConfirmPassword] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [errorUserName, setErrorUserName] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleSubmit = async () => {
        if (userName.length < 1) {
            setErrorUserName(true)
        }
        if (password.length < 6) {
            setErrorPassword(true)
        }
        if (confirmPassword !== password) {
            setErrorConfirmPassword(true)
        }
        if (!validateEmail(email)) {
            setErrorEmail(true)
        }
        const res = await sendRequest<IBackendRes<IRegister>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/register`,
            method: "POST",
            body: {
                userName,
                password,
                email,
                address
            }
        });
        if (res.statusCode === 200 || res.statusCode === 201) {
            toast.success("Register success")
            setAddress("")
            setConfirmPassword("")
            setEmail("")
            setPassword("")
            setUserName("")
        } else {
            toast.error(res.error ?? "Fail")
        }

    }
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

                }}>Sign in</h1>
                <p style={{ color: "grey" }}>Don’t have an account? <Link
                    style={{
                        color: "#1877F2",
                        fontWeight: "bold",
                        textDecoration: "none"
                    }}
                    href={""}>Create now</Link> Get started</p>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: "20px",
                marginBottom: "20px"
            }}>
                <TextField style={{ width: "100%" }}
                    label="User name"
                    variant="outlined"
                    onChange={(e) => setUserName(e.target.value)}
                    value={userName}
                    error={errorUserName}
                    helperText={
                        errorUserName ? "Check your user name" : ""
                    }
                    onBlur={() => { setErrorUserName(userName.length < 1) }}
                />
                <FormControl sx={{ width: '100%' }} variant="outlined" error={errorPassword}>
                    <InputLabel htmlFor="outlined-adornment-password"

                    >Password</InputLabel>
                    <OutlinedInput
                        onBlur={() => { setErrorPassword(password.length < 6) }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={
                                        showPassword ? 'hide the password' : 'display the password'
                                    }
                                    onClick={handleClickShowPassword}

                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Password"
                    />
                    {errorPassword && <FormHelperText>Check your password</FormHelperText>}
                </FormControl>
                <FormControl sx={{ width: '100%' }} variant="outlined" error={errorConfirmPassword}>
                    <InputLabel htmlFor="outlined-adornment-password"> Confirm Password</InputLabel>
                    <OutlinedInput
                        onBlur={() => { setErrorConfirmPassword(confirmPassword !== password) }}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        value={confirmPassword}
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={
                                        showPassword ? 'hide the password' : 'display the password'
                                    }
                                    onClick={handleClickShowPassword}

                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Password"
                    />
                    {errorConfirmPassword && <FormHelperText>Check your password</FormHelperText>}
                </FormControl>
                <TextField label="email" variant="outlined" onChange={(e) => setEmail(e.target.value)}
                    error={errorEmail}
                    helperText={
                        errorEmail ? "Check your email" : ""
                    }
                    value={email}
                    onBlur={() => { setErrorEmail(!validateEmail(email)) }}
                />
                <TextField label="address" variant="outlined" onChange={(e) => setAddress(e.target.value)}
                    value={address}
                />

            </div>
            <Button variant="contained" sx={{
                width: "100%",
                color: "white",
                backgroundColor: "blue",
                '&:hover': {
                    backgroundColor: "blue",
                },
                margin: "10px 0 20px 0"
            }}
                onClick={handleSubmit}
            >
                Success
            </Button>
            <Divider sx={{ color: "grey" }}>Or oogin with</Divider>
            <LoginSocial />
        </Container>

    )
}
export default Register;
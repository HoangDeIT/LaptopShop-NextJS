"use client"
import { useState } from 'react';

import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useRouter } from 'next/navigation';

import { Button, Container, FormControl, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';
import Link from 'next/link'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginSocial from './login.social';

import { signIn } from 'next-auth/react';
const Login = () => {
    const router = useRouter();
    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const [showPassword, setShowPassword] = useState(false);
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [errorPassword, setErrorPassword] = useState(false);
    const [errorUserName, setErrorUserName] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleSubmit = async () => {
        if (userName.length < 1) {
            setErrorUserName(true)
        }
        setIsLoading(true)
        console.log("Da vao day")
        const res = await signIn("credentials", { username: userName, password: password });
        console.log(res)
        if (!res?.error) {
            console.log("success")
        }
        setIsLoading(false)

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
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSubmit()
                        }}
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
                Success
            </Button>
            <Divider sx={{ color: "grey" }}>Or Login with</Divider>
            <LoginSocial />
        </Container>

    )

}
export default Login;
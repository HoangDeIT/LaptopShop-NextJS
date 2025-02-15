import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Button } from '@mui/material';
import { signIn } from 'next-auth/react';
const LoginSocial = () => {
    return (
        <>
            <div style={{
                display: 'flex',
                gap: "20px",
                marginBottom: "20px",
                justifyContent: "space-around"
            }}>
                <div
                    onClick={() => signIn("github")}
                >
                    <GitHubIcon

                        sx={{
                            fontSize: "40px",
                            cursor: 'pointer',
                            ' &:hover': {
                                color: "green"
                            }
                        }} />
                </div>
                <div
                    onClick={() => signIn("google")}
                >
                    <GoogleIcon sx={{
                        fontSize: "40px",
                        cursor: 'pointer',
                        ' &:hover': {
                            color: "green"
                        }
                    }} />
                </div>

            </div>
        </>
    )
}
export default LoginSocial
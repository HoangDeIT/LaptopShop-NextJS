import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Button } from '@mui/material';
const LoginSocial = () => {
    return (
        <>
            <div style={{
                display: 'flex',
                gap: "20px",
                marginBottom: "20px",
                justifyContent: "space-around"
            }}>
                <GitHubIcon sx={{
                    fontSize: "40px",
                    cursor: 'pointer',
                    ' &:hover': {
                        color: "green"
                    }
                }} />
                <GoogleIcon sx={{
                    fontSize: "40px",
                    cursor: 'pointer',
                    ' &:hover': {
                        color: "green"
                    }
                }} />
            </div>
        </>
    )
}
export default LoginSocial
import { Container } from "@mui/material";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <Container sx={{
            backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            height: '100vh',
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}
            maxWidth={false}
        >
            {children}
        </Container>
    );
}

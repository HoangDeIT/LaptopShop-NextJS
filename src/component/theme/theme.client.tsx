"use client"

import { createTheme, CssBaseline, ThemeProvider, useTheme } from "@mui/material";


const theme = createTheme({
    // palette: {
    //     mode: 'light', // Chế độ sáng
    //     primary: {
    //         // Nếu bạn muốn sử dụng màu sáng cho primary, ví dụ màu xám nhạt:
    //         main: '#f5f5f5',
    //     },
    //     background: {
    //         default: '#ffffff', // Màu nền mặc định trắng
    //         paper: '#ffffff',   // Màu nền cho các component dạng "paper" cũng là trắng
    //     },
    //     text: {
    //         primary: '#000000',// Chữ màu đen
    //     },

    // },
    // components: {
    //     MuiButton: {
    //         styleOverrides: {
    //             root: {
    //                 background: "blue"
    //             }
    //         }
    //     }
    // }
});

export default function ThemeClient({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <>
            {/* <ThemeProvider theme={theme}> */}
            <CssBaseline />
            {children}
            {/* </ThemeProvider> */}
        </>
    )
} 
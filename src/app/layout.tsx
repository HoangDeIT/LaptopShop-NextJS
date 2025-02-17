import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ToastContainer } from 'react-toastify';
import ShowToast from "@/component/toast/show.toast";
import { createTheme, ThemeProvider } from "@mui/material";
import ThemeClient from "@/component/theme/theme.client";
import AppProvider from "@/context/app.context";
import NextAuthWarper from "@/lib/next.auth.wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{ margin: 0 }}
        className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppRouterCacheProvider>
          <AppProvider>
            <ThemeClient>
              <NextAuthWarper>
                {children}
                <ShowToast />
              </NextAuthWarper>
            </ThemeClient>
          </AppProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

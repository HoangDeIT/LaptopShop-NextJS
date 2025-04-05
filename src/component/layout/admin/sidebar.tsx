"use client"
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import { Avatar, Badge, Menu, MenuItem, Tooltip } from '@mui/material';
import Image from 'next/image';
import Logo from "@/../public/LogoAdmin.png"
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
const drawerWidth = 240;
import FactoryIcon from '@mui/icons-material/Factory';
import InventoryIcon from '@mui/icons-material/Inventory';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import CommentIcon from '@mui/icons-material/Comment';
import { signOut } from 'next-auth/react';
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * Remove this when copying and pasting into your project.
     */
    children: React.ReactNode
    window?: () => Window;
    pendingCount?: number,
    profile?: IUser
}

export default function ResponsiveDrawer(props: Props) {
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const pathname = usePathname()
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    const router = useRouter()
    const logout = async () => {
        await signOut({ redirect: false })
        router.push("/login")
    }
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const { window, children } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };
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
    const drawer = (
        <div>
            {/* <Toolbar /> */}
            <Image src={Logo} width={200} height={70} alt="logo" />
            <Divider />
            <List>
                <Link href={"/admin"} style={{ textDecoration: "none", color: 'inherit' }}>
                    <ListItem disablePadding>
                        <ListItemButton selected={"/admin" === pathname}>
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Dashboard"} />
                        </ListItemButton>
                    </ListItem>
                </Link>
                <Link href={"/admin/user"} style={{ textDecoration: "none", color: 'inherit' }}>
                    <ListItem disablePadding>
                        <ListItemButton selected={"/admin/user" === pathname}>
                            <ListItemIcon>
                                <GroupIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Manage user"} />
                        </ListItemButton>
                    </ListItem>
                </Link>
                <Link href={"/admin/factory"} style={{ textDecoration: "none", color: 'inherit' }}>
                    <ListItem disablePadding>
                        <ListItemButton selected={"/admin/factory" === pathname}>
                            <ListItemIcon>
                                <FactoryIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Manage Factory"} />
                        </ListItemButton>
                    </ListItem>
                </Link>
                <Link href={"/admin/product"} style={{ textDecoration: "none", color: 'inherit' }}>
                    <ListItem disablePadding>
                        <ListItemButton selected={"/admin/product" === pathname}>
                            <ListItemIcon>
                                <InventoryIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Manage Product"} />
                        </ListItemButton>
                    </ListItem>
                </Link>
                <Link href={"/admin/order"} style={{ textDecoration: "none", color: 'inherit' }}>
                    <ListItem disablePadding>
                        <ListItemButton selected={"/admin/order" === pathname}>
                            <ListItemIcon>
                                <Badge badgeContent={props.pendingCount == 0 ? null : props.pendingCount} color="error">
                                    <ListAltIcon />
                                </Badge>
                            </ListItemIcon>
                            <ListItemText primary={"Manage Order"} />
                        </ListItemButton>
                    </ListItem>
                </Link>

            </List>
            <Divider />
            {/* <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List> */}
        </div>
    );

    // Remove this const when copying and pasting into your project.
    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: 'flex', minHeight: "100vh", }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar style={{
                    background: "white",

                }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <div style={{
                        display: "flex",
                        justifyContent: "flex-end",

                        width: "100%",
                    }}>


                        <Box sx={{ flexGrow: 0, marginRight: 20 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt={props?.profile?.userName} src={`${formatImageUrl(props?.profile?.image ?? "")}`} />

                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem onClick={handleCloseUserMenu}>
                                    <Typography sx={{ textAlign: 'center' }} onClick={logout}>Logout</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </div>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` },
                    backgroundColor: "#f3f4f6"
                }}
            >
                <Toolbar />

                {children}

            </Box>
        </Box>
    );
}
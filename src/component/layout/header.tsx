"use client"
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Image from 'next/image';
import Logo from "@/../public/logo.png"
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { alpha, Autocomplete, Badge, Divider, InputAdornment, InputBase, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Popover, styled, TextField, } from '@mui/material';
import CartDrawer from './card.drawer';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Stack from '@mui/joy/Stack';
import LaptopAL from "@/../public/LaptopAI.jpg"
import { AutocompleteOption, ListItemContent, ListItemDecorator, Typography } from '@mui/joy';
import { useEffect, useMemo, useRef, useState } from 'react';
import debounce from 'debounce';
import { sfIn, sfLike } from 'spring-filter-query-builder';
import { sendRequest } from '@/utils/api';
import { Search } from '@mui/icons-material';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import { getSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCurrentApp } from '@/context/app.context';
import ModalUpdateProduct from './admin/product/modal.update.product';
import ModalUpdateProfile from './modal.history';
import ModalProfile from './modal.profile';
import Link from 'next/link';



interface IProps {
    history?: IOrder[]
    profile?: IUser
}

function ResponsiveAppBar({ history, profile }: IProps) {
    const [isShow, setIsShow] = useState<boolean>(false);
    const { cart } = useCurrentApp();
    const [search, setSearch] = useState<string>('');
    const [data, setData] = useState<IProduct[] | undefined>([])
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [open, setOpen] = useState(false)
    const [isAuth, setIsAuth] = useState<boolean>(false);
    //update profile
    const [openModalUpdateProfile, setOpenModalUpdateProfile] = useState(false)
    const [openProfile, setOpenProfile] = useState(false)

    const router = useRouter()
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
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
    const fetchData = async (filter: string) => {
        const res = await sendRequest<IBackendRes<IModelPaginate<IProduct>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/product`, method: "GET",
            queryParams: {
                filter,
                size: 100
            }
        })
        console.log(res.data?.result)
        setData(res.data?.result)
    }
    const debouncedFilter = useRef(debounce((search) => {
        if (search.length > 0) {
            const filter = sfLike("name", `*${search}*`).toString();
            console.log(filter)
            fetchData(filter)
        }


    }, 1000)).current
    useEffect(() => {
        debouncedFilter(search);
    }, [search])
    const checkAuth = async () => {
        const session = await getSession();
        if (session?.access_token) {
            setIsAuth(true)
        } else {
            setIsAuth(false);
        }
    }
    useEffect(() => {
        checkAuth()
    }, [])
    const logout = async () => {
        await signOut({ redirect: false })
        router.push("/login")

    }
    return (
        <>
            <AppBar position="static" sx={{ backgroundColor: "white" }}>
                <Container maxWidth={false}>
                    <Toolbar disableGutters sx={{
                        display: 'flex',
                        justifyContent: "space-between"
                    }}>
                        <Image src={Logo} alt='Logo' width={300} height={100} />
                        <FormControl sx={{

                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignContent: "center"
                        }}>
                            {/* <FormLabel><SearchIcon /></FormLabel>
                            <Autocomplete
                                onChange={(e, v) => console.log(v)}
                                sx={{ width: { xl: "800px" }, }}
                                placeholder="Search anything"
                                type="search"
                                freeSolo
                                disableClearable
                                value={search}
                                options={data!}
                                //@ts-ignore
                                getOptionLabel={(option) => option.name}
                                renderOption={(props, option) => (
                                    <AutocompleteOption {...props} key={Math.random().toString()}>
                                        <ListItemDecorator>
                                            <Image
                                                loading="lazy"
                                                width="60"
                                                height={60}
                                                src={LaptopAL}
                                                alt='sd'
                                            />
                                        </ListItemDecorator>
                                        <ListItemContent sx={{ fontSize: 'sm' }}>
                                            {option.name}
                                            <Typography level="body-xs">
                                                ({option.price})
                                            </Typography>
                                        </ListItemContent>
                                    </AutocompleteOption>
                                )}
                            /> */}
                            <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "start"
                            }}>
                                <TextField
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Search />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    placeholder="Search…"
                                    value={search}
                                    onBlur={(e) => { setTimeout(() => setIsShow(false), 300) }}
                                    onFocus={(e) => { setIsShow(true) }}
                                    onChange={(e) => {
                                        setSearch(e.target.value)
                                    }}
                                    sx={{
                                        border: "1px solid black",
                                        borderRadius: "10px",
                                        width: "800px",
                                    }}
                                />
                                {
                                    <div style={{ position: "relative", display: isShow ? "block" : "none" }}>
                                        <Box sx={{
                                            width: '800px',
                                            position: "absolute",
                                            zIndex: 200,
                                            bgcolor: 'background.paper',
                                            maxHeight: "200px", overflowY: "scroll",
                                            color: "black",

                                        }}>
                                            <nav aria-label="main mailbox folders">
                                                <List>

                                                    {data?.map((item, index) => {
                                                        return (
                                                            <div key={`${index}-${item.id}}`} onClick={(e) => {

                                                                router.push(`/${item.id}`)
                                                            }}>

                                                                <ListItem alignItems="flex-start" sx={{
                                                                    cursor: "pointer",
                                                                    "&:hover": {
                                                                        bgcolor: "lightgray"
                                                                    }
                                                                }}>
                                                                    <ListItemAvatar>
                                                                        <Avatar alt="Travis Howard" src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/product/${item.mainImage}`} />
                                                                    </ListItemAvatar>
                                                                    <ListItemText
                                                                        primary={item.name}
                                                                        secondary={
                                                                            <>
                                                                                <Typography
                                                                                    component="span"
                                                                                    sx={{ color: 'red', display: 'inline' }}
                                                                                >
                                                                                    {item.price} USD
                                                                                </Typography>
                                                                                {`          ${item?.name} ,${item?.cpu} ,${item?.ram} ,${item?.rom} ,${item?.screen} ,${item?.os} ,${item?.gpu} ,${item?.type}`}
                                                                            </>
                                                                        }
                                                                    />
                                                                </ListItem>
                                                                <Divider variant="inset" component="li" />

                                                            </div>
                                                        )
                                                    })}


                                                </List>
                                            </nav>
                                            <Divider />
                                        </Box>
                                    </div>

                                }
                            </Box>

                        </FormControl>
                        {isAuth ?
                            <Box sx={{
                                display: "flex",
                            }}>
                                <Box sx={{
                                    marginRight: 3

                                }}
                                    onClick={() => setOpen(true)}
                                >
                                    <Badge badgeContent={cart?.length} color="primary">
                                        <Avatar>

                                            <ShoppingCartIcon sx={{

                                                color: "white"
                                            }} />
                                        </Avatar>
                                    </Badge>
                                </Box>
                                <Box sx={{ flexGrow: 0, marginRight: 20 }}>
                                    <Tooltip title="Open settings">
                                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                            <Avatar alt={profile?.userName} src={`${formatImageUrl(profile?.image ?? "")}`} />
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
                                            <Typography sx={{ textAlign: 'center' }}><span onClick={logout}>Logout</span></Typography>
                                        </MenuItem>
                                        <MenuItem onClick={handleCloseUserMenu}>
                                            <Typography sx={{ textAlign: 'center' }}><span onClick={() => setOpenModalUpdateProfile(true)}>History</span></Typography>
                                        </MenuItem>
                                        <MenuItem onClick={handleCloseUserMenu}>
                                            <Typography sx={{ textAlign: 'center' }}><span onClick={() => setOpenProfile(true)}>Profile</span></Typography>
                                        </MenuItem>
                                    </Menu>
                                </Box>
                            </Box>
                            :
                            <Button onClick={() => router.push("/login")}>
                                Login
                            </Button>

                        }
                    </Toolbar>
                </Container>
            </AppBar>
            <CartDrawer open={open} setOpen={setOpen} />
            <ModalUpdateProfile history={history} open={openModalUpdateProfile} setOpen={setOpenModalUpdateProfile} />
            <ModalProfile profile={profile} open={openProfile} setOpen={setOpenProfile} />
        </>
    );
}
export default ResponsiveAppBar;

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
import { alpha, Autocomplete, Badge, Divider, InputAdornment, InputBase, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Popover, styled, TextField, } from '@mui/material';
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

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
interface IData {
    title: string,
    year: number
}
const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));
function ResponsiveAppBar() {
    const [anchorEl, setAnchorEl] = useState<any>(null);

    const [search, setSearch] = useState<string>('');
    const [data, setData] = useState<IProduct[]>([])
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [open, setOpen] = useState(false)
    const fetchSearch = () => {

    }
    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const fetchData = async (filter: string) => {
        const res = await sendRequest<IBackendRes<IModelPaginate<IProduct>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/product`, method: "GET",
            nextOption: {
                next: { tags: ['get-product'] }
            },
            queryParams: {
                filter,
                size: 100
            }
        })
        const data1 = res.data?.result.map((item) => ({ ...item, title: item.name }))
        console.log(data1)
        setData(data)
    }
    const debouncedFilter = useRef(debounce((search) => {
        if (search.length > 0) {
            const filter = sfLike("name", search).toString();
            fetchData(filter)
        }


    }, 1000)).current
    useEffect(() => {
        console.log("dsalkhda")
        debouncedFilter(search);
    }, [search])


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
                            {/* <Box>
                                <Autocomplete
                                    disablePortal
                                    options={top100Films}
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField {...params} label="Movie" />}
                                />
                                <Box sx={{ width: '100%', position: "relative", maxWidth: 360, bgcolor: 'background.paper', maxHeight: "200px", overflowY: "scroll" }}>
                                    <nav aria-label="main mailbox folders">
                                        <List sx={{ position: "absolute" }}>
                                            <ListItem disablePadding>
                                                <ListItemButton>
                                                    <ListItemIcon>
                                                        <InboxIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Inbox" />
                                                </ListItemButton>
                                            </ListItem>
                                            <ListItem disablePadding>
                                                <ListItemButton>
                                                    <ListItemIcon>
                                                        <DraftsIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Drafts" />
                                                </ListItemButton>
                                            </ListItem>
                                        </List>
                                    </nav>
                                    <Divider />
                                    <nav aria-label="secondary mailbox folders">
                                        <List>
                                            <ListItem disablePadding>
                                                <ListItemButton>
                                                    <ListItemText primary="Trash" />
                                                </ListItemButton>
                                            </ListItem>
                                            <ListItem disablePadding>
                                                <ListItemButton component="a" href="#simple-list">
                                                    <ListItemText primary="Spam" />
                                                </ListItemButton>
                                            </ListItem>
                                        </List>
                                    </nav>
                                </Box>
                            </Box> */}
                            <Box sx={{
                                display: "flex",
                                alignItems: "center",
                                alignSelf: "center"
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
                                    onFocus={(e) => { setAnchorEl(e.currentTarget) }}
                                    onChange={(e) => {

                                        setSearch(e.target.value)
                                    }}
                                    sx={{
                                        border: "1px solid black"
                                    }}
                                />

                                <Popover
                                    open={Boolean(anchorEl)}
                                    anchorEl={anchorEl}
                                    onClose={() => setAnchorEl(null)}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                />
                            </Box>
                        </FormControl>
                        <Box sx={{
                            display: "flex",
                        }}>
                            <Box sx={{
                                marginRight: 3

                            }}
                                onClick={() => setOpen(true)}
                            >
                                <Badge badgeContent={4} color="primary">
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
                                        <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
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
                                    {settings.map((setting) => (
                                        <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                            <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <CartDrawer open={open} setOpen={setOpen} />
        </>
    );
}
export default ResponsiveAppBar;
const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: 'Pulp Fiction', year: 1994 },
    {
        title: 'The Lord of the Rings: The Return of the King',
        year: 2003,
    },
    { title: 'The Good, the Bad and the Ugly', year: 1966 },
    { title: 'Fight Club', year: 1999 },
    {
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        year: 2001,
    },
    {
        title: 'Star Wars: Episode V - The Empire Strikes Back',
        year: 1980,
    },
    { title: 'Forrest Gump', year: 1994 },
    { title: 'Inception', year: 2010 },
    {
        title: 'The Lord of the Rings: The Two Towers',
        year: 2002,
    },
    { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
    { title: 'Goodfellas', year: 1990 },
    { title: 'The Matrix', year: 1999 },
    { title: 'Seven Samurai', year: 1954 },
    {
        title: 'Star Wars: Episode IV - A New Hope',
        year: 1977,
    },
    { title: 'City of God', year: 2002 },
    { title: 'Se7en', year: 1995 },
    { title: 'The Silence of the Lambs', year: 1991 },
    { title: "It's a Wonderful Life", year: 1946 },
    { title: 'Life Is Beautiful', year: 1997 },
    { title: 'The Usual Suspects', year: 1995 },
    { title: 'Léon: The Professional', year: 1994 },
    { title: 'Spirited Away', year: 2001 },
    { title: 'Saving Private Ryan', year: 1998 },
    { title: 'Once Upon a Time in the West', year: 1968 },
    { title: 'American History X', year: 1998 },
    { title: 'Interstellar', year: 2014 },
    { title: 'Casablanca', year: 1942 },
    { title: 'City Lights', year: 1931 },
    { title: 'Psycho', year: 1960 },
    { title: 'The Green Mile', year: 1999 },
    { title: 'The Intouchables', year: 2011 },
    { title: 'Modern Times', year: 1936 },
    { title: 'Raiders of the Lost Ark', year: 1981 },
    { title: 'Rear Window', year: 1954 },
    { title: 'The Pianist', year: 2002 },
    { title: 'The Departed', year: 2006 },
    { title: 'Terminator 2: Judgment Day', year: 1991 },
    { title: 'Back to the Future', year: 1985 },
    { title: 'Whiplash', year: 2014 },
    { title: 'Gladiator', year: 2000 },
    { title: 'Memento', year: 2000 },
    { title: 'The Prestige', year: 2006 },
    { title: 'The Lion King', year: 1994 },
    { title: 'Apocalypse Now', year: 1979 },
    { title: 'Alien', year: 1979 },
    { title: 'Sunset Boulevard', year: 1950 },
    {
        title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
        year: 1964,
    },
    { title: 'The Great Dictator', year: 1940 },
    { title: 'Cinema Paradiso', year: 1988 },
    { title: 'The Lives of Others', year: 2006 },
    { title: 'Grave of the Fireflies', year: 1988 },
    { title: 'Paths of Glory', year: 1957 },
    { title: 'Django Unchained', year: 2012 },
    { title: 'The Shining', year: 1980 },
    { title: 'WALL·E', year: 2008 },
    { title: 'American Beauty', year: 1999 },
    { title: 'The Dark Knight Rises', year: 2012 },
    { title: 'Princess Mononoke', year: 1997 },
    { title: 'Aliens', year: 1986 },
    { title: 'Oldboy', year: 2003 },
    { title: 'Once Upon a Time in America', year: 1984 },
    { title: 'Witness for the Prosecution', year: 1957 },
    { title: 'Das Boot', year: 1981 },
    { title: 'Citizen Kane', year: 1941 },
    { title: 'North by Northwest', year: 1959 },
    { title: 'Vertigo', year: 1958 },
    {
        title: 'Star Wars: Episode VI - Return of the Jedi',
        year: 1983,
    },
    { title: 'Reservoir Dogs', year: 1992 },
    { title: 'Braveheart', year: 1995 },
    { title: 'M', year: 1931 },
    { title: 'Requiem for a Dream', year: 2000 },
    { title: 'Amélie', year: 2001 },
    { title: 'A Clockwork Orange', year: 1971 },
    { title: 'Like Stars on Earth', year: 2007 },
    { title: 'Taxi Driver', year: 1976 },
    { title: 'Lawrence of Arabia', year: 1962 },
    { title: 'Double Indemnity', year: 1944 },
    {
        title: 'Eternal Sunshine of the Spotless Mind',
        year: 2004,
    },
    { title: 'Amadeus', year: 1984 },
    { title: 'To Kill a Mockingbird', year: 1962 },
    { title: 'Toy Story 3', year: 2010 },
    { title: 'Logan', year: 2017 },
    { title: 'Full Metal Jacket', year: 1987 },
    { title: 'Dangal', year: 2016 },
    { title: 'The Sting', year: 1973 },
    { title: '2001: A Space Odyssey', year: 1968 },
    { title: "Singin' in the Rain", year: 1952 },
    { title: 'Toy Story', year: 1995 },
    { title: 'Bicycle Thieves', year: 1948 },
    { title: 'The Kid', year: 1921 },
    { title: 'Inglourious Basterds', year: 2009 },
    { title: 'Snatch', year: 2000 },
    { title: '3 Idiots', year: 2009 },
    { title: 'Monty Python and the Holy Grail', year: 1975 },
];
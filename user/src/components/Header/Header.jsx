import * as React from 'react';

import {styled, alpha} from '@mui/material/styles';

import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';
import SearchIcon from '@mui/icons-material/Search';

import Cookies from 'js-cookie';

import {
    ListItem, ListItemAvatar, ListItemText,
    MenuItem, Button, Avatar, Container,
    Menu, Typography, IconButton, Toolbar, Box,
    AppBar, InputBase, Link
} from "@mui/material";
import {useContext} from "react";
import {SearchQuestionContext} from "../../context/SearchQuestionContext";

const pages = ['Question', 'Leaderboard', 'about'];

const Search = styled('div')(({theme}) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({theme}) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

function Header() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const { searchInput, handleSearchInputChange } = useContext(SearchQuestionContext);
    const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;

    const handleInputChange = (e) => {
        const value = e.target.value;
        handleSearchInputChange(value);
    };
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    }

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleLogout = () => {
        Cookies.remove('user');
        setAnchorElUser(null);
        window.location.href = '/';
    };

    const handleOpenProfile = () => {
        setAnchorElUser(null)
        window.location.href = '/profile';
    }

    return (
        <>
            <AppBar position="fixed" style={{backgroundColor: '#151515', left: 0, right: 0, top: 0}}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <AdbIcon sx={{display: {xs: 'none', md: 'flex'}, mr: 1}}/>
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: {xs: 'none', md: 'flex'},
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                                marginRight: 5,
                            }}
                        >
                            VIETINTELSOCIAL
                        </Typography>

                        <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon/>
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: {xs: 'block', md: 'none'},
                                }}
                            >
                                {pages.map((page) => (
                                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                                        <Typography textAlign="center">{page}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>

                        <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                            {pages.map((page) => (
                                <Button
                                    key={page}
                                    onClick={handleCloseNavMenu}
                                    sx={{
                                        marginRight: 3,
                                        my: 2,
                                        color: 'white',
                                        display: 'block',
                                        fontFamily: 'Arial, sans-serif',
                                        textTransform: 'uppercase',
                                        '&:hover': {color: '#f50057'}
                                    }}
                                >
                                    {page}
                                </Button>
                            ))}
                        </Box>

                        <Box sx={{flexGrow: 1}}>
                            <Search>
                                <SearchIconWrapper>
                                    <SearchIcon/>
                                </SearchIconWrapper>
                                <StyledInputBase
                                    placeholder="Search…"
                                    value={searchInput}
                                    onChange={handleInputChange}
                                    inputProps={{'aria-label': 'search'}}
                                />
                            </Search>
                        </Box>

                        <Box sx={{flexGrow: 0}}>
                            {user ? (
                                    <ListItem onClick={handleOpenUserMenu}>
                                        <ListItemAvatar>
                                            <Avatar sx={{'&:hover': {cursor: 'pointer'}}} alt="Remy Sharp"
                                                    src={user.avatar}/>
                                        </ListItemAvatar>
                                        <IconButton>
                                            <ListItemText
                                                          primary={user.display_name}
                                                          secondary={user.name}
                                                          primaryTypographyProps={{textAlign: 'left'}}
                                            />
                                        </IconButton>
                                    </ListItem>
                                )
                                : (
                                    <Link
                                        underline="none"
                                        color="white"
                                        href="/sign-in"
                                        sx={{
                                            ml: 4
                                        }}
                                    >SIGN UP / SIGN IN</Link>
                                )}
                            <Menu
                                sx={{mt: '45px'}}
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
                                <MenuItem key="profile" onClick={handleOpenProfile}>
                                    <Typography textAlign="center">profile</Typography>
                                </MenuItem>
                                <MenuItem key="logout" onClick={handleLogout}>
                                    <Typography textAlign="center">logout</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <br/> <br/> <br/> <br/> <br/>
        </>
    );
}

export default Header;

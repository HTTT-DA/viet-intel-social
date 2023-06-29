import React, {useState} from 'react';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Badge,
    MenuItem,
    Menu,
    Switch,
} from '@mui/material';
import {
    Menu as MenuIcon,
    AccountCircle,
    Notifications as NotificationsIcon,
    Dashboard as DashboardIcon,
    AccountBox as AccountBoxIcon,
    Category as CategoryIcon,
    VerifiedUser as VerifiedUserIcon,
    Message as MessageIcon,
    ImportExport as ImportExportIcon,
    Api as ApiIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import {Link} from 'react-router-dom';

// Define the navigation items
const navItems = [
    {text: 'Dashboard', icon: <DashboardIcon/>, routePath: 'dashboard'},
    {text: 'Profile', icon: <AccountBoxIcon/>, routePath: 'profile'},
    {text: 'Category', icon: <CategoryIcon/>, routePath: 'category'},
    {text: 'Notification', icon: <NotificationsIcon/>, routePath: 'notification'},
    {text: 'Content censorship', icon: <VerifiedUserIcon/>, routePath: 'content-censorship'},
    {text: 'Message', icon: <MessageIcon/>, routePath: 'message'},
    {text: 'Import / Export', icon: <ImportExportIcon/>, routePath: 'import-export'},
    {text: 'API configure', icon: <ApiIcon/>, routePath: 'api-configure'},
    {text: 'Logout', icon: <LogoutIcon/>, routePath: 'logout'}
];

const Header = () => {
    const [navMenuOpen, setNavMenuOpen] = useState(false);
    const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
    const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleNotificationToggle = (event) => {
        event.stopPropagation();
        setIsNotificationEnabled(event.target.checked);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setNavMenuOpen(false);
        setNotificationMenuOpen(false);
    };

    const handleNavMenuClick = () => {
        setNavMenuOpen(!navMenuOpen);
        setNotificationMenuOpen(false);
    };

    const handleNotificationMenuClick = () => {
        setNotificationMenuOpen(!notificationMenuOpen);
        setNavMenuOpen(false);
    };

    const renderNotification = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id="primary-search-account-menu"
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={notificationMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Typography variant="h5">Notification</Typography>
                    <Switch
                        checked={isNotificationEnabled}
                        onChange={handleNotificationToggle}
                        color="primary"
                    />
                </Grid>
            </MenuItem>
            {[
                'User01 has posted a question — check it out!',
                'User02 has posted a question — check it out!',
            ].map((notification, index) => (
                <MenuItem key={index} onClick={handleMenuClose}>
                    <Alert severity="info">{notification}</Alert>
                </MenuItem>
            ))}
        </Menu>
    );

    const renderNavItemMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            id="primary-search-account-menu-mobile"
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            open={navMenuOpen}
            onClose={handleMenuClose}
        >
            {navItems.map((item, index) => (
                <MenuItem key={index} component={Link} to={`/${item.routePath}`} onClick={handleMenuClose}
                          sx={{m: 1, p: 1.5}}>
                    {item.icon}
                    <p style={{margin: 1, paddingLeft: 10}}>{item.text}</p>
                </MenuItem>
            ))}
        </Menu>
    );


    return (
        <Box color='inherit' sx={{flexGrow: 1}}>
            <AppBar position="static" color='inherit' elevation={0}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        position='start'
                        color="inherit"
                        aria-label="open drawer"
                        sx={{display: {xs: 'block', md: 'none', sm: 'block'}, position: 'absolute', left: 0,}}
                        onClick={handleNavMenuClick}
                    >
                        <MenuIcon/>
                    </IconButton>
                    {renderNavItemMenu}

                    <Box sx={{display: 'block', position: 'absolute', mr: 2, right: 0, flexGrow: 1}}>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="show 17 new notifications"
                            color="inherit"
                            sx={{ml: 1}}
                        >
                            <Badge>
                                <AccountCircle/>
                            </Badge>
                        </IconButton>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-haspopup="true"
                            onClick={handleNotificationMenuClick}
                            color="inherit"
                            sx={{ml: 1}}
                        >
                            <Badge badgeContent={2} color="error">
                                <NotificationsIcon/>
                            </Badge>
                        </IconButton>
                        {renderNotification}
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Header;

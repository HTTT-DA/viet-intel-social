import React from 'react';
import { Button, Grid, Box, styled, alpha } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AccountBox as AccountBoxIcon,
  Category as CategoryIcon,
  Notifications as NotificationsIcon,
  VerifiedUser as VerifiedUserIcon,
  Message as MessageIcon,
  ImportExport as ImportExportIcon,
  Api as ApiIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

import { Link } from 'react-router-dom';

const StyledUl = styled('ul')({
  listStyle: 'none',
  padding: 0,
  marginTop: 2
});

const Sidebar = () => {
  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, routePath: 'dashboard' },
    { text: 'Profile', icon: <AccountBoxIcon />, routePath: 'profile' },
    { text: 'Category', icon: <CategoryIcon />, routePath: 'category' },
    { text: 'Notification', icon: <NotificationsIcon />, routePath: 'notification' },
    { text: 'Content censorship', icon: <VerifiedUserIcon />, routePath: 'content-censorship' },
    { text: 'Message', icon: <MessageIcon />, routePath: 'message' },
    { text: 'Import / Export', icon: <ImportExportIcon />, routePath: 'import-export' },
    { text: 'API configure', icon: <ApiIcon />, routePath: 'api-configure' },
    { text: 'Logout', icon: <LogoutIcon />, routePath: 'logout' }
  ];

  return (
    <Box
      p={2}
      sx={{display: { xs: 'none', sm: 'none', md: 'block' }}}
      style={{
        position: 'flex',
        left: 0,
        marginTop: 40,
        width: '15vw',
        height: '80vh',
        background: 'linear-gradient(to right bottom, #1976D2, #13005A)',
        borderRadius: 30
      }}
    >
      <Grid container direction="column" alignItems="stretch" justifyContent="space-evenly">
        <StyledUl>
          {navItems.map((navItem, index) => (
            <li
              key={index}
              sx={{
                my: 1,
                borderRadius: 10,
              }}
            >
              <Button
                component={Link} // Use the Link component instead of a regular button
                to={`/${navItem.routePath}`} // Define the route path based on the button text
                startIcon={navItem.icon}
                sx={{
                  width: '100%',
                  p: 1.5,
                  justifyContent: 'flex-start',
                  color: 'white',
                  backgroundColor: 'transparent',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'background-color 0.3s ease',
                  fontWeight: 50,
                  fontSize: '16px',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: alpha('#ffffff', 0.1),
                  },
                  '& > span': {
                    display: 'flex',
                    alignItems: 'center',
                  },
                  '& > span > svg': {
                    mr: 1,
                  },
                }}
              >
                {navItem.text.trim()}
              </Button>
            </li>
          ))}
        </StyledUl>
      </Grid>
    </Box>
  );
};

export default Sidebar;

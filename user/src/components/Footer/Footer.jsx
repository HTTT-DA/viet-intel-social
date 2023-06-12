import {Box, Container, ListItem, Toolbar, Typography} from "@mui/material";
import * as React from "react";

import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GoogleIcon from '@mui/icons-material/Google';
import InstagramIcon from '@mui/icons-material/Instagram';

function Footer () {
  return (
    <>
        <Box position="fixed" style={{backgroundColor: '#151515', left:0, bottom:0, right:0}}>
            <Container maxWidth="xl" >
                <Toolbar>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: {xs: 'none', md: 'flex'},
                            fontFamily: 'Roboto',
                            color: '#A5A5A5',
                            textDecoration: 'none',
                        }}
                    >
                        Get connected with us on social networks:
                    </Typography>

                    <Box sx={{flexGrow: 0, position:'fixed', right:0}}>
                        <ListItem>
                            <FacebookIcon sx={{display: {xs: 'none', md: 'flex'}, mr: 4}}/>
                            <TwitterIcon sx={{display: {xs: 'none', md: 'flex'}, mr: 4}}/>
                            <GitHubIcon sx={{display: {xs: 'none', md: 'flex'}, mr: 4}}/>
                            <LinkedInIcon sx={{display: {xs: 'none', md: 'flex'}, mr: 4}}/>
                            <GoogleIcon sx={{display: {xs: 'none', md: 'flex'}, mr: 4}}/>
                            <InstagramIcon sx={{display: {xs: 'none', md: 'flex'}, mr: 4}}/>
                        </ListItem>
                    </Box>
                </Toolbar>
            </Container>
        </Box>
    </>
  )
}

export default Footer;
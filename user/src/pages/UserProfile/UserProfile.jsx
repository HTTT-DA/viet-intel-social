import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import {Avatar, Card, Grid, Typography} from "@mui/material";
import InformationCard from "../../components/InformationCard/InformationCard";
function handleClickBreadcrumb(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
}

export default function UserProfile() {
    return (
        <>
            <div role="presentation" onClick={handleClickBreadcrumb}>
                <Breadcrumbs aria-label="breadcrumb" sx={{mt:3, mb:3}}>
                    <Link underline="hover" color="inherit" href="/">
                        Home
                    </Link>
                    <Link
                        underline="hover"
                        color="inherit"
                        href="/profile"
                    >
                        Profile
                    </Link>
                    <Typography color="text.primary">Wander</Typography>
                </Breadcrumbs>
            </div>
            <Grid container spacing={3}>
                <Grid item xs={4}>
                    <Grid container direction="column">
                        <Grid item>
                            <Card sx={{backgroundColor: '#151515'}} >
                                <Grid container direction="column" justify="center" alignItems="center">
                                    <Grid item sx={{mt:4}}>
                                        <Avatar sx={{width: 225, height: 225, mb:3}} src="https://i.pinimg.com/236x/09/d4/b1/09d4b1d247d89d7ce3cd159f6b20ecd8.jpg"></Avatar>
                                    </Grid>
                                </Grid>
                            </Card>
                        </Grid>
                        <Grid item sx={{mt:2}}>
                            <Card sx={{backgroundColor: '#151515'}} >
                                <Grid container direction="column" sx={{ml:3, mt:1, mb: 1}}>
                                    <Typography>
                                        You posted 8 questions
                                    </Typography>
                                    <Typography>
                                        You answered 4 questions
                                    </Typography>
                                    <Typography>
                                        You got 74 points
                                    </Typography>
                                </Grid>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={8}>
                    <Grid item>
                        <InformationCard/>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}
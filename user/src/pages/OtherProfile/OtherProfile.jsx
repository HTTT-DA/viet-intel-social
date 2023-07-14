import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import {Avatar, Card,Grid,Typography} from "@mui/material";
import {useEffect} from "react";
import OtherInformationCard from "../../components/OtherInformationCard/OthereInformationCard";
import {useParams} from "react-router-dom";

export default function OtherProfile() {
    const [user, setUser] = React.useState(null);
    const {id} = useParams();

    useEffect(() => {
        fetch("http://localhost:8000/user/profile/"+id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(
            (res) => {
                res.json().then(
                    (r) => {
                        setUser(r.data);
                    }
                )
            }
        )
    }, [id]);


    return (
        <>
            {user?(
                <div role="presentation">
                    <Breadcrumbs aria-label="breadcrumb" sx={{mt:3, mb:3}}>
                        <Link underline="hover" color="inherit" href="/">
                            Home
                        </Link>
                        <Typography color="text.primary">Profile</Typography>
                        <Typography color="text.primary">{user.name}</Typography>
                    </Breadcrumbs>
                </div>
            ):(<> </>)}
            <Grid container spacing={3}>
                <Grid item xs={4}>
                    {user? (
                        <Grid container direction="column">
                            <Grid item>
                                <Card sx={{backgroundColor: '#151515'}} >
                                    <Grid container direction="column" justify="center" alignItems="center">
                                        <Grid item sx={{mt:4}}>
                                            <Avatar sx={{width: 225, height: 225, mb:3}} src={user.avatar}></Avatar>
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Grid>
                            <Grid item sx={{mt:2}}>
                                <Card sx={{backgroundColor: '#151515'}} >
                                    <Grid container direction="column" sx={{ml:3, mt:1, mb: 1}}>
                                        <Typography>
                                            {user.name} posted 8 questions
                                        </Typography>
                                        <Typography>
                                            {user.name} answered 4 questions
                                        </Typography>
                                        <Typography>
                                            {user.name} got 74 points
                                        </Typography>
                                    </Grid>
                                </Card>
                            </Grid>
                        </Grid>
                    ):(<></>)}
                </Grid>
                <Grid item xs={8}>
                    <Grid item>
                        {user ? (<OtherInformationCard user={user}/>):(<></>)}
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}
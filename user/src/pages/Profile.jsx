import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import {Avatar, Button, Card, Grid, Typography} from "@mui/material";
import InformationCard from "../components/InformationCard";
import ChangePasswordCard from "../components/ChangePasswordCard";
import {useNavigate} from "react-router-dom";
import CheckACTokenAndRFToken from "../utils/CheckACTokenAndRFToken";
function handleClickBreadcrumb(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
}

export default function Profile() {
    const navigate = useNavigate();
    const [user] = React.useState(CheckACTokenAndRFToken());

    return (
        <>
            <div role="presentation" onClick={handleClickBreadcrumb}>
                <Breadcrumbs aria-label="breadcrumb" sx={{mt:3, mb:3}}>
                    <Link underline="hover" component="button" color="inherit" onClick={()=>{navigate('/')}}>
                        Home
                    </Link>
                    <Typography color="inherit">
                        Profile
                    </Typography>
                </Breadcrumbs>
            </div>
            <Grid container spacing={3}>
                <Grid item xs={4}>
                    <Grid container direction="column">
                        <Grid item>
                            <Card sx={{backgroundColor: '#151515'}} >
                                <Grid container direction="column" justify="center" alignItems="center">
                                    <Grid item sx={{mt:4}}>
                                        <Avatar sx={{width: 175, height: 175}} src={user.avatar}></Avatar>
                                    </Grid>
                                    <Grid item sx={{mb:3}}>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                marginTop: 3,
                                                color: '#000000',
                                                backgroundColor: '#ffffff',
                                                fontWeight: 'bold',
                                                '&:hover': {backgroundColor: '#000000'},
                                            }}
                                        >Change Avatar</Button>
                                    </Grid>
                                </Grid>
                            </Card>
                        </Grid>
                        <Grid item sx={{mt:2}}>
                            <Card sx={{backgroundColor: '#151515'}} >
                                <Grid container direction="column" sx={{ml:3, mt:1, mb: 1}}>
                                    <Typography>
                                        You posted {user.question_count} questions
                                    </Typography>
                                    <Typography>
                                        You answered {user.answer_count} questions
                                    </Typography>
                                    <Typography>
                                        You got {user.point} points
                                    </Typography>
                                </Grid>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={8}>
                    <Grid item>
                        <InformationCard user={user}/>
                    </Grid>
                    <Grid item sx={{mt:2}}>
                        <ChangePasswordCard id={user.id}/>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}
import {Avatar, Button, Card, Grid, Typography} from "@mui/material";
import * as React from "react";
import Cookies from "js-cookie";

function ProfileCard() {
    const [user] = React.useState(Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null);

    return (
        <>
            <Card sx={{minWidth: 250, backgroundColor: '#151515'}}>
                <Grid container direction="column" justify="center" alignItems="center">
                    {
                        user ? (
                                <>
                                    <Grid item sx={{marginTop: 3}}>
                                        <Avatar sx={{width: 75, height: 75}}
                                                src={user.avatar}></Avatar>
                                    < /Grid>
                                    <Grid item>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                marginTop: 2,
                                                color: '#8F8F8F',
                                                fontWeight: 'bold'
                                            }}
                                        >{user.name}</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                color: '#928484',
                                            }}
                                        >{user.display_name}</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            href="/profile"
                                            variant="contained"
                                            sx={{
                                                marginTop: 3,
                                                color: '#000000',
                                                backgroundColor: '#ffffff',
                                                fontWeight: 'bold',
                                                '&:hover': {backgroundColor: '#000000'},
                                            }}
                                        >Edit Profile</Button>
                                    </Grid>
                                    <Grid item sx={{marginTop: 3, marginBottom: 3}}>
                                        <Grid container spacing={4}>
                                            <Grid item xs={4}>
                                                <Grid container direction="column" alignItems="center">
                                                    <Grid item>
                                                        <Typography
                                                            variant="subtitle1"
                                                            sx={{
                                                                color: 'white',
                                                                fontFamily: 'Roboto',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            {user.answer_count}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item>
                                                        Answers
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Grid container direction="column" alignItems="center">
                                                    <Grid item>
                                                        <Typography
                                                            variant="subtitle1"
                                                            sx={{
                                                                color: 'white',
                                                                fontFamily: 'Roboto',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            {user.question_count}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item>
                                                        Asks
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Grid container direction="column" alignItems="center">
                                                    <Grid item>
                                                        <Typography
                                                            variant="subtitle1"
                                                            sx={{
                                                                color: 'white',
                                                                fontFamily: 'Roboto',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            {user.point}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item>
                                                        Points
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                </>
                            )
                            :
                            (
                                <>
                                    <Typography
                                        sx={{
                                            mt: 10,
                                            mb: 10
                                        }}
                                    >
                                        Please login to see your points
                                    </Typography>
                                </>
                            )
                    }
                </Grid>
            </Card>
        </>
    )
        ;
}

export default ProfileCard;
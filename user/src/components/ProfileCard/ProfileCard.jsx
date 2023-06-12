import {Avatar, Button, Card,  Grid, Typography} from "@mui/material";

function ProfileCard() {
    return (
        <>
            <Card sx={{minWidth: 250, backgroundColor: '#151515'}}>
                <Grid container direction="column" justify="center" alignItems="center">
                    <Grid item sx={{marginTop:3}}>
                        <Avatar sx={{width: 75, height: 75}} src="https://i.pinimg.com/236x/09/d4/b1/09d4b1d247d89d7ce3cd159f6b20ecd8.jpg"></Avatar>
                    </Grid>
                    <Grid item>
                        <Typography
                            variant="h6"
                            sx={{
                                marginTop: 2,
                                color:'#8F8F8F',
                                fontWeight: 'bold'
                                }}
                        >Phung Anh Khoa</Typography>
                    </Grid>
                    <Grid item>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                color: '#928484',
                                }}
                        >@Wander</Typography>
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
                                <Grid container direction="column" alignItems="center" >
                                    <Grid item>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                color: 'white',
                                                fontFamily: 'Roboto',
                                                fontWeight: 'bold'
                                                }}
                                        >
                                            128
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        Answers
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4}>
                                <Grid container direction="column" alignItems="center" >
                                    <Grid item>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                color: 'white',
                                                fontFamily: 'Roboto',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            38
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
                                            74
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        Points
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>
            </Card>
        </>
    );
}

export default ProfileCard;
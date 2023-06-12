import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {Card} from "@mui/material";
import * as React from "react";

export default function ChangePasswordCard() {
    return(
        <>
            <Card sx={{backgroundColor: '#151515'}} >
                <Typography
                    sx={{
                        color: '#fff',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        padding: '1rem'}}
                >
                    CHANGE PASSWORD
                </Typography>
                <Grid container spacing={2} sx={{ml:1}}>
                    <Grid item xs={4} sx={{mb:4}}>
                        <TextField
                            id="old-password"
                            defaultValue="************"
                            label="Old Password"
                            variant="standard" />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="new-password"
                            defaultValue="************"
                            label="New Password"
                            variant="standard" />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="confirm-password"
                            defaultValue="************"
                            label="Confirm Password"
                            variant="standard" />
                    </Grid>
                </Grid>
            </Card>
        </>
    )
}
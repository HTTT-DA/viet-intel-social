import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {Alert, Card, Snackbar} from "@mui/material";
import * as React from "react";
import {useState} from "react";

export default function ChangePasswordCard(props) {
    const [open, setOpen] = useState(false);

    const handleChangePassword = (event) => {
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        if (newPassword !== confirmPassword) {
            event.target.value = '';
            alert('Password does not match');
        }
        else {
            const oldPassword = document.getElementById('oldPassword').value;
            fetch('http://localhost:8000/auth/change-password/' + props.id + '/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    old_password: oldPassword,
                    new_password: newPassword,
                })
            }).then(()=>{
                setOpen(true);
            });
        }
    }

    const handleClose = (event, reason) => {
        setOpen(false);
    }

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
                            id="oldPassword"
                            placeholder="************"
                            label="Old Password"
                            type="password"
                            variant="standard" />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="newPassword"
                            placeholder="************"
                            label="New Password"
                            type="password"
                            variant="standard" />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="confirmPassword"
                            placeholder="************"
                            label="Confirm Password"
                            type="password"
                            variant="standard"
                            onBlur={handleChangePassword}
                        />
                    </Grid>
                </Grid>
                <Snackbar
                    open={open}
                    autoHideDuration={3000}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    sx={{mt:10}}
                >
                    <Alert
                        elevation={6}
                        variant="filled"
                        onClose={handleClose}
                        severity="success"
                    >
                        Update password successfully!
                    </Alert>
                </Snackbar>
            </Card>
        </>
    )
}
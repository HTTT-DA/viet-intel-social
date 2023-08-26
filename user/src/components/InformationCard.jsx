import { Card, FormControl, InputLabel, NativeSelect} from "@mui/material";
import * as React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import bcrypt from "bcryptjs";

export default function InformationCard(props) {
    const handleChange = (event) => {
        const {id, value} = event.target;
        let newValue = value;

        if(id === 'password') {
            newValue  = bcrypt.hashSync(value, "$2a$10$SYxZJIAtGW0.wS06D.hPJe");
        }
        fetch('http://localhost:8000/api/users/update-information', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            },
            body: JSON.stringify({
                [id]: newValue,
            })
        }).then(
            (res) => {
                res.json().then(
                    (r) => {
                        localStorage.setItem('access_token', r.data.access_token);
                    }
                )
            }
        )
    }

    return (
        <>
            <Card sx={{backgroundColor: '#151515'}}>
                <Typography
                    sx={{
                        color: '#fff',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        padding: '1rem'
                    }}
                >
                    INFORMATION
                </Typography>
                <Grid container spacing={2} sx={{ml: 1}}>
                    <Grid item xs={4} sx={{mb: 4}}>
                        <TextField
                            id="name"
                            defaultValue={props.user.name}
                            label="Name"
                            variant="standard"
                            onBlur={handleChange}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="ranker"
                            defaultValue={props.user.ranker}
                            label="Ranker"
                            disabled
                            variant="standard"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="email"
                            defaultValue={props.user.email}
                            label="Email"
                            variant="standard"
                            disabled
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                            id="display_name"
                            defaultValue={props.user.display_name}
                            label="DisplayName"
                            variant="standard"
                            onBlur={handleChange}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="city"
                            defaultValue={props.user.city}
                            label="City"
                            variant="standard"
                            onBlur={handleChange}
                        />
                    </Grid>
                    <Grid item xs={4} sx={{mb: 5}}>
                        <FormControl variant="standard" label="Gender" sx={{minWidth: 200}}>
                            <InputLabel variant="standard" htmlFor="gender">Gender</InputLabel>
                            <NativeSelect
                                defaultValue={props.user.gender}
                                inputProps={{
                                    name: 'Gender',
                                    id: 'gender',
                                }}
                                onBlur={handleChange}
                            >
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                            </NativeSelect>
                        </FormControl>
                    </Grid>
                </Grid>
            </Card>
        </>
    )
}
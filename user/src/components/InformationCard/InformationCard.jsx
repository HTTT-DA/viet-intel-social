import { Card, FormControl, InputLabel, NativeSelect} from "@mui/material";
import * as React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Cookies from "js-cookie";

export default function InformationCard(props) {
    const handleChange = (event) => {
        const {id, value} = event.target;
        fetch('http://localhost:8000/user/update/'+ props.user.id+'/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                [id]: value,
            })
        }).then(
            (res) => {
                res.json().then(
                    (r) => {
                        Cookies.set('user', JSON.stringify(r.data));
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
                            id="role"
                            defaultValue={props.user.role}
                            label="Role"
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
                            onBlur={handleChange}
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
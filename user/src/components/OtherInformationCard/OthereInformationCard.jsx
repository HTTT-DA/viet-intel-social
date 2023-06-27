import { Card, FormControl, InputLabel, NativeSelect} from "@mui/material";
import * as React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

export default function OtherInformationCard(props) {
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
                            disabled
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
                            disabled
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                            id="display_name"
                            defaultValue={props.user.display_name}
                            label="DisplayName"
                            variant="standard"
                            disabled
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="city"
                            defaultValue={props.user.city}
                            label="City"
                            variant="standard"
                            disabled
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
                                disabled
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
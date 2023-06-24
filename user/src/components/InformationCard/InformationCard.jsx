import {Card, FormControl, InputLabel, NativeSelect} from "@mui/material";
import * as React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

export default function InformationCard() {
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
                            defaultValue="Phung Anh Khoa"
                            label="Name"
                            variant="standard"/>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="role"
                            defaultValue="Admin"
                            label="Role"
                            variant="standard"/>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="gmail"
                            defaultValue="Wander@gmail.com"
                            label="Gmail"
                            variant="standard"/>
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                            id="display-name"
                            defaultValue="Wander"
                            label="DisplayName"
                            variant="standard"/>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="city"
                            defaultValue="Ho Chi Minh"
                            label="City"
                            variant="standard"/>
                    </Grid>
                    <Grid item xs={4} sx={{mb: 5}}>
                        <FormControl variant="standard" label="Gender" sx={{minWidth: 200}}>
                            <InputLabel variant="standard" htmlFor="uncontrolled-native">Gender</InputLabel>
                            <NativeSelect
                                defaultValue={10}
                                inputProps={{
                                    name: 'Gender',
                                    id: 'uncontrolled-native',
                                }}
                            >
                                <option value={10}>Male</option>
                                <option value={20}>Female</option>
                            </NativeSelect>
                        </FormControl>
                    </Grid>
                </Grid>
            </Card>
        </>
    )
}
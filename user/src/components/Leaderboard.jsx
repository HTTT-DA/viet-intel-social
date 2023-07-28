import * as React from 'react';
import {
    Card, Grid, Table, TableBody, TableCell, TableContainer,
    TableRow, Paper, Typography, Avatar, IconButton, ListItemText, ListItem
} from '@mui/material';
import {useEffect} from "react";
import Link from "@mui/material/Link";
import {useNavigate} from "react-router-dom";


export default function Leaderboard() {
    const [rankings, setRankings] = React.useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8000/api/users/get-user-points-of-month', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(
            (res) => {
                res.json().then(
                    (r) => {
                        setRankings(r.data);
                    }
                )
            }
        ).catch(() => {
        })
    }, [])

    return (
        <>
            <Card sx={{minWidth: 325, backgroundColor: '#151515'}}>
                <Grid container direction="column">
                    <Grid item>
                        <Grid container direction="row" justifyContent="space-between" alignItems="center"
                              sx={{padding: 2}}>
                            <Grid item>
                                <Typography
                                    sx={{fontWeight: 600, color: '#fff', fontSize: 16}}
                                >
                                    LEADERBOARD
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography
                                    sx={{fontWeight: 300, color: '#5e5d5d', fontSize: 12}}
                                >
                                    Monthly Ranking
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item>
                        <TableContainer component={Paper} sx={{overflow: 'hidden'}}>
                            <Table sx={{minWidth: 250, backgroundColor: '#151515'}}
                                   aria-label="custom pagination table">
                                <TableBody>
                                    {rankings.map((ranking, index) => (
                                        <TableRow key={index}>
                                            <TableCell component="th" scope="row" sx={{
                                                color: '#ffffff',
                                                fontSize: 12,
                                                fontWeight: 600,
                                                p: 2
                                            }}>
                                                {index + 1}
                                            </TableCell>
                                            <TableCell style={{width: 320}} sx={{p: 1}}>
                                                <ListItem sx={{width: '100px', height: '25px'}}>
                                                    <Avatar alt="Remy Sharp" src={ranking.user.avatar}
                                                            sx={{width: 30, height: 30, marginRight: 1}}
                                                    />
                                                    <IconButton>
                                                        <ListItemText primary={
                                                            <Link onClick={()=>{navigate(`/profile/${ranking.user.id}`)}} underline="none" sx={{fontWeight: 'bold'}}>{ranking.user.name}</Link>
                                                        }
                                                                      secondary={ranking.user.display_name}
                                                                      primaryTypographyProps={{
                                                                          textAlign: 'left',
                                                                          fontSize: 12,
                                                                          fontWeight: 600
                                                                      }}
                                                                      secondaryTypographyProps={{
                                                                          textAlign: 'left',
                                                                          fontSize: 10,
                                                                          fontWeight: 300
                                                                      }}
                                                        />
                                                    </IconButton>
                                                </ListItem>
                                            </TableCell>
                                            <TableCell style={{width: 160}} align="right" sx={{
                                                color: '#767676',
                                                fontSize: 10,
                                                fontWeight: 600,
                                                p: 1
                                            }}>
                                                {ranking.point}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Card>
        </>
    )
}
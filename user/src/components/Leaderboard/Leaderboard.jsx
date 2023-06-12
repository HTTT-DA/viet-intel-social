import * as React from 'react';
import {
    Card, Grid, Table, TableBody, TableCell, TableContainer,
    TableRow, Paper, Typography, Avatar, IconButton, ListItemText, ListItem
} from '@mui/material';

function createData(id, avatar, name, display_name, point) {
    return { id, avatar, name, display_name, point };
}

const rows = [
    createData('1', 'https://i.pinimg.com/236x/09/d4/b1/09d4b1d247d89d7ce3cd159f6b20ecd8.jpg', 'Phung Anh Khoa', '@Wander', 100),
    createData('2', 'https://i.pinimg.com/236x/40/ba/1c/40ba1cfebe147516ca376d43ae132eb3.jpg', 'Ngo Nhat Minh', '@Minh', 74),
    createData('3', 'https://i.pinimg.com/236x/b9/f4/91/b9f491dde229319b060fc68080c81cae.jpg', 'Nguyen Huu Long', '@Vergil', 65),
    createData('4', 'https://i.pinimg.com/236x/e3/fc/37/e3fc370ad5af7803b780640250a6040a.jpg', 'Nguyen Thanh Quan', '@Quan', 55),
    createData('5', 'https://i.pinimg.com/236x/e1/d9/2d/e1d92dbe61bf94456c2b93e41d584145.jpg', 'Nguyen Duc Nam', '@Kygor', 54),
    createData('6', 'https://i.pinimg.com/236x/a5/42/58/a54258f2f3ee9464d025c0b2e59b0b89.jpg', 'Ngo Huy Anh', '@Anh', 43),
    createData('7', 'https://i.pinimg.com/236x/56/87/02/568702b85669e65414a76e8bdbe14d31.jpg', 'Dinh Hoa Lu', '@LuL', 16),
    createData('8', 'https://i.pinimg.com/236x/53/7f/0a/537f0ac0628ab161b3cb8d3868cd906a.jpg', 'Nguyen Tran Phuong Anh', '@Lewlewd', 5),
    createData('9', 'https://i.pinimg.com/236x/b4/5d/60/b45d60b7a6036fedec48b04d8cf57578.jpg', 'Hoang Thanh Lam', '@Lam', 3),
    createData('10', 'https://i.pinimg.com/236x/f8/76/f4/f876f42877439f28720c5973353a05b8.jpg', 'Triu Nguyen Phat', '@Hikan', 2)
];

export default function Leaderboard() {
    const [page] = React.useState(0);
    const [rowsPerPage] = React.useState(10);

    return (
        <>
            <Card sx={{minWidth: 325, backgroundColor: '#151515'}} >
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
                        <TableContainer component={Paper} sx={{ overflow: 'hidden' }}>
                            <Table sx={{ minWidth: 250, backgroundColor: '#151515'}} aria-label="custom pagination table">
                                <TableBody>
                                    {(rowsPerPage > 0
                                            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            : rows
                                    ).map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell component="th" scope="row" sx={{
                                                color: '#ffffff',
                                                fontSize: 12,
                                                fontWeight: 600,
                                                p:2
                                            }}>
                                                {row.id}
                                            </TableCell>
                                            <TableCell style={{ width: 320 }} sx={{p: 1}}>
                                                <ListItem sx={{width: '100px', height: '25px'}}>
                                                    <Avatar alt="Remy Sharp" src={row.avatar}
                                                            sx={{width: 30, height: 30, marginRight: 1}}
                                                    />
                                                    <IconButton>
                                                        <ListItemText primary= {row.name}
                                                                      secondary= {row.display_name}
                                                                      primaryTypographyProps={{ textAlign: 'left', fontSize: 12, fontWeight: 600 }}
                                                                      secondaryTypographyProps={{ textAlign: 'left', fontSize: 10, fontWeight: 300 }}
                                                        />
                                                    </IconButton>
                                                </ListItem>
                                            </TableCell>
                                            <TableCell style={{ width: 160 }} align="right" sx={{
                                                color: '#767676',
                                                fontSize: 10,
                                                fontWeight: 600,
                                                p: 1
                                            }} >
                                                {row.point}
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
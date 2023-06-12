import * as React from 'react';

import {
    Card, CardHeader, CardContent, CardActions,
    Avatar, IconButton, Typography, Link, Checkbox
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {Favorite, FavoriteBorder} from "@mui/icons-material";

export default function QuestionCard() {
    return (
        <Card sx={{ maxWidth: 600, backgroundColor:'#151515' }}>
            <CardHeader
                avatar={
                    <Avatar src="https://i.pinimg.com/236x/16/b6/2c/16b62cc395060364b8c073eefbd1368c.jpg" aria-label="recipe"/>
                }
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title="Vergil"
                subheader= {
                <>
                    <span>June 07, 2023 | </span>
                    <Link href="#" underline="none" sx={{fontWeight:'bold'}}>@ProgrammingQuestion</Link>
                </>
                }

            />
            <CardContent>
                <Typography >
                    This impressive paella is a perfect party dish and a fun meal to cook
                    together with your guests. Add 1 cup of frozen peas along with the mussels,
                    if you like.
                </Typography>
                <Typography
                    sx={{
                        marginTop: 2,
                        color: '#9D9999',
                        fontSize: 12,
                        }}
                >
                    @OOP &ensp;  @Java &ensp;  @ProgrammingQuestion &ensp;  @Java &ensp;  @ProgrammingQuestion
                </Typography>
            </CardContent>
            <CardActions disableSpacing >
                <IconButton aria-label="add to favorites">
                    <Checkbox icon={<FavoriteBorder sx={{fontSize:'28px'}} />}
                              checkedIcon={<Favorite sx={{color:"#FF3030", fontSize:'28px'}} />} />
                </IconButton>
                <IconButton aria-label="answer">
                    <ChatBubbleOutlineIcon sx={{fontSize:'26px'}} />
                </IconButton>
                <Typography
                    sx={{
                        fontSize: 12,
                        }}
                >
                    124 answers
                </Typography>
            </CardActions>
        </Card>
    );
}
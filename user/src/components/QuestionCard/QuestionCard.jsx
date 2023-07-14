import * as React from 'react';

import {
    Card, CardHeader, CardContent, CardActions,
    Avatar, IconButton, Typography, Link, Checkbox
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {Favorite, FavoriteBorder} from "@mui/icons-material";
import Cookies from "js-cookie";

export default function QuestionCard(props) {
    const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
    const [question, setQuestion] = React.useState(props.question);

    const handeCommentQuestion = (id) => {
        console.log(id);
    }
    const handleLike = () => {
        if (user) {
            fetch('http://localhost:8000/question/like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "question_id": props.question.id,
                    "user_id": user.id
                })
            }).then();
            setQuestion({
                ...question,
                likes: [...question.likes, user]
            });
        } else {
            alert('Please login to like this question!');
        }
    }

    const handleCancelLike = () => {
        if (user) {
            fetch('http://localhost:8000/question/like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "question_id": props.question.id,
                    "user_id": user.id
                })
            }).then();
            setQuestion({
                ...question,
                likes: question.likes.filter((like) => like.id !== user.id)
            });
        } else {
            alert('Please login to like this question!');
        }
    }

    return (
        <Card sx={{maxWidth: 600, backgroundColor: '#151515'}}>
            <CardHeader
                avatar={
                    <Avatar src={question.user.avatar}
                            aria-label="recipe"/>
                }
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon/>
                    </IconButton>
                }
                title={
                    <Link href={`/profile/${question.user.id}`} underline="none" sx={{fontWeight: 'bold'}}>{question.user.name}</Link>
                }
                subheader={
                    <>
                        <span>{question.created_at} | </span>
                        <Link href="#" underline="none" sx={{fontWeight: 'bold'}}>@{question.category.name}</Link>
                    </>
                }

            />
            <CardContent>
                <Typography>
                    {question.content}
                </Typography>
                <Typography
                    sx={{
                        marginTop: 2,
                        color: '#ff0000',
                        fontSize: 12,
                    }}
                >
                    {question.tags.map((tag) => (
                        '@' + tag.name + " "
                    ))}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                    {user && question.likes.find((like) => like.id === user.id)
                        ?
                        (
                            <Checkbox
                                icon={<FavoriteBorder sx={{fontSize: '28px'}}/>}
                                checkedIcon={<Favorite sx={{color: "#FF3030", fontSize: '28px'}}/>}
                                checked={true}
                                onChange={handleCancelLike}
                            />
                        )
                        :
                        (
                            <Checkbox
                                icon={<FavoriteBorder sx={{fontSize: '28px'}}/>}
                                checkedIcon={<Favorite sx={{color: "#FF3030", fontSize: '28px'}}/>}
                                checked={false}
                                onChange={handleLike}
                            />
                        )}

                </IconButton>
                <IconButton aria-label="answer" onClick={()=>{handeCommentQuestion(question.id)}}>
                    <ChatBubbleOutlineIcon sx={{fontSize: '26px'}}/>
                </IconButton>
            </CardActions>
        </Card>
    );
}
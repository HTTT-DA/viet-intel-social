import * as React from 'react';

import {
    Card, CardHeader, CardContent, CardActions,
    Avatar, IconButton, Typography, Link, Checkbox, MenuItem, Menu, ListItemIcon, Rating
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {Favorite, FavoriteBorder} from "@mui/icons-material";
import FlagIcon from '@mui/icons-material/Flag';
import RecommendIcon from '@mui/icons-material/Recommend';
import {useNavigate} from "react-router-dom";
import CheckACTokenAndRFToken from "../utils/CheckACTokenAndRFToken";
import AnswerModal from "./AnswerModal";

export default function QuestionCard(props) {
    const [user] = React.useState(CheckACTokenAndRFToken());
    const [question, setQuestion] = React.useState(props.question);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleRating = (questionID, value) => {
        if (user) {
            fetch('http://localhost:8001/api/questions/rating', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "question_id": questionID,
                    "user_id": user.id,
                    "rating": Number(value)
                })
            }).then();

            question.ratings = question.ratings.filter((rating) => rating.user_id !== user.id);

            question.ratings.push({
                "user_id": user.id,
                "star_number": Number(value)
            });

            setQuestion({
                ...question,
                ratings: question.ratings
            });

        } else {
            alert('Please login to rate this question!');
        }
        setAnchorEl(null);
    }

    const handleEvaluation = (questionID, evaluation) => {
        if (user) {
            fetch('http://localhost:8001/api/questions/evaluate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "question_id": questionID,
                    "user_id": user.id,
                    "evaluation_type": evaluation
                })
            }).then();
            alert('Thank you for your evaluation!');
        } else {
            alert('Please login to evaluate this question!');
        }
        setAnchorEl(null);
    };

    const handleLike = () => {
        if (user) {
            fetch('http://localhost:8001/api/questions/like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "question_id": props.question.id,
                    "user_id": user.id
                })
            }).then();
            question.likes.push(user.id);
            setQuestion({
                ...question,
                likes: question.likes
            });
        } else {
            alert('Please login to like this question!');
        }
    }

    const handleCancelLike = () => {
        if (user) {
            fetch('http://localhost:8001/api/questions/like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "question_id": props.question.id,
                    "user_id": user.id
                })
            }).then();
            question.likes = question.likes.filter((id) => id !== user.id);
            setQuestion({
                ...question,
                likes: question.likes
            });
        } else {
            alert('Please login to like this question!');
        }
    }

    return (
        <Card sx={{maxWidth: 600, backgroundColor: '#151515'}}>
            <CardHeader
                avatar={
                    <Avatar src={question.owner.avatar}
                            aria-label="recipe"/>
                }
                action={
                    <>
                        <IconButton
                            aria-label="more"
                            id="evaluation"
                            aria-controls={open ? 'evaluation' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={handleClick}
                        >
                            <MoreVertIcon/>
                        </IconButton>
                        <Menu
                            id="evaluation"
                            MenuListProps={{
                                'aria-labelledby': 'long-button',
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                        >
                            <MenuItem key="SPAM" onClick={() => {
                                handleEvaluation(question.id, 'SPAM')
                            }}>
                                <ListItemIcon>
                                    <FlagIcon fontSize="small"/>
                                </ListItemIcon>
                                <Typography variant="inherit"> Report Spam</Typography>
                            </MenuItem>
                            <MenuItem key="BAD CONTENT" onClick={() => {
                                handleEvaluation(question.id, 'BAD CONTENT')
                            }}>
                                <ListItemIcon>
                                    <FlagIcon fontSize="small"/>
                                </ListItemIcon>
                                <Typography variant="inherit"> Report Bad Content</Typography>
                            </MenuItem>
                            <MenuItem key="GOOD CONTENT" onClick={() => {
                                handleEvaluation(question.id, 'GOOD CONTENT')
                            }}>
                                <ListItemIcon>
                                    <RecommendIcon fontSize="small"/>
                                </ListItemIcon>
                                <Typography variant="inherit"> Good Content </Typography>
                            </MenuItem>
                        </Menu>
                    </>
                }
                title={
                    <Link component="button" onClick={() => {
                        navigate(`/profile/${question.owner.id}`)
                    }} underline="none"
                          sx={{fontWeight: 'bold'}}>{question.owner.display_name}</Link>
                }

                subheader={
                    <>
                        <span>{question.created_at} | </span>
                        <Link component="button" underline="none"
                              sx={{fontWeight: 'bold'}}>@{question.category.name} </Link>
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
                        '@' + tag.tag_name + " "
                    ))}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                    {user && question.likes.find((id) => id === user.id)
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
                <AnswerModal id={question.id}/>
                {user && question.ratings.find(rating => rating.user_id === user.id)
                    ?
                    (
                        <Rating
                            value={question.ratings.find(rating => rating.user_id === user.id).star_number}
                            onChange={(event, newRating) => {
                                handleRating(question.id, newRating)
                            }}
                            sx={{
                                left: '55%',
                            }}
                        />
                    )
                    :
                    (
                        <Rating
                            value={0}
                            onChange={(event, newRating) => {
                                handleRating(question.id, newRating)
                            }}
                            sx={{
                                left: '55%',
                            }}
                        />
                    )
                }
            </CardActions>
        </Card>
    );
}
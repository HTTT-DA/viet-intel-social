import {Card, CardActions, CardContent, CardHeader, IconButton} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import * as React from "react";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import CheckACTokenAndRFToken from "../utils/CheckACTokenAndRFToken";

export default function AnswerCard(props) {
    const [user] = useState(CheckACTokenAndRFToken());
    const [ratings, setRatings] = useState(props.answer.evaluations);
    const navigate = useNavigate();

    const handleChangeEvaluation = (evaluation_type, method) => {
        if (!user) {
            alert("You need to login to evaluate this answer!")
            return
        }
        if (method === 'PUT') {
            fetch(`http://localhost:8000/answer/${props.answer.id}/create-or-update-evaluation/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    evaluation_type: evaluation_type
                })
            }).then();

            if (ratings.find(rating => rating.user_id === user.id)) {
                setRatings(ratings.map(rating => {
                    if (rating.user_id === user.id) {
                        return {
                            ...rating,
                            evaluation_type: evaluation_type
                        }
                    } else return rating
                }))
            } else {
                setRatings([...ratings, {
                    user_id: user.id,
                    evaluation_type: evaluation_type
                }])
            }
        } else {
            fetch(`http://localhost:8000/answer/${props.answer.id}/delete-evaluation/${user.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then();
            setRatings(ratings.filter(rating => !(rating.user_id === user.id)))
        }
    }

    return (
        <Card sx={{mb: 2}}>
            <CardHeader
                avatar={
                    <Avatar src={props.answer.avatar} aria-label="recipe"/>
                }
                title={
                    <Link component="button" onClick={() => {
                        navigate(`/profile/${props.answer.userID}`)
                    }} underline="none"
                          sx={{fontWeight: 'bold'}}>{props.answer.name}</Link>
                }
                subheader={props.answer.created_at}
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {props.answer.content}
                </Typography>
                {props.answer.reference &&
                    <Link href={props.answer.reference} target="_blank" rel="noopener noreferrer">
                        Reference
                    </Link>
                }
            </CardContent>
            {props.answer.image &&
                <Link
                    href={props.answer.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <img
                        width="500px"
                        height="250px"
                        src={props.answer.image} alt="a"
                        loading="lazy"
                    />
                </Link>
            }
            <CardActions disableSpacing>
                {user && ratings.find(rating => rating.user_id === user.id && rating.evaluation_type === "GOOD")
                    ?
                    (<IconButton aria-label="Like" onClick={() => {
                        handleChangeEvaluation('GOOD', 'DELETE')
                    }}>
                        <ThumbUpIcon sx={{color: "#00719a"}}/>
                    </IconButton>)
                    :
                    (<IconButton aria-label="Like" onClick={() => {
                        handleChangeEvaluation('GOOD', 'PUT')
                    }}>
                        <ThumbUpIcon/>
                    </IconButton>)
                }
                {user && ratings.find(rating => rating.user_id === user.id && rating.evaluation_type === "BAD")
                    ?
                    (<IconButton aria-label="DisLike" onClick={() => {
                        handleChangeEvaluation('BAD', 'DELETE')
                    }}>
                        <ThumbDownIcon sx={{color: "#a8000c"}}/>
                    </IconButton>)
                    :
                    (<IconButton aria-label="DisLike" onClick={() => {
                        handleChangeEvaluation('BAD', 'PUT')
                    }}>
                        <ThumbDownIcon/>
                    </IconButton>)
                }
            </CardActions>
        </Card>
    )
}
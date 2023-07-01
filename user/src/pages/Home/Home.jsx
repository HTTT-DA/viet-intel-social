import {CircularProgress, Grid} from "@mui/material";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import QuestionCard from "../../components/QuestionCard/QuestionCard";
import Leaderboard from "../../components/Leaderboard/Leaderboard";
import QuestionModal from "../../components/QuestionModal/QuestionModal"
import {useEffect, useState} from "react";
import * as React from "react";
import Cookies from "js-cookie";

function Home() {
    const [user] = React.useState(Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8000/question/get-all-accepted-question', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(
            (res) => {
                res.json().then(
                    (r) => {
                        setQuestions(r.data);
                        setLoading(false);
                    }
                )
            }
        ).catch(()=>{});
    }, []);


    return (
        <>
            <Grid container spacing={6}>
                <Grid item xs={3}>
                    <Grid container direction="column" spacing={2}>
                        <Grid item position='fixed'>
                            <ProfileCard user={user}/>
                        </Grid>
                        <Grid item position='fixed' sx={{bottom: 20,}}>
                            {user && <QuestionModal user={user}/>}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <Grid container direction="column" spacing={3}>
                        {
                            loading &&
                            <Grid container justifyContent="center">
                                <Grid item>
                                    <CircularProgress />
                                </Grid>
                            </Grid>
                        }
                        {questions.map((question) => (
                            <Grid key={question.id}  item>
                                <QuestionCard key={question.id} question={question}/>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
                <Grid item xs={3}>
                    <Grid container direction="column">
                        <Grid item position='fixed' sx={{
                            marginRight: 2,
                        }}>
                            <Leaderboard/>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}

export default Home;
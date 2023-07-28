import {Card, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select} from "@mui/material";
import ProfileCard from "../components/ProfileCard";
import QuestionCard from "../components/QuestionCard";
import Leaderboard from "../components/Leaderboard";
import QuestionModal from "../components/QuestionModal"
import {useContext, useEffect, useState} from "react";
import * as React from "react";
import {SearchQuestionContext} from "../context/SearchQuestionContext";
import CheckACTokenAndRFToken from "../utils/CheckACTokenAndRFToken";

function Home() {
    const [user] = React.useState(CheckACTokenAndRFToken());
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryList, setCategoryList] = useState([]);
    const [category, setCategory] = React.useState('');
    const [time, setTime] = React.useState('');
    const [rating, setRating] = React.useState('');
    const [like, setLike] = React.useState('');
    const [offset, setOffset] = useState(1);

    const {searchInput} = useContext(SearchQuestionContext);

    const handleChangeCategory = (event) => {
        setLoading(true);
        fetch('http://localhost:8001/api/questions/find-by-category-id?categoryID=' + event.target.value + '&offset=0', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(
            (res) => {
                res.json().then(
                    (r) => {
                        setQuestions(r.data);
                        setCategory(event.target.value);
                        setLike('');
                        setRating('');
                        setTime('');
                        setLoading(false);
                        setOffset(1);
                    }
                )
            }
        ).catch(() => {
        });
    };

    const handleChangeTime = (event) => {
        setLoading(true);
        fetch('http://localhost:8001/api/questions/order-by-time?time=' + event.target.value  + '&offset=0', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(
            (res) => {
                res.json().then(
                    (r) => {
                        setQuestions(r.data);
                        setTime(event.target.value);
                        setCategory('');
                        setLike('');
                        setRating('');
                        setLoading(false);
                        setOffset(1);
                    }
                )
            }
        ).catch(() => {
        });
    };

    const handleChangeRating = (event) => {
        setLoading(true);
        fetch('http://localhost:8001/api/questions/order-by-rating?rating=' + event.target.value  + '&offset=0', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(
            (res) => {
                res.json().then(
                    (r) => {
                        setQuestions(r.data);
                        setRating(event.target.value);
                        setCategory('');
                        setLike('');
                        setTime('');
                        setLoading(false);
                        setOffset(1);
                    }
                )
            }
        ).catch(() => {
        });
    };

    const handleChangeLike = (event) => {
        setLoading(true);
        fetch('http://localhost:8001/api/questions/order-by-like?like=' + event.target.value  + '&offset=0', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(
            (res) => {
                res.json().then(
                    (r) => {
                        setQuestions(r.data);
                        setLike(event.target.value);
                        setRating('');
                        setCategory('');
                        setTime('');
                        setLoading(false);
                        setOffset(1);
                    }
                )
            }
        ).catch(() => {
        });
    };

    const fetchMoreData = () => {
        setLoading(true);

        if (category !== '')
            fetch('http://localhost:8001/api/questions/find-by-category-id?categoryID=' + category + '&offset=' + offset, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(
                (res) => {
                    res.json().then(
                        (r) => {
                            setQuestions(prevQuestions => [...prevQuestions, ...r.data]);
                        }
                    )
                }
            );
        else if (time !== '')
            fetch('http://localhost:8001/api/questions/order-by-time?time=' + time + '&offset=' + offset, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(
                (res) => {
                    res.json().then(
                        (r) => {
                            setQuestions(prevQuestions => [...prevQuestions, ...r.data]);
                        }
                    )
                }
            );
        else if (rating !== '')
            fetch('http://localhost:8001/api/questions/order-by-rating?rating=' + rating + '&offset=' + offset, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(
                (res) => {
                    res.json().then(
                        (r) => {
                            setQuestions(prevQuestions => [...prevQuestions, ...r.data]);
                        }
                    )
                }
            );
        else if (like !== '')
            fetch('http://localhost:8001/api/questions/order-by-like?like=' + like + '&offset=' + offset, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(
                (res) => {
                    res.json().then(
                        (r) => {
                            setQuestions(prevQuestions => [...prevQuestions, ...r.data]);
                        }
                    )
                }
            );
        else
            fetch('http://localhost:8001/api/questions?search=' + searchInput + '&offset=' + offset, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(
                (res) => {
                    res.json().then(
                        (r) => {
                            setQuestions(prevQuestions => [...prevQuestions, ...r.data]);
                        }
                    )
                }
            );
        setOffset(offset + 1);
        setLoading(false);
    };

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) {
            return;
        }
        fetchMoreData();
    };

    useEffect(() => {
        setLoading(true);
        fetch('http://localhost:8001/api/questions?search=' + searchInput + '&offset=0', {
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
                        setLike('');
                        setRating('');
                        setCategory('');
                        setTime('');
                        setOffset(1);
                    }
                )
            }
        ).catch(() => {
        })
    }, [searchInput]);

    useEffect(() => {
        fetch("http://localhost:8003/api/categories/available", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(
            (res) => {
                res.json().then(
                    (r) => {
                        setCategoryList(r.data);
                    }
                )
            }
        ).catch(() => {
        });
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    });

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
                    <Card sx={{mb: 2}}>
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <FormControl fullWidth sx={{backgroundColor: '#151515'}}>
                                    <InputLabel id="category-label">Category</InputLabel>
                                    <Select
                                        labelId="category-label"
                                        value={category}
                                        label="Category"
                                        onChange={handleChangeCategory}
                                    >
                                        {categoryList.map((item) => (
                                            <MenuItem key={item.id} value={item.id}>
                                                @{item.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={3}>
                                <FormControl fullWidth sx={{backgroundColor: '#151515'}}>
                                    <InputLabel id="time-label">Time</InputLabel>
                                    <Select
                                        labelId="time-label"
                                        value={time}
                                        label="Time"
                                        onChange={handleChangeTime}
                                    >
                                        <MenuItem value="DEST"> Newest </MenuItem>
                                        <MenuItem value="ASC"> Oldest </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={3}>
                                <FormControl fullWidth sx={{backgroundColor: '#151515'}}>
                                    <InputLabel id="rating-label">Rating</InputLabel>
                                    <Select
                                        labelId="rating-label"
                                        value={rating}
                                        label="Rating"
                                        onChange={handleChangeRating}
                                    >
                                        <MenuItem value="DEST">Highest</MenuItem>
                                        <MenuItem value="ASC">Lowest</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={3}>
                                <FormControl fullWidth sx={{backgroundColor: '#151515'}}>
                                    <InputLabel id="like-label">Like</InputLabel>
                                    <Select
                                        labelId="like-label"
                                        value={like}
                                        label="Like"
                                        onChange={handleChangeLike}
                                    >
                                        <MenuItem value="DEST">Highest</MenuItem>
                                        <MenuItem value="ASC">Lowest</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Card>
                    <Grid container direction="column" spacing={3}>
                        {questions.map((question) => (
                            <Grid key={question.id} item>
                                <QuestionCard key={question.id} question={question}/>
                            </Grid>
                        ))}
                        {
                            loading &&
                            <Grid container justifyContent="center">
                                <Grid item>
                                    <CircularProgress/>
                                </Grid>
                            </Grid>
                        }
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
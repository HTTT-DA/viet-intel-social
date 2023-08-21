import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import AddIcon from "@mui/icons-material/Add";
import {
    Avatar,
    Fab,
    FormControl, Input,
    InputLabel,
    ListItem,
    ListItemAvatar,
    MenuItem,
    Select
} from "@mui/material";
import Button from "@mui/material/Button";
import {useEffect} from "react";
import Grid from "@mui/material/Grid";
import {useNavigate} from "react-router-dom";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: '#151515',
    boxShadow: 24,
    paddingTop: 1,
    paddingBottom: 3,
    paddingLeft: 3,
    paddingRight: 3,
    borderRadius: 2
};

export default function QuestionModal(props) {
    const [open, setOpen] = React.useState(false);
    const [tag, setTag] = React.useState('');
    const [category, setCategory] = React.useState('');
    const [categoryList, setCategoryList] = React.useState([]);
    const [tagList, setTagList] = React.useState([]);
    const [tagChosen, setTagChosen] = React.useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:8003/api/categories/available", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(
            (res) => {
                res.json().then(
                    (r) => {
                        setCategoryList(r.data);
                    }
                )
            }
        )

        fetch("http://localhost:8001/api/tags", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(
            (res) => {
                res.json().then(
                    (r) => {
                        setTagList(r.data);
                    }
                )
            }
        )
    }, [])

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleChangeCategory = (event) => {
        setCategory(event.target.value);
    };
    const handleChangeTag = (event) => {
        setTag(event.target.value);
    };
    const handleAddTag = (event) => {
        if (event.target.value === "") return;

        const checkTag = tagChosen.find((item) => item.name === event.target.value);
        if (checkTag !== undefined) return;

        setTagChosen([...tagChosen, {
            id: tagList.find((item) => item.name === event.target.value).id,
            name: event.target.value
        }])
    }
    const handleRemoveTag = (event) => {
        let tagId = event.target.value;
        setTagChosen(tagChosen.filter((item) => item.id !== parseInt(tagId)))
    }
    const handleCreateQuestion = () => {
        fetch("http://localhost:8001/api/questions/create", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "content": document.getElementById("content").value,
                "category_id": category,
                "user_id": props.user.id,
                "tags": tagChosen.map((item) => item.id)
            })
        }).then(
            (res) => {
                res.json().then(
                    (r) => {
                        if(r.status===200){
                            fetch("http://127.0.0.1:8004/core/send-notification-email/", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                "content": document.getElementById("content").value
                            })
                        })
                        .then(response => response.json())
                            navigate('/')
                            alert("Create question successfully!");
                        }
                        else {
                            alert("Create question failed!");
                        }
                    }
                )
            }
        )
    }

    return (
        <>
            <Fab onClick={handleOpen} color="primary" aria-label="add" sx={{
                backgroundColor: '#151515',
                '&:hover': {backgroundColor: '#f50057',}
            }}
            >
                <AddIcon/>
            </Fab>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <ListItem sx={{p: 0, mt: 2}}>
                        <ListItemAvatar>
                            <Avatar alt="Remy Sharp" sx={{width: 50, height: 50}}
                                    src={props.user.avatar}/>
                        </ListItemAvatar>
                        <FormControl sx={{width: 300, ml: 2}}>
                            <InputLabel id="category-label">Category</InputLabel>
                            <Select
                                labelId="category-label"
                                id="category"
                                value={category}
                                label="category"
                                onChange={handleChangeCategory}
                            >
                                {categoryList.map((item) => (
                                    <MenuItem key={item.id} sx={{color: 'blue'}} value={item.id}>
                                        @{item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </ListItem>
                    <Input
                        id="content"
                        placeholder="What is your question?"
                        multiline
                        rows={4}
                        fullWidth
                        sx={{
                            mt: 2,
                            color: '#000000',
                            border: '0.1px solid #868686',
                        }}
                    >
                    </Input>
                    <Grid container spacing={2} sx={{mt: 0.5}}>
                        <Grid item xs={8}>
                            {tagChosen.map((item) => (
                                <Fab
                                    variant="extended"
                                    sx={{'&:hover': {backgroundColor: 'red'}}}
                                    color="action"
                                    aria-label="add"
                                    onClick={handleRemoveTag}
                                    key={item.id}
                                    value={item.id}
                                >
                                    {item.name}
                                </Fab>
                            ))}
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <InputLabel id="tag">Select Tag</InputLabel>
                                <Select
                                    labelId="tag"
                                    id="tag"
                                    label="Tag"
                                    value={tag}
                                    onBlur={handleAddTag}
                                    onChange={handleChangeTag}
                                >
                                    <MenuItem key="0" value=""> Select tag </MenuItem>
                                    {tagList.map((option) => (
                                        <MenuItem key={option.id} value={option.name}> {option.name} </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        onClick={handleCreateQuestion}
                        sx={{
                            mt: 2,
                            color: '#000000',
                            backgroundColor: '#ffffff',
                            fontWeight: 'bold', '&:hover': {backgroundColor: '#000000'}
                        }}
                    >
                        POST
                    </Button>
                </Box>
            </Modal>
        </>
    );
}
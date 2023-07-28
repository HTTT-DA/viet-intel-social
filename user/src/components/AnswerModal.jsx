import {
    CircularProgress,
    FormControl, IconButton,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import * as React from "react";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import Box from "@mui/material/Box";
import AnswerCard from "./AnswerCard";
import Grid from "@mui/material/Grid";
import Textarea from '@mui/joy/Textarea';
import TextField from "@mui/material/TextField";
import Stack from '@mui/material/Stack';
import Button from "@mui/material/Button";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import CheckACTokenAndRFToken from "../utils/CheckACTokenAndRFToken";
import UploadFileToCloudinary from "../utils/UploadFileToCloudinary";
import LoadingButton from '@mui/lab/LoadingButton';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    bgcolor: '#151515',
    boxShadow: 24,
    paddingTop: 1,
    paddingBottom: 3,
    paddingLeft: 3,
    paddingRight: 3,
    borderRadius: 2,
};

export default function AnswerModal(props) {
    const [user] = React.useState(CheckACTokenAndRFToken());
    const [open, setOpen] = React.useState(false);
    const [answers, setAnswers] = React.useState([]);
    const [content, setContent] = React.useState('');
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [referenceLink, setReferenceLink] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [postLoading, setPostLoading] = React.useState(false);


    const handleOpen = () => {
        fetch("http://localhost:8002/api/answers/get-by-question-id?questionID=" + props.id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((res) => res.json().then((r) => {
            if (r.status === 200) {
                setAnswers(r.data);
                setLoading(false);
            }
        }));
        setOpen(true);
    }
    const handleClose = () => setOpen(false);

    const handleFileChange = (event) => {
        if (!user) {
            alert('You need to login to upload image');
            return;
        }
        setSelectedFile(event.target.files[0])
    };

    const handlePost = async () => {
        setPostLoading(true);
        if (!user) {
            alert('You need to login to answer this question');
            setPostLoading(false);
            return;
        }

        if(content==='') {
            alert('You need to enter content');
            setPostLoading(false);
            return;
        }

        if (!selectedFile) {
            await fetch("http://localhost:8002/api/answers", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "content": content,
                    "question_id": props.id,
                    "reference": referenceLink,
                    "image": '',
                    'user_id': user.id
                })
            }).then((res) => res.json().then((r) => {
                if (r.status === 200) {
                    alert('Answered successfully, wait for admin to approve');
                } else {
                    alert(r.message);
                }
            }));
        } else {
            await UploadFileToCloudinary(selectedFile).then((res) => {
                fetch("http://localhost:8002/api/answers", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "content": content,
                        "question_id": props.id,
                        "reference": referenceLink,
                        "image": res.url,
                        'user_id': user.id
                    })
                }).then((res) => res.json().then((r) => {
                    if (r.status === 200) {
                        alert('Answered successfully, wait for admin to approve');
                    } else {
                        alert(r.message);
                    }
                }));
            })
        }

        setPostLoading(false);
    }

    return (
        <>
            <IconButton onClick={handleOpen} aria-label="answer">
                <ChatBubbleOutlineIcon sx={{fontSize: '26px'}}/>
            </IconButton>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Grid sx={{
                        maxHeight: '65vh',
                        overflow: 'auto',
                        paddingRight: 2,
                        paddingLeft: 2,
                        paddingTop: 2,
                        paddingBottom: 2
                    }}>
                        {answers.length === 0 &&
                            <Grid container justifyContent="center">
                                <Grid item>
                                    <h3 style={{color: '#fff'}}>No answer yet</h3>
                                </Grid>
                            </Grid>
                        }
                        {answers && answers.map((answer) => (
                            <AnswerCard
                                key={answer.id}
                                answer={answer}
                            ></AnswerCard>
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

                    <FormControl>
                        <Textarea
                            placeholder="Type in here…"
                            onChange={(e) => setContent(e.target.value)}
                            label="Content"
                            minRows={2}
                            maxRows={4}
                            sx={{
                                minWidth: 850,
                                mt: 2,
                                mb: 2,
                                ml: 2,
                                mr: 2,
                                borderRadius: 4,
                                backgroundColor: '#2a2a2a',
                                color: '#fff',
                                '&:hover': {
                                    backgroundColor: '#2a2a2a',
                                },
                            }}
                        />

                        <Stack spacing={5} direction="row" sx={{
                            mt: 1,
                            ml: 2,
                        }}>
                            <Box>
                                <TextField
                                    placeholder="reference link"
                                    sx={{
                                        minWidth: 500,
                                        maxWidth: 500,
                                        borderRadius: 4,
                                        backgroundColor: '#2a2a2a',
                                        color: '#fff',
                                        '&:hover': {
                                            backgroundColor: '#2a2a2a',
                                        }
                                    }}
                                    onChange={(e) => setReferenceLink(e.target.value)}
                                />
                            </Box>
                            <Box>
                                <input
                                    accept="image/*" // You can specify the accepted file types here
                                    type="file"
                                    style={{display: 'none'}}
                                    id="file-input"
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="file-input">
                                    <Button variant="contained" component="span" sx={{mt: 1}}
                                            startIcon={<CloudUploadIcon/>}>
                                        Upload Image
                                    </Button>
                                </label>
                            </Box>
                            <Box>
                                {!postLoading ?
                                    <Button type="submit" variant="contained" color="primary" sx={{mt: 1}}
                                            onClick={handlePost} startIcon={<SendIcon/>}>
                                        Post
                                    </Button>
                                    :
                                    <LoadingButton
                                        loading
                                        loadingPosition="start"
                                        startIcon={<SendIcon/>}
                                        variant="outlined"
                                        disabled
                                        sx={{mt: 1}}
                                    >
                                        Save
                                    </LoadingButton>
                                }
                            </Box>
                        </Stack>
                    </FormControl>
                </Box>
            </Modal>
        </>
    );
}
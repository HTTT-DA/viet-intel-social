import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import AddIcon from "@mui/icons-material/Add";
import {
    Avatar,
    Fab,
    FormControl,
    InputLabel,
    ListItem,
    ListItemAvatar,
    MenuItem,
    Select
} from "@mui/material";
import Button from "@mui/material/Button";

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

export default function QuestionModal() {
    const [open, setOpen] = React.useState(false);
    const [category, setCategory] = React.useState('');
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleChangeCategory = (event) => {
        setCategory(event.target.value);
    };

    return (
        <div>
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
                                    src="https://i.pinimg.com/236x/09/d4/b1/09d4b1d247d89d7ce3cd159f6b20ecd8.jpg"/>
                        </ListItemAvatar>
                        <FormControl sx={{width: 300, ml: 2}}>
                            <InputLabel id="category-label">Category</InputLabel>
                            <Select
                                labelId="category-label"
                                id="category-id"
                                value={category}
                                label="category"
                                onChange={handleChangeCategory}
                            >
                                <MenuItem sx={{color:'blue'}} value={1}>@ProgrammingQuestion</MenuItem>
                                <MenuItem sx={{color:'blue'}} value={2}>@CookingQuestion</MenuItem>
                                <MenuItem sx={{color:'blue'}} value={3}>@BookQuestion</MenuItem>
                            </Select>
                        </FormControl>
                    </ListItem>
                    <Typography id="modal-modal-description" sx={{mt: 2}}>
                        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                    </Typography>
                    <Typography id="modal-modal-tag" sx={{mt: 2, color: '#000000', mb: 2}}>
                        @OOP &nbsp; @Java &nbsp; @C++ &nbsp;
                        <Fab variant="extended" color="white" aria-label="add">
                            TAG
                            <AddIcon sx={{mr: 1, ml: 1}}/>
                        </Fab>
                    </Typography>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
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
        </div>
    );
}
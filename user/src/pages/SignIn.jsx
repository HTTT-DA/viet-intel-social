import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {useNavigate} from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const defaultTheme = createTheme();

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Vietnam Intellectually Social Network
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default function SignIn() {
    const [verify, setVerify] = React.useState(false);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email');
        const password = data.get('password');

        fetch('http://localhost:8000/auth/sign-in', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "email": email,
                "password": password
            })
        }).then(
            (res) => {
                res.json().then(
                    (r) => {
                        switch (r.status){
                            case 200:
                                localStorage.setItem('refresh_token', r.data.refresh_token);
                                localStorage.setItem('access_token', r.data.access_token);
                                navigate('/');
                                break;
                            default:
                                alert(r.message);
                                break;
                        }
                    }
                )
            }
        )
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{m: 1, backgroundColor: '#ffffff'}}>
                        <LockOutlinedIcon sx={{color: '#000000', fontSize: 32}}/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        {!verify ?
                            (<ReCAPTCHA
                                sitekey="6LeFtDcnAAAAAGvENlR6WLFh0t92i2uGTZV_dLG6"
                                onChange={() => {setVerify(true)}}
                            />)
                            : <></>
                        }
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={!verify}
                            sx={{
                                mt: 3, mb: 2,
                                color: '#ffffff',
                                backgroundColor: '#000000',
                                fontWeight: 'bold', '&:hover': {backgroundColor: '#ffffff'}
                            }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link onClick={()=>{navigate('/')}} variant="body2">
                                    Back to Home
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link onClick={()=>{navigate('/sign-up')}} variant="body2">
                                    Don't have an account? Sign Up
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{mt: 5}}/>
            </Container>
        </ThemeProvider>
    );
}
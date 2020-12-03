import React, { useContext, useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { socket } from '../socket/Socket'
import HighScores from './HighScores';



function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            Draw & Guess - By Ron Gabbay
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));
export default function SignIn() {

    const history = useHistory();
    const classes = useStyles();
    const { setFullName, setNickName, role } = useContext(UserContext);
    const [nick, setNick] = useState('');
    const [name, setName] = useState('');
    const handleClick = () => {
        setNickName(nick);
        setFullName(name);
        socket.emit('signed');
        if (role === "draw") { history.push('/mode'); }
        else { history.push('/main'); }
    }


    return (<div className="landingPage">
        <div className={classes.heroContent}>
            <Container maxWidth="sm" style={{ marginTop: "15px", textAlign: "center" }}>
                <Typography component="h1" variant="h3" align="center" color="textPrimary" gutterBottom>
                    Draw & Guess
          </Typography>
                <Typography variant="h6" align="center" color="textSecondary" paragraph>
                    Welcome! <br />
                    Current Top 3 Scores :
                </Typography>
                <HighScores />
            </Container>
        </div>
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="fullname"
                    label="Full Name"
                    name="fullName"
                    placeholder="Full Name"
                    autoComplete="fullname"
                    onChange={e => setName(e.target.value)}
                    value={name}
                    autoFocus
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AccountCircle />
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    name="nickname"
                    label="Nick Name"
                    placeholder="Nick Name"
                    id="nickname"
                    onChange={e => setNick(e.target.value)}
                    value={nick}
                    autoComplete="nickname"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AccountCircle />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={nick && name ? false : true}
                    className={classes.submit}
                    onClick={e => handleClick(e)}
                >
                    Lets Play !
          </Button>

            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    </div>
    );
}
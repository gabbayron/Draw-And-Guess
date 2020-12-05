import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { UserContext } from '../context/UserContext';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

export default function Header({ gameStatus }) {

    const classes = useStyles();
    const { nickName } = useContext(UserContext)
    return (
        <div className={classes.root + "header"}>
            <AppBar color="secondary" position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Draw & Guess
                    </Typography>
                    <Typography variant="h6" className={classes.title}>
                        {gameStatus ? `Hello ${nickName}` : ""}
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    );
};
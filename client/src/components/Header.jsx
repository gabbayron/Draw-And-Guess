import React, { useContext, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { UserContext } from '../context/UserContext';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import Button from '@material-ui/core/Button';



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

const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles((theme) => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
            },
        },
    },
}))(MenuItem);

export default function Header({ gameStatus }) {

    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    const classes = useStyles();
    const { nickName } = useContext(UserContext)
    return (
        <div className={classes.root + "header"}>
            <AppBar color="secondary" position="static">
                <Toolbar>{gameStatus ? <>
                    <Button
                        aria-controls="customized-menu"
                        aria-haspopup="true"
                        variant="contained"
                        disableElevation
                        color="secondary"
                        onClick={handleClick}
                        size="large"
                        style={{ marginTop: "3px" }}
                    >
                        Menu
                     </Button>
                    <StyledMenu
                        id="customized-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >

                        <StyledMenuItem>
                            <ListItemIcon>
                                <DraftsIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Log Out" />
                        </StyledMenuItem>
                        <StyledMenuItem>
                            <ListItemIcon>
                                <InboxIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="New Game" />
                        </StyledMenuItem>
                    </StyledMenu> </> : ""}
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
}
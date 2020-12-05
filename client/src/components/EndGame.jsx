import React from 'react';
import Typography from '@material-ui/core/Typography';
import BrushIcon from '@material-ui/icons/Brush';

const EndGame = () => {
    return (
        <div className="endContent">
            <BrushIcon fontSize="large" />
            <Typography
                variant="h4"
                align="center"
                color="textPrimary">
                Thank You For Playing!
            </Typography>
            <BrushIcon fontSize="large" />
            <Typography
                variant="h5"
                align="center"
                color="textSecondary"
                paragraph>
                Hope you had fun :) <br />
                See you soon!
            </Typography>
            <Typography
                variant="h6"
                align="center"
                color="textPrimary">
                For a new game - refresh your browser
            </Typography>
        </div>
    );
};

export default EndGame;

import React, { useEffect, useRef, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ChildFriendlyIcon from '@material-ui/icons/ChildFriendly';
import WarningIcon from '@material-ui/icons/Warning';
import SentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined';
import { useHistory } from 'react-router-dom';
import { socket } from '../socket/Socket'

const ModePick = ({ setModePicked, setWords }) => {
    const [mode, setMode] = useState('')
    const isFirstRender = useRef(true)
    const history = useHistory()

    useEffect(() => {
        if (isFirstRender.current) { return isFirstRender.current = false }
        (async () => {
            try {
                let res = await fetch('http://localhost:4000/words/' + mode)
                let data = await res.json()
                socket.emit('mode picked')
                setModePicked(true)
                setWords(data)
                history.push('/main')
            } catch (error) { throw error }
        })()
    }, [mode])

    return (
        <div className="content">
            <Typography
                variant="h4"
                align="center"
                color="textPrimary">
                Pick Your Game Level :</Typography>

            <Typography
                variant="h5"
                align="center"
                color="textSecondary"
                paragraph>
                EZ Mode Win - 1 Point <br />
              Normal Mode Win - 3 Points <br />
              Hard Mode Win - 5 Points
            </Typography>
            <div className="levelButtons">

                <Button
                    style={{ marginTop: "10px" }}
                    className="easy"
                    size="large"
                    startIcon={<ChildFriendlyIcon />}
                    variant="contained"
                    color="primary"
                    onClick={e => { setMode('easy') }}
                >
                    Easy
                </Button>
                <Button
                    style={{ marginTop: "10px" }}
                    size="large"
                    variant="contained"
                    startIcon={<SentimentSatisfiedOutlinedIcon />}
                    color="primary"
                    onClick={e => { setMode('normal') }}
                >
                    Normal
             </Button>
                <Button
                    style={{ marginTop: "10px" }}
                    className="hard"
                    size="large"
                    startIcon={<WarningIcon />}
                    variant="contained"
                    color="primary"
                    onClick={e => { setMode('hard') }}
                >
                    Hard
             </Button>
            </div>
        </div>
    );
}

export default ModePick;

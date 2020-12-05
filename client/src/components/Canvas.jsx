import { Button } from '@material-ui/core';
import React, { useRef, useEffect, useState, useContext } from 'react';
import { TwitterPicker } from 'react-color'
import DeleteIcon from '@material-ui/icons/Delete';
import { useWindowSize } from '@react-hook/window-size';
import { UserContext } from '../context/UserContext';
import { socket } from '../socket/Socket'
import { useHistory } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import BackupIcon from '@material-ui/icons/Backup';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import Tooltip from '@material-ui/core/Tooltip';
import { URL_ENDPOINT } from '../URL.ENDPOINT'

const Canvas = ({ changeWord, setChangeWord, score, user2 }) => {

    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('black');
    const [open, setOpen] = useState(false);
    const [winWidth, winHeight] = useWindowSize();
    const { role, nickName } = useContext(UserContext);
    const history = useHistory();
    const canvasHeightRatio = 0.6
    const canvasWidthRatio = 0.9

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.height = winHeight * canvasHeightRatio;
        canvas.width = winWidth * canvasWidthRatio;
        const context = canvas.getContext("2d");
        context.scale(1, 1);
        context.lineCap = "round";
        context.lineWidth = 3;
        contextRef.current = context;
    }, [winWidth, winHeight]);

    useEffect(() => {
        socket.on('start draw', ({ x, y }) => {
            if (!contextRef.current) return;
            contextRef.current.beginPath();
            contextRef.current.moveTo(x, y);
        })
        socket.on('draw', (data) => {
            if (!contextRef.current) return;
            contextRef.current.lineTo(data.x, data.y);
            contextRef.current.strokeStyle = data.color.hex;
            contextRef.current.stroke();
        })
        socket.on('finish draw', () => {
            if (!contextRef.current) return;
            contextRef.current.closePath();
        })
        socket.on('clear', () => {
            if (!contextRef.current) return;
            contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        })
        socket.on('right answer', () => {
            if (!contextRef.current) return;
            console.log('right')
            contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        })
        socket.on('mode picked', () => {
            if (!contextRef.current) return;
            contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        })
    }, []);

    const startDrawing = (e) => {
        if (role === "guess") return;
        const rect = canvasRef.current.getBoundingClientRect();
        const touch = e.touches[0];
        contextRef.current.beginPath();
        contextRef.current.moveTo(touch.clientX - rect.x, touch.clientY - rect.y);
        setIsDrawing(true);
        socket.emit('start draw', ({ x: touch.clientX - rect.x, y: touch.clientY - rect.y }));
    };

    const draw = (e) => {
        if (!isDrawing) return;
        if (role === "guess") return;
        const touch = e.touches[0];
        const rect = canvasRef.current.getBoundingClientRect();
        contextRef.current.strokeStyle = color.hex;
        contextRef.current.lineTo(touch.clientX - rect.x, touch.clientY - rect.y);
        contextRef.current.stroke();
        socket.emit('draw', ({ x: touch.clientX - rect.x, y: touch.clientY - rect.y, color }));
    };

    const finishDrawing = () => {
        if (role === "guess") return;
        contextRef.current.closePath();
        setIsDrawing(false);
        socket.emit('finish draw');
    };

    const clear = () => {
        contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        socket.emit('clear');
    };

    const handleTooltipOpen = () => {
        setOpen(true);
        setTimeout(() => { setOpen(false) }, 1500);
    };

    const submitScore = async () => {
        if (score === 0) return;
        handleTooltipOpen()
        await fetch(`${URL_ENDPOINT}/scores`, {
            method: 'POST',
            body: JSON.stringify({ user1: nickName, user2, score }),
            headers: { "content-type": "application/json" }
        })
    };

    return (
        <>
            <div className="canvas" style={{ marginBottom: "20px" }}>
                <canvas id="canvas"
                    onTouchStart={startDrawing}
                    onTouchEnd={finishDrawing}
                    onTouchMove={draw}
                    ref={canvasRef}
                />
            </div>
            {role === "draw" ? <> <TwitterPicker color={color} onChange={setColor} />
                <div className="gameButtons">
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<AddIcon />}
                        style={{ marginTop: "20px" }}
                        onClick={() => setChangeWord(!changeWord)}
                    >
                        Generate New Word
                    </Button>

                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<DeleteIcon />}
                        style={{ marginTop: "20px" }}
                        onClick={clear}
                    >
                        Clear Canvas
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<SportsEsportsIcon />}
                        style={{ marginTop: "20px" }}
                        onClick={() => history.push('/mode')}
                    >
                        New Game
                    </Button>
                    <Tooltip
                        PopperProps={{
                            disablePortal: true,
                        }}
                        open={open}
                        onClose={() => setOpen(false)}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        title="Score Submited"
                    >
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<BackupIcon />}
                            style={{ marginTop: "20px" }}
                            onClick={submitScore}
                        >
                            Submit Your Score
                    </Button>
                    </Tooltip>
                </div> </>
                : ""}
        </>
    );
}

export default Canvas;

<Button
    variant="contained"
    color="secondary"
    startIcon={<BackupIcon />}
    style={{ marginTop: "20px" }}
>
    Submit Your Score
</Button>
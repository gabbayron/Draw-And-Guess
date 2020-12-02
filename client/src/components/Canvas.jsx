import { Button } from '@material-ui/core';
import React, { useRef, useEffect, useState, useContext } from 'react';
import { TwitterPicker, HuePicker } from 'react-color'
import DeleteIcon from '@material-ui/icons/Delete';
import { useWindowSize } from '@react-hook/window-size';
import { UserContext } from '../context/UserContext';
import { socket } from '../socket/Socket'
import { useHistory } from 'react-router-dom';

function Canvas({ changeWord, setChangeWord }) {

    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('black');
    const [winWidth, winHeight] = useWindowSize();
    const { role } = useContext(UserContext);
    const history = useHistory();

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.height = winHeight * 0.4;
        canvas.width = winWidth * 0.9;
        const context = canvas.getContext("2d");
        context.scale(1, 1);
        context.lineCap = "round";
        context.lineWidth = 3;
        contextRef.current = context;
    }, [winWidth, winHeight])

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
            contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        })
    }, [])

    const startDrawing = (e) => {
        if (role === "guess") return;
        const rect = canvasRef.current.getBoundingClientRect();
        const touch = e.touches[0];
        contextRef.current.beginPath();
        contextRef.current.moveTo(touch.clientX - rect.x, touch.clientY - rect.y);
        setIsDrawing(true);
        socket.emit('start draw', ({ x: touch.clientX - rect.x, y: touch.clientY - rect.y }));
    }

    const draw = (e) => {
        if (!isDrawing) return;
        if (role === "guess") return;
        const touch = e.touches[0];
        const rect = canvasRef.current.getBoundingClientRect();
        contextRef.current.strokeStyle = color.hex;
        contextRef.current.lineTo(touch.clientX - rect.x, touch.clientY - rect.y);
        contextRef.current.stroke();
        socket.emit('draw', ({ x: touch.clientX - rect.x, y: touch.clientY - rect.y, color }));
    }

    const finishDrawing = () => {
        if (role === "guess") return;
        contextRef.current.closePath();
        setIsDrawing(false);
        socket.emit('finish draw');
    }
    const clear = () => {
        contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        socket.emit('clear');
    }


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
                        style={{ marginTop: "20px" }}
                        onClick={() => history.push('/mode')}
                    >
                        Change Mode
                    </Button>
                </div> </>
                : ""}
        </>
    );
}

export default Canvas;
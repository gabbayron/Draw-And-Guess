import React, { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../context/UserContext';
import Canvas from './Canvas';
import Typography from '@material-ui/core/Typography';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import { socket } from '../socket/Socket'

const Main = ({ gameStatus, modePicked, words }) => {
    const { role } = useContext(UserContext)
    const [word, setWord] = useState('')
    const [changeWord, setChangeWord] = useState(false)
    const [guess, setGuess] = useState('')
    const [score, setScore] = useState(0)
    const inputRef = useRef(null)

    useEffect(() => {
        // Generate random word
        socket.on('right answer', console.log('right'))

        if (role === "draw") {
            (() => {
                const index = Math.floor(Math.random() * words.length)
                setWord(words[index].word)
            })()
        }
    }, [changeWord])

const handleSubmit = () => {
    socket.emit('check answer', guess.toLocaleLowerCase())
}


socket.on('check answer', guess => {
    if (guess === word.toLocaleLowerCase()) {
        console.log('this is right')
        setChangeWord(!changeWord)
        socket.emit('right answer')
    }
})

return (
    <div className="content">
        {gameStatus && modePicked ? <>
            {role === "draw" ? <h2>Draw - {word}</h2> : ""}
            <h3>Score : {score}</h3>
            <Canvas changeWord={changeWord} setChangeWord={setChangeWord} socket={socket} /> </> :
            <><AccessTimeIcon fontSize="large" />
                <Typography paragraph align="center" variant="h2" >
                    Waiting For 2nd Player...
                 </Typography><AccessTimeIcon fontSize="large" /> </>}
        {role === "guess" && gameStatus && modePicked ? <>
            <TextField onChange={e => setGuess(e.target.value)} inputRef={inputRef} id="standard-basic" label="Place Your Guess Here !" />
            <Button
                onClick={handleSubmit}
                variant="contained"
                color="secondary"
                style={{ marginTop: "20px" }}
            >
                Submit Your Answer
                 </Button>
        </> : ""}

    </div>
);
}

export default Main;

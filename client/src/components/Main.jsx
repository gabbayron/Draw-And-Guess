import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import Canvas from './Canvas';
import Typography from '@material-ui/core/Typography';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import { socket } from '../socket/Socket'

const Main = ({ gameStatus, modePicked, words, score, setScore }) => {
    const { role } = useContext(UserContext);
    const [word, setWord] = useState('');
    const [changeWord, setChangeWord] = useState(false);
    const [guess, setGuess] = useState('');
    const [difficulty, setDifficulty] = useState('')
    useEffect(() => {
        // Generate random word
        if (role === "draw") {
            const index = Math.floor(Math.random() * words.length);
            setWord(words[index].word);
            setDifficulty(words[index].mode)
        }
    }, [changeWord])
    useEffect(() => {
        // if (word === "") return;
        socket.on('check answer', guess => {
            if (guess === word.toLocaleLowerCase()) {
                setChangeWord(prevState => !prevState);
                if (difficulty === "easy") {
                    setScore(score + 1)
                    socket.emit('right answer', score + 1);
                }
                else if (difficulty === "normal") {
                    socket.emit('right answer', score + 3);
                    setScore(score + 3)
                }
                else if (difficulty === "hard") {
                    socket.emit('right answer', score + 5);
                    setScore(score + 5)
                }
            }
        })
        // Clear event listeners
        return () => {
            socket.off('check answer')
        }
    }, [word])

    useEffect(() => {
        socket.on('right answer', (score) => {
            setGuess('')
            setScore(score)
        })
        return () => socket.off('right answer')
    }, [])

    const handleSubmit = () => { socket.emit('check answer', guess) }

    return (
        <div className="content">
            {gameStatus && modePicked ? <>
                {role === "draw" ? <h2>Draw - {word}</h2> : ""}
                <h3>Score : {score}</h3>
                <Canvas changeWord={changeWord} setChangeWord={setChangeWord} /> </> :
                <><AccessTimeIcon fontSize="large" />
                    <Typography paragraph align="center" variant="h2" >
                        Waiting For 2nd Player...
                 </Typography><AccessTimeIcon fontSize="large" /> </>}
            {role === "guess" && gameStatus && modePicked ? <>
                <TextField
                    onChange={e => setGuess(e.target.value)}
                    value={guess}
                    id="standard-basic"
                    label="Place Your Guess Here !" />
                <Button
                    onClick={() => handleSubmit()}
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

import './App.css';
import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import pink from "@material-ui/core/colors/pink";
import Header from './components/Header';
import { useEffect, useState } from 'react';
import {
  BrowserRouter as Router, Redirect, Route,
} from "react-router-dom";
import SignIn from './components/SignIn';
import Main from './components/Main';
import { UserContext } from './context/UserContext'
import ModePick from './components/ModePick';
import { socket } from './socket/Socket'
import EndGame from './components/EndGame';

function App() {

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: blue[500],
      },
      secondary: {
        main: pink[500],
      },
    },
  });

  useEffect(() => {
    socket.on('connection', data => { setRole(data.role) })
    socket.on('game full', () => {
      setGameStatus(true);
    })
    socket.on('mode picked', () => {
      setModePicked(true);
    })
  }, [])

  const [fullName, setFullName] = useState('');
  const [nickName, setNickName] = useState('');
  const [role, setRole] = useState('');
  const [gameStatus, setGameStatus] = useState(false);
  const [modePicked, setModePicked] = useState(false);
  const [words, setWords] = useState([]);

  return (
    <Router>
      <UserContext.Provider value={{ fullName, nickName, setFullName, setNickName, role }}>
        <ThemeProvider theme={theme}>
          <Header gameStatus={gameStatus} />
          <Redirect to="/sign" />
          <Route exact path="/" ><Redirect to="/sign" /></Route>
          <Route path='/sign' component={() => <SignIn />} />
          <Route path='/mode' component={() => <ModePick setWords={setWords} setModePicked={setModePicked} />} />
          <Route path='/main' component={() => <Main modePicked={modePicked} gameStatus={gameStatus} words={words} />} />
          <Route path='/end' component={EndGame} />
        </ThemeProvider>
      </UserContext.Provider>
    </Router>
  );
}

export default App;

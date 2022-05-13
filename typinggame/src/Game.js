import { useEffect, useState } from 'react';
import { findDOMNode } from 'react-dom';
import './style.css';
import useInterval from './useInterval';
import words from './words.txt';
const Game = () => {
    const [time, setTime] = useState(0);
    const [delay, setDelay] = useState(null);
    const [points, setPoints] = useState(0);
    const [wordsArr, setWordsArr] = useState([]);
    const [started, setStarted] = useState(false)
    const [word, setWord] = useState('Press Start');
    const [letters, setLetters] = useState([]);

    console.log(letters);

    useEffect(() => {
        ( async () => {
            fetch(words)
            .then(t => t.text()).then(text => {
                setWordsArr(text.split('\n'));
            })
        })();
    }, []);

    useEffect(()=>{
        findDOMNode(document.querySelector('.container')).focus();
        setLetters(Array.from(word));
    }, [word])

    useEffect(()=> {
        if (letters.length === 1){
            const randomWord = getRandomWord();
            setWord(randomWord);
            setPoints(oldPoints => oldPoints + 1);
        }else{
            const letter = document.querySelector(`#letter0`);
            if (letter && letter.className === "neon-text-red word"){
                letter.className = "neon-text-green word";
            }
        }
    }, [letters])

    useInterval(() => tick(), delay);

    const startGame = () => {
        const randomWord = getRandomWord();
        setStarted(true);
        setDelay(1000);
        setPoints(0);
        setTime(60);
        setWord(randomWord);
    };

    const endGame = () => {
        setStarted(false);
        setDelay(null);
        setWord('Time Out!!')
    };

    const handleKeyDown = (e) => {
        if (started){
            if (letters.length > 1){
                if (e.key == letters[0]){
                    setLetters(oldLetters => oldLetters.slice(1));
                }else{
                    document.querySelector(`#letter0`).className = "neon-text-red word";
                }
            }
        }
        
    };

    const tick = () => {
        if (time > 0){
            setTime(oldTime => oldTime - 1);
        }else {
            endGame();
        }
    };

    const getRandomWord = () => wordsArr[Math.floor(Math.random() * (wordsArr.length - 1))];
   

    const renderWord = () => {
        if (!started){
            return <span className="neon-text-green word">{word}</span>;
        }else{
            return letters.map((letter, index)=>{
                return <span key={index} id={`letter${index}`} className="neon-text-green word">{letter}</span>;
            })
        }
    };
    const renderTimeout = () => {
        return <span className="neon-text-green word">{word}</span>;
    };

    return (
        <div className="container neon" tabIndex="0" onKeyDown={handleKeyDown}>
            <div className="top">
                <div className="points">
                    <span className="neon-text-green">Points:</span>
                    <span className="neon-text-green">{points}</span>
                </div>
                <div className="time">
                    <span className="neon-text-green">Time:</span>
                    <span className="neon-text-green">{time}</span>
                </div>
            </div>
            <div className="word-display">
                {/* <span className="neon-text-green word">{word}</span> */}
                {started ? renderWord() : renderTimeout()}
            </div>
            <div className="bottom">
                <button onClick={startGame} disabled={started} className="neon neon-text-green button"> START </button>
            </div>
        </div>
    );
};

export default Game;
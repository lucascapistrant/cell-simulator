import { startGame, endGame, resetGame, redPopulation, bluePopulation } from "./script.js";

const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const pauseBtn = document.getElementById('pauseBtn');

startBtn.addEventListener('click', start);
pauseBtn.addEventListener('click', pause)
restartBtn.addEventListener('click', restart);

let gamePlaying = false;
let populationChecker = undefined;
function start() {
    if(gamePlaying !== true){
        startGame();
        gamePlaying = true;
    }
    populationChecker = setInterval(checkPopulations, 1000);
}

function pause() {
    gamePlaying = false;
    endGame();
    clearInterval(populationChecker);
}

function restart() {
    resetGame();
    start();
    gamePlaying = true;
}

function checkPopulations() {
    if(redPopulation === 0 && bluePopulation === 0) gamePlaying = false;
}
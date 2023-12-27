import { startGame, endGame, resetGame, redPopulation, bluePopulation, greenPopulation } from "./script.js";

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
        populationChecker = setInterval(checkPopulations, 1000);
    }
}

function pause() {
    gamePlaying = false;
    endGame();
    clearInterval(populationChecker);
}


const greenGraph = document.getElementById('greenGraph');
const blueGraph = document.getElementById('blueGraph');
const redGraph = document.getElementById('redGraph');

const greenCount = document.getElementById('greenPopulation');
const blueCount = document.getElementById('bluePopulation');
const redCount = document.getElementById('redPopulation');

function checkPopulations() {
    if(redPopulation === 0 && bluePopulation === 0) pause();
    
    // graphs
    const greenBar = document.createElement('div');
    greenGraph.appendChild(greenBar);
    greenBar.style.height = `${greenPopulation / 10}%`;
    greenBar.classList.add('graph-bar');
    
    const blueBar = document.createElement('div');
    blueGraph.appendChild(blueBar);
    blueBar.style.height = `${bluePopulation / 10}%`;
    blueBar.classList.add('graph-bar');
    
    const redBar = document.createElement('div');
    redGraph.appendChild(redBar);
    redBar.style.height = `${redPopulation / 10}%`;
    redBar.classList.add('graph-bar');

    greenCount.innerHTML = greenPopulation;
    blueCount.innerHTML = bluePopulation;
    redCount.innerHTML = redPopulation;
}

function restart() {
    resetGame();
    start();
    gamePlaying = true;
    clearGraphs();
}

function clearGraphs() {
    greenGraph.innerHTML = "";
    blueGraph.innerHTML = "";
    redGraph.innerHTML = "";
}

export { clearGraphs };
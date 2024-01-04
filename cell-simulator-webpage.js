import { startGame, endGame, resetGame, redPopulation, bluePopulation, greenPopulation } from "./cell-simulator-game.js";

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

let greenHighestPop = 0;
let blueHighestPop = 0;
let redHighestPop = 0;

function checkPopulations() {
    if(redPopulation === 0 && bluePopulation === 0) pause(); // ends game if there are no living orgs. left
    updatePopulationHighs(); //calculates the biggest the populations have been

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

    greenCount.innerHTML = greenPopulation; // shows current pop. size on graph
    blueCount.innerHTML = bluePopulation;
    redCount.innerHTML = redPopulation;
}

function updatePopulationHighs(reset) {
    if(greenPopulation > greenHighestPop) greenHighestPop = greenPopulation; // checks if pop. size is new highest
    if(bluePopulation > blueHighestPop) blueHighestPop = bluePopulation;
    if(redPopulation > redHighestPop) redHighestPop = redPopulation;
    console.log(greenHighestPop);

    if(reset) { //if specified in function calling, this logic will reset all pop. highs
        greenHighestPop = 0;
        blueHighestPop = 0;
        redHighestPop = 0;
    }
}

function restart() {
    resetGame();
    start();
    gamePlaying = true;
    clearGraphs();
    updatePopulationHighs('reset'); // resets population highs
}

function clearGraphs() {
    greenGraph.innerHTML = "";
    blueGraph.innerHTML = "";
    redGraph.innerHTML = "";
}

//instructions logic
const instructionsXBtn = document.getElementById('instructions__x-btn');
const instructionsBtn = document.getElementById('rules');
const instructions = document.getElementById('instructions');

instructionsBtn.addEventListener('click', () => {instructions.style.display = 'block'});

instructionsXBtn.addEventListener('click', () => {
    instructions.style.display = 'none';
})

export { clearGraphs };
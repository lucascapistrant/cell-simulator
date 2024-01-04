import { clearGraphs } from './cell-simulator-webpage.js';

const canvas = document.getElementById("simCanvas");
const ctx = canvas.getContext("2d");

let starterGreen = 100;
let starterBlue = 10;
let starterRed = 4;

let herbivoreVisionDiameter = 50;
let carnivoreVisionDiameter = 200;

let plantGrowthChance = 0.05;
let plantGrowthDistance = 200;

let herbivoreLifespan = 2000;
let carnivoreLifespan = 1500;

let herbivoreAttractSpeed = 1;
let herbivoreRepulseSpeed = .5;

let carnivoreAttractSpeed = 2;
let carnivoreRepulseSpeed = .2;

let herbivoreCellsToReproduce = 4;
let carnivoreCellsToReproduce = 4;


let greenCells;
let herbivoreCells;
let carnivoreCells;

// Controls
const startGreenSlider = document.getElementById('startGreen');
const startBlueSlider = document.getElementById('startBlue');
const startRedSlider = document.getElementById('startRed');

const herbVisDiameterSlider = document.getElementById('herbVisDiameter');
const carnVisDiameterSlider = document.getElementById('carnVisDiameter');

const plantGrowthDistanceSlider = document.getElementById('plantGrowthDistance');
const plantGrowthChanceSlider = document.getElementById('plantGrowthChance');

const herbivoreLifespanSlider = document.getElementById('herbivoreLifespan');
const carnivoreLifespanSlider = document.getElementById('carnivoreLifespan');

const herbivoreAttractSpeedSlider = document.getElementById('herbivoreAttractSpeed');
const carnivoreAttractSpeedSlider = document.getElementById('carnivoreAttractSpeed');
const herbivoreRepulseSpeedSlider = document.getElementById('herbivoreRepulseSpeed');
const carnivoreRepulseSpeedSlider = document.getElementById('carnivoreRepulseSpeed');

const herbivoreCellsToReproduceSlider = document.getElementById('herbivoreCellsToReproduce');
const carnivoreCellsToReproduceSlider = document.getElementById('carnivoreCellsToReproduce');

startGreenSlider.addEventListener('input',  () => {starterGreen = startGreenSlider.value; startGreenCounter.innerHTML = startGreenSlider.value; initializeCellPopulations()});
startBlueSlider.addEventListener('input',  () => {starterBlue = startBlueSlider.value; startBlueCounter.innerHTML = startBlueSlider.value; initializeCellPopulations()});
startRedSlider.addEventListener('input',  () => {starterRed = startRedSlider.value; startRedCounter.innerHTML = startRedSlider.value; initializeCellPopulations()});

herbVisDiameterSlider.addEventListener('input', () => {herbivoreVisionDiameter = herbVisDiameterSlider.value; herbVisDiameterCounter.innerHTML = herbVisDiameterSlider.value; initializeCellPopulations()})
carnVisDiameterSlider.addEventListener('input', () => {carnivoreVisionDiameter = carnVisDiameterSlider.value; carnVisDiameterCounter.innerHTML = carnVisDiameterSlider.value; initializeCellPopulations()})

plantGrowthDistanceSlider.addEventListener('input', () => {plantGrowthDistance = plantGrowthDistanceSlider.value; plantGrowthDistanceCounter.innerHTML = plantGrowthDistanceSlider.value; initializeCellPopulations(); console.log(plantGrowthDistance)})
plantGrowthChanceSlider.addEventListener('input', () => {plantGrowthChance = plantGrowthChanceSlider.value; plantGrowthChanceCounter.innerHTML = plantGrowthChanceSlider.value; initializeCellPopulations()})

herbivoreLifespanSlider.addEventListener('input', () => {herbivoreLifespan = herbivoreLifespanSlider.value; herbivoreLifespanCounter.innerHTML = herbivoreLifespanSlider.value; initializeCellPopulations()})
carnivoreLifespanSlider.addEventListener('input', () => {carnivoreLifespan = carnivoreLifespanSlider.value; carnivoreLifespanCounter.innerHTML = carnivoreLifespanSlider.value; initializeCellPopulations()})

herbivoreAttractSpeedSlider.addEventListener('input', () => {herbivoreAttractSpeed = herbivoreAttractSpeedSlider.value; herbivoreAttractSpeedCounter.innerHTML = herbivoreAttractSpeedSlider.value; initializeCellPopulations()})
carnivoreAttractSpeedSlider.addEventListener('input', () => {carnivoreAttractSpeed = carnivoreAttractSpeedSlider.value; carnivoreAttractSpeedCounter.innerHTML = carnivoreAttractSpeedSlider.value; initializeCellPopulations()})
herbivoreRepulseSpeedSlider.addEventListener('input', () => {herbivoreRepulseSpeed = herbivoreRepulseSpeedSlider.value; herbivoreRepulseSpeedCounter.innerHTML = herbivoreRepulseSpeedSlider.value; initializeCellPopulations()})
carnivoreRepulseSpeedSlider.addEventListener('input', () => {carnivoreRepulseSpeed = carnivoreRepulseSpeedSlider.value; carnivoreRepulseSpeedCounter.innerHTML = carnivoreRepulseSpeedSlider.value; initializeCellPopulations()})

herbivoreCellsToReproduceSlider.addEventListener('input', () => {herbivoreCellsToReproduce = herbivoreCellsToReproduceSlider.value; herbivoreCellsToReproduceCounter.innerHTML = herbivoreCellsToReproduceSlider.value; initializeCellPopulations()})
carnivoreCellsToReproduceSlider.addEventListener('input', () => {carnivoreCellsToReproduce = carnivoreCellsToReproduceSlider.value; carnivoreCellsToReproduceCounter.innerHTML = carnivoreCellsToReproduceSlider.value; initializeCellPopulations()})

let greenPopulation = starterGreen;
let bluePopulation = starterBlue;
let redPopulation = starterRed;
initializeCellPopulations();

// Define cell properties
const cellDiameter = 10;
const plantCellColor = "#00FF00"; // Green
const herbivoreCellColor = "#0000FF"; // Blue
const carnivoreCellColor = '#ff0000'; // Red

// Initial cells
// Generate a random x and y coordinate within the canvas boundaries
function getRandomCoordinate() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height
    };
}
function initializeCellPopulations() {
    // Initialize green cells with random positions
    greenCells = Array.from({ length: starterGreen }, () => getRandomCoordinate());
    // Initialize herbivore cells with random positions and lifespan
    herbivoreCells = Array.from({ length: starterBlue }, () => ({
        ...getRandomCoordinate(),
        lifespan: herbivoreLifespan,
        cellsEaten: 0
    }));
    carnivoreCells = Array.from({ length: starterRed }, () => ({
        ...getRandomCoordinate(),
        lifespan: carnivoreLifespan,
        cellsEaten: 0
    }));
    clearGraphs();
}

function drawCell(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, cellDiameter / 2, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawCells() {
    greenCells.forEach(cell => drawCell(cell.x, cell.y, plantCellColor));
    herbivoreCells.forEach(cell => drawCell(cell.x, cell.y, herbivoreCellColor));
    carnivoreCells.forEach(cell => drawCell(cell.x, cell.y, carnivoreCellColor));
}

function duplicatePlantCell(cell) {
    const duplicationChance = Math.random();
    if (duplicationChance <= plantGrowthChance) {
        // Duplicate the cell with slight variation in position
        const newX = cell.x + (Math.random() * plantGrowthDistance);
        const newY = cell.y + (Math.random() * plantGrowthDistance);

        // Boundary checks to prevent plants from growing outside the canvas
        const boundedX = Math.max(0, Math.min(canvas.width, newX));
        const boundedY = Math.max(0, Math.min(canvas.height, newY));

        greenCells.push({ x: boundedX, y: boundedY });
    }
}

function moveCell(cell, type) {
    // Adjust the x and y coordinates for movement
    cell.x += Math.random() * 4 - 2; // Random horizontal movement (-2 to 2)
    cell.y += Math.random() * 4 - 2; // Random vertical movement (-2 to 2)

    // Boundary checks to prevent going outside the canvas
    cell.x = Math.max(0, Math.min(canvas.width, cell.x));
    cell.y = Math.max(0, Math.min(canvas.height, cell.y));

    // Decrease the lifespan
    cell.lifespan--;

    // Check if the cell's lifespan has reached zero, remove it
    if (cell.lifespan <= 0) {
        if(type === 'herbivore') herbivoreCells = herbivoreCells.filter(c => c !== cell);
        if(type === 'carnivore') carnivoreCells = carnivoreCells.filter(c => c !== cell);
    }
}

function moveHerbivoreToPlant(herbivore, plant) {
    const dx = plant.x - herbivore.x;
    const dy = plant.y - herbivore.y;
    const distance = Math.sqrt(dx ** 2 + dy ** 2);

    // Check if the plant is within the herbivore's line of vision
    if (distance <= herbivoreVisionDiameter / 2) {
        // Move towards the plant
        const angle = Math.atan2(dy, dx);
        herbivore.x += Math.cos(angle) * herbivoreAttractSpeed;
        herbivore.y += Math.sin(angle) * herbivoreAttractSpeed;
    }
}
function moveCarnivoreToPray(carnivore, prey) {
    const dx = prey.x - carnivore.x;
    const dy = prey.y - carnivore.y;
    const distance = Math.sqrt(dx ** 2 + dy ** 2);

    // Check if the prey is within the carnivor's line of vision
    if (distance <= carnivoreVisionDiameter / 2) {
        // Move towards the prey
        const angle = Math.atan2(dy, dx);
        carnivore.x += Math.cos(angle) * carnivoreAttractSpeed;
        carnivore.y += Math.sin(angle) * carnivoreAttractSpeed;
    }
}
function repulseCarnivoreFromPlant(carnivore, plant) {
    const dx = plant.x - carnivore.x;
    const dy = plant.y - carnivore.y;
    const distance = Math.sqrt(dx ** 2 + dy ** 2);

    // Check if the plant is within the carnivor's line of vision
    if (distance <= carnivoreVisionDiameter / 2) {
        // Move away from plant
        const angle = Math.atan2(dy, dx);
        carnivore.x -= Math.cos(angle) * carnivoreRepulseSpeed;
        carnivore.y -= Math.sin(angle) * carnivoreRepulseSpeed;
    }
}
function repulseHerbivoreFromCarnivore(herbivore, carnivore) {
    const dx = carnivore.x - herbivore.x;
    const dy = carnivore.y - herbivore.y;
    const distance = Math.sqrt(dx ** 2 + dy ** 2);

    // Check if the carnivore is within the carnivor's line of vision
    if (distance <= herbivoreVisionDiameter / 2) {
        // Move away from carnivore
        const angle = Math.atan2(dy, dx);
        herbivore.x -= Math.cos(angle) * herbivoreRepulseSpeed;
        herbivore.y -= Math.sin(angle) * herbivoreRepulseSpeed;
    }
}

function eatGreenCell(herbivore, green) {
    const distance = Math.sqrt((herbivore.x - green.x) ** 2 + (herbivore.y - green.y) ** 2);

    if (distance < cellDiameter) {
        herbivore.cellsEaten++;
        // Blue cell is in contact with a green cell, "eat" it
        if(herbivore.cellsEaten >= herbivoreCellsToReproduce) {
            herbivoreCells.push({ x: green.x, y: green.y, lifespan: herbivoreLifespan, cellsEaten: 0 })
            herbivore.cellsEaten = 0;
        }
        greenCells = greenCells.filter(cell => cell !== green); // Remove eaten green cell
        herbivore.lifespan += (herbivoreLifespan / 3);
    }
}
function eatBlueCell(carnivore, prey) {
    const distance = Math.sqrt((carnivore.x - prey.x) ** 2 + (carnivore.y - prey.y) ** 2);
    
    if (distance < cellDiameter) {
        carnivore.cellsEaten++;
        // red cell is in contact with a prey cell, "eat" it
        if(carnivore.cellsEaten >= carnivoreCellsToReproduce) {
            carnivoreCells.push({ x: prey.x, y: prey.y, lifespan: carnivoreLifespan, cellsEaten: 0})
            carnivore.cellsEaten = 0;
        }
        herbivoreCells = herbivoreCells.filter(cell => cell !== prey); // Remove eaten blue cell
        carnivore.lifespan += (carnivoreLifespan / 3);
    }
}

function updateCanvas() {
    // Update logic for herbivore cell movement towards plantss
    herbivoreCells.forEach(herbivore => {
        // Find the nearest plant cell
        const nearestPlant = greenCells.reduce((nearest, plant) => {
            const herbivoreToPlantDistance = Math.sqrt((herbivore.x - plant.x) ** 2 + (herbivore.y - plant.y) ** 2);
            return herbivoreToPlantDistance < nearest.distance ? { plant, distance: herbivoreToPlantDistance } : nearest;
        }, { plant: null, distance: Infinity });

        // Move towards the nearest plant if it exists
        if (nearestPlant.plant) {
            moveHerbivoreToPlant(herbivore, nearestPlant.plant);
        }

        // move away from carnviores
        const nearestCarnivore = carnivoreCells.reduce((nearest, carnivore) => {
            const herbivoreToCarnivoreDistance = Math.sqrt((herbivore.x - carnivore.x) ** 2 + (herbivore.y - carnivore.y) ** 2);
            return herbivoreToCarnivoreDistance < nearest.distance ? { carnivore, distance: herbivoreToCarnivoreDistance } : nearest;
        }, { carnivore: null, distance: Infinity });

        // Move towards the nearest carnivore if it exists
        if (nearestCarnivore.carnivore) {
            repulseHerbivoreFromCarnivore(herbivore, nearestCarnivore.carnivore);
        }
    });
    // Update logic for herbivore cell movement towards plantss
    carnivoreCells.forEach(carnivore => {
        // Find the nearest plant cell
        const nearestPrey = herbivoreCells.reduce((nearest, prey) => {
            const carnivoreTopreyDistance = Math.sqrt((carnivore.x - prey.x) ** 2 + (carnivore.y - prey.y) ** 2);
            return carnivoreTopreyDistance < nearest.distance ? { prey, distance: carnivoreTopreyDistance } : nearest;
        }, { prey: null, distance: Infinity });

        // Move towards the nearest prey if it exists
        if (nearestPrey.prey) {
            moveCarnivoreToPray(carnivore, nearestPrey.prey);
        }

        // move away from plants
        const nearestPlant = greenCells.reduce((nearest, plant) => {
            const carnivoreToplantDistance = Math.sqrt((carnivore.x - plant.x) ** 2 + (carnivore.y - plant.y) ** 2);
            return carnivoreToplantDistance < nearest.distance ? { plant, distance: carnivoreToplantDistance } : nearest;
        }, { plant: null, distance: Infinity });

        // Move towards the nearest plant if it exists
        if (nearestPlant.plant) {
            repulseCarnivoreFromPlant(carnivore, nearestPlant.plant);
        }
    });

    // Update logic for herbivore cell movement
    herbivoreCells.forEach(cell => moveCell(cell, 'herbivore'));
    carnivoreCells.forEach(cell => moveCell(cell, 'carnivore'));

    // Update logic for cell eating
    herbivoreCells.forEach(herbivore => {
        greenCells.forEach(green => eatGreenCell(herbivore, green));
    });
    carnivoreCells.forEach(carnivore => {
        herbivoreCells.forEach(blue => eatBlueCell(carnivore, blue));
    });

    // Redraw canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCells();

    // Get population sizes
    greenPopulation = greenCells.length;
    bluePopulation = herbivoreCells.length;
    redPopulation = carnivoreCells.length;
}

function growPlants() {
    // Update logic for plant cell duplication
    greenCells.forEach(cell => duplicatePlantCell(cell));
    if(bluePopulation === 0 & redPopulation === 0) endGame();
}

let gameTick = undefined;
let plantGrowth = undefined;
function startGame() {
    drawCells();
    gameTick = setInterval(updateCanvas, 10);  // Update every 100th of a second
    plantGrowth = setInterval(growPlants, 1000);  // Update every second 
}

function endGame() {
    clearInterval(gameTick); // stops updating canvas & cells
    clearInterval(plantGrowth);  // stops plant growth
}

function resetGame() {
    initializeCellPopulations();
}

export {startGame, endGame, resetGame, redPopulation, bluePopulation, greenPopulation};
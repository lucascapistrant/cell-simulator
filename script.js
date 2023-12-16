const canvas = document.getElementById("simCanvas");
const ctx = canvas.getContext("2d");

const plantGrowthChance = 0.05;
const plantGrowthDistance = 50;
const herbivoreLifespan = 2000;
const carnivoreLifespan = 3000;

const herbivoreVisionDiameter = 50;
const carnivoreVisionDiameter = 200;

const starterGreen = 100;
const starterBlue = 10;
const starterRed = 4;

let greenPopulation = starterGreen;
let bluePopulation = starterBlue;
let redPopulation = starterRed;

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

// Initialize green cells with random positions
let greenCells = Array.from({ length: starterGreen }, () => getRandomCoordinate());

// Initialize herbivore cells with random positions and lifespan
let herbivoreCells = Array.from({ length: starterBlue }, () => ({
    ...getRandomCoordinate(),
    lifespan: herbivoreLifespan
}));
let carnivoreCells = Array.from({ length: starterRed }, () => ({
    ...getRandomCoordinate(),
    lifespan: carnivoreLifespan
}));


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
        const newX = cell.x + (Math.random() * 50 - plantGrowthDistance);
        const newY = cell.y + (Math.random() * 50 - plantGrowthDistance);

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
        const speed = 1; // Adjust the speed as needed
        const angle = Math.atan2(dy, dx);
        herbivore.x += Math.cos(angle) * speed;
        herbivore.y += Math.sin(angle) * speed;
    }
}
function moveCarnivoreToPray(carnivore, prey) {
    const dx = prey.x - carnivore.x;
    const dy = prey.y - carnivore.y;
    const distance = Math.sqrt(dx ** 2 + dy ** 2);

    // Check if the prey is within the carnivor's line of vision
    if (distance <= carnivoreVisionDiameter / 2) {
        // Move towards the prey
        const speed = 1; // Adjust the speed as needed
        const angle = Math.atan2(dy, dx);
        carnivore.x += Math.cos(angle) * speed;
        carnivore.y += Math.sin(angle) * speed;
    }
}

function eatGreenCell(herbivore, green) {
    const distance = Math.sqrt((herbivore.x - green.x) ** 2 + (herbivore.y - green.y) ** 2);

    if (distance < cellDiameter) {
        // Blue cell is in contact with a green cell, "eat" it
        herbivoreCells.push({ x: green.x, y: green.y, lifespan: herbivoreLifespan }); // Duplicate blue cell with reset lifespan
        greenCells = greenCells.filter(cell => cell !== green); // Remove eaten green cell
    }
}
function eatBlueCell(carnivore, prey) {
    const distance = Math.sqrt((carnivore.x - prey.x) ** 2 + (carnivore.y - prey.y) ** 2);

    if (distance < cellDiameter) {
        // red cell is in contact with a prey cell, "eat" it
        carnivoreCells.push({ x: prey.x, y: prey.y, lifespan: carnivoreLifespan }); // Duplicate red cell with reset lifespan
        herbivoreCells = herbivoreCells.filter(cell => cell !== prey); // Remove eaten blue cell
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
function simulate() {
    gameTick = setInterval(updateCanvas, 10);  // Update every 100th of a second
    plantGrowth = setInterval(growPlants, 1000);  // Update every second 
}


// Initial draw
drawCells();

// Start simulation
simulate();

function endGame() {
    clearInterval(gameTick);
    clearInterval(plantGrowth);
}
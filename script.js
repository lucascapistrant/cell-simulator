const canvas = document.getElementById("simCanvas");
const ctx = canvas.getContext("2d");

const plantGrowthChance = 0.05;
const herbivoreLifespan = 2000;
const herbivoreVisionDiameter = 100;
const starterGreen = 100;
const starterBlue = 10;
const plantGrowthDistance = 50;

// Define cell properties
const cellDiameter = 10;
const plantCellColor = "#00FF00"; // Green
const herbivoreCellColor = "#0000FF"; // Blue

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

function moveHerbivoreCell(cell) {
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
        herbivoreCells = herbivoreCells.filter(c => c !== cell);
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

function eatGreenCell(herbivore, green) {
    const distance = Math.sqrt((herbivore.x - green.x) ** 2 + (herbivore.y - green.y) ** 2);

    if (distance < cellDiameter) {
        // Blue cell is in contact with a green cell, "eat" it
        herbivoreCells.push({ x: green.x, y: green.y, lifespan: herbivoreLifespan }); // Duplicate blue cell with reset lifespan
        greenCells = greenCells.filter(cell => cell !== green); // Remove eaten green cell
    }
}

function updateCanvas() {
    // Update logic for herbivore cell movement towards plants
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
    // Update logic for herbivore cell movement
    herbivoreCells.forEach(cell => moveHerbivoreCell(cell));

    // Update logic for blue cell eating
    herbivoreCells.forEach(herbivore => {
        greenCells.forEach(green => eatGreenCell(herbivore, green));
    });

    // Redraw canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCells();
}

function growPlants() {
    // Update logic for plant cell duplication
    greenCells.forEach(cell => duplicatePlantCell(cell));
}

function simulate() {
    setInterval(updateCanvas, 10);  // Update every 100th of a second
    setInterval(growPlants, 1000);  // Update every second 
}


// Initial draw
drawCells();

// Start simulation
simulate();


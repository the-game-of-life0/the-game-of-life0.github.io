// --- CONFIGURATION SETUP ---
let canvas = document.getElementById('game');
let game_window = document.getElementsByClassName('game-window')[0]

// --- CANVAS RESIZING LOGIC (Fits the container element) ---
function resizeCanvas() {
    canvas.width = game_window.clientWidth;
    canvas.height = game_window.clientHeight;
}

// Listen for window resize events to recalculate container boundaries
window.addEventListener('resize', resizeCanvas);

// Call it immediately once to set initial sizes
resizeCanvas();

let ctx = canvas.getContext('2d');

// Grid of squares
let grid = [];

let BASE_SQUARE_SIZE = 70; // Width/height of square at 1.0x zoom
let MAX_ZOOM_OUT = 0.15;   // Your strict maximum zoom-out limit
let MAX_ZOOM_IN = 1.6;     // Maximum zoom-in limit
let ZOOM_SPEED = 1.1;

// Colour
let SQUARECOLOUR = '#000000'
let BORDER_COLOUR = '#787070'

// --- CAMERA VIEWPORT STATE ---
let zoom = 1.0;
let offsetX = window.innerWidth / 2; // Initial offset centers the origin
let offsetY = window.innerHeight / 2;
let isDragging = false;
let startX = 0;
let startY = 0;

// Globals
let currentSize;

// --- DYNAMIC DATA MAPPING (arr[i][j]) ---
function getSquareColour(i, j) {
    if (i === 0 && j === 0) return '#e74c3c'; // Visual origin marker
    return SQUARECOLOUR;
}

function getStrokeColour(i, j) {
    return BORDER_COLOUR;
}

function main() {
    // DRAW SQUARES
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    currentSize = BASE_SQUARE_SIZE * zoom;

    // 1. Convert screen bounds to 2D array world coordinates (i, j)
    const startI = Math.floor(-offsetX / currentSize);
    const endI = Math.ceil((canvas.width - offsetX) / currentSize);
    
    const startJ = Math.floor(-offsetY / currentSize);
    const endJ = Math.ceil((canvas.height - offsetY) / currentSize);

    // 2. Performance Culling: Loop ONLY through visible rows and columns
    for (let i = startI; i <= endI; i++) {
        for (let j = startJ; j <= endJ; j++) {
            
            // Map the array indices back to real-time screen pixels
            const screenX = i * currentSize + offsetX;
            const screenY = j * currentSize + offsetY;

            // Render square background using custom array coordinates
            ctx.fillStyle = getSquareColour(i, j);
            ctx.strokeStyle = getStrokeColour(i, j);
            ctx.fillRect(screenX, screenY, currentSize - 1, currentSize - 1); // -1 for border spacing
        }
    }

    // LOGIC



    requestAnimationFrame(main);
}

function getSquareCoords(x, y) {
    /* 
    Given a pair of coordinates on the canvas, return the coordinates for the matching
    square in the array 'grid'

    If the given coordinates are not on the grid, returns (-1, -1)
    */
    //currentSize
    return 5, 5;
}

// --- EVENT LISTENERS ---

// Scroll-Wheel Zoom Logic
canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const oldZoom = zoom;

    // Zoom factor scaling
    if (e.deltaY < 0) {
        zoom *= ZOOM_SPEED;
    } else {
        zoom *= -ZOOM_SPEED;
    }

    // CRITICAL: Clamps the camera strictly to your max zoom-out scale
    zoom = Math.min(Math.max(MAX_ZOOM_OUT, zoom), MAX_ZOOM_IN);

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    offsetX = centerX - (centerX - offsetX) * (zoom / oldZoom);
    offsetY = centerY - (centerY - offsetY) * (zoom / oldZoom);
}, { passive: false });

// Pan Event: Click Initiation
canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
});

// Pan Event: Drag Handling
window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    offsetX = e.clientX - startX;
    offsetY = e.clientY - startY;
});

// Pan Event: Click Termination
window.addEventListener('mouseup', () => {
    isDragging = false;
});

canvas.addEventListener('mousedown', (e) => {
    if (isDragging) return;
    x = e.clientX;
    y = e.clientY;

    x, y = getSquareCoords(x, y);

    grid[square] = !(grid[square])
})

// Run engine instance
requestAnimationFrame(main);

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

let BASE_SQUARE_SIZE = 70; // Width/height of square at 1.0x zoom
let MAX_ZOOM_OUT = 0.15;   // Your strict maximum zoom-out limit
let MAX_ZOOM_IN = 6.0;     // Maximum zoom-in limsit

// --- CAMERA VIEWPORT STATE ---
let zoom = 1.0;
let offsetX = window.innerWidth / 2; // Initial offset centers the origin
let offsetY = window.innerHeight / 2;
let isDragging = false;
let startX = 0;
let startY = 0;

// --- DYNAMIC DATA MAPPING (arr[i][j]) ---
// Replace this with your actual array lookup or procedural map generation
function getSquareColor(i, j) {
    if (i === 0 && j === 0) return '#e74c3c'; // Visual origin marker
    return '#000000'
}

// --- CORE RENDERING ENGINE (Calculates Visible Squares) ---
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const currentSize = BASE_SQUARE_SIZE * zoom;

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
            ctx.fillStyle = getSquareColor(i, j);
            ctx.fillRect(screenX, screenY, currentSize - 1, currentSize - 1); // -1 for border spacing
        }
    }

    requestAnimationFrame(draw);
}

// --- INTERACTIVE EVENT LISTENERS ---

// Scroll-Wheel Zoom Logic
canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const oldZoom = zoom;

    // Zoom factor scaling
    if (e.deltaY < 0) {
        zoom *= 1.1;
    } else {
        zoom /= 1.1;
    }

    // CRITICAL: Clamps the camera strictly to your max zoom-out scale
    zoom = Math.min(Math.max(MAX_ZOOM_OUT, zoom), MAX_ZOOM_IN);

    // Repositions view window relative to cursor anchor point
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    offsetX = mouseX - (mouseX - offsetX) * (zoom / oldZoom);
    offsetY = mouseY - (mouseY - offsetY) * (zoom / oldZoom);
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

// Run engine instance
requestAnimationFrame(draw);

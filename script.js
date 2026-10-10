// --- CONFIGURATION SETUP ---
const canvas = document.getElementById('game'); // Change to your canvas ID
const ctx = canvas.getContext('2d');

const BASE_SQUARE_SIZE = 70; // Width/height of square at 1.0x zoom
const MAX_ZOOM_OUT = 0.35;   // Your strict maximum zoom-out limit
const MAX_ZOOM_IN = 4.0;     // Maximum zoom-in limsit

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
    const hash = Math.abs((i * 12345 + j * 67890) % 360);
    return `hsl(${hash}, 45%, 35%)`;
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

            // 3. Draw coordinate text label [i, j] inside the dynamic box
            if (zoom > 0.5) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
                ctx.font = `${Math.max(10, currentSize * 0.18)}px monospace`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(`${i},${j}`, screenX + currentSize / 2, screenY + currentSize / 2);
            }
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

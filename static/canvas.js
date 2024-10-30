const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvasSize = 500;
let zoom = 1.0;
let baseGridCount = 500; // Base grid count at zoom = 1
let gridCount = 500;
let pixelSize = canvasSize / gridCount;

canvas.width = canvasSize;
canvas.height = canvasSize;

function updateGridCount() {
    return Math.floor(gridCount / 2); // Adjust grid count based on zoom
}

function updatePixelSize() {
    return canvasSize / gridCount; // Update pixel size based on new grid count
}

function drawGrid() {
    ctx.strokeStyle = '#000'; // Set grid line color
    ctx.lineWidth = 1; // Set grid line width
    // Draw horizontal lines
    for (let i = 0; i <= gridCount; i++) {
        let y = i * pixelSize;
        ctx.beginPath();
        ctx.moveTo(0, y); // Start the line at the left edge (x = 0)
        ctx.lineTo(canvasSize, y); // Draw to the right edge (x = canvasSize)
        ctx.stroke();
    }
    // Draw vertical lines
    for (let i = 0; i <= gridCount; i++) {
        let x = i * pixelSize;
        ctx.beginPath();
        ctx.moveTo(x, 0); // Start the line at the top edge (y = 0)
        ctx.lineTo(x, canvasSize); // Draw to the bottom edge (y = canvasSize)
        ctx.stroke();
    }
}

//drawGrid();

class Point {
    // new Point(x, y)
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    // Convert canvas position to data position
    canvasToData() {
        return new Point(
            Math.round(this.x / canvasSize * gridCount),
            Math.round(this.y / canvasSize * gridCount)
        );
    }
    // Convert data position to canvas position
    dataToCanvas() {
        return new Point(
            this.x / gridCount * canvasSize,
            this.y / gridCount * canvasSize
        );
    }
    // Convert to array index
    index() {
        return this.y * dataSize + this.x;
    }
    // Basic math functions
    plus(otherPoint) {
        return new Point(
            this.x + otherPoint.x,
            this.y + otherPoint.y
        );
    }
    minus(otherPoint) {
        return new Point(
            this.x - otherPoint.x,
            this.y - otherPoint.y
        );
    }
    scaleBy(number) {
        return new Point(
            this.x * number,
            this.y * number
        );
    }
}

function draw(point, color) {
    point = point.canvasToData().dataToCanvas();
    ctx.fillStyle = color;
    ctx.fillRect(point.x, point.y, pixelSize, pixelSize);
}

/*
canvas.addEventListener("mousedown", (e) => {
    let x = e.clientX - canvas.getBoundingClientRect().left - (pixelSize / 2);
    let y = e.clientY - canvas.getBoundingClientRect().top - (pixelSize / 2);
    let color = document.getElementById("stroke").value;
    let point = new Point(x, y);
    draw(point, color);
});
*/

canvas.addEventListener("mousedown", (e) => {
    let x = e.clientX - canvas.getBoundingClientRect().left - (pixelSize / 2);
    let y = e.clientY - canvas.getBoundingClientRect().top - (pixelSize / 2);
    if (x > 249){
        if (y < 250){
            console.log("Quadrant 1");
            console.log("Previous Grid Size:", gridCount);
            console.log("Previous PixelSize:", pixelSize);
            gridCount = updateGridCount();
            pixelSize = updatePixelSize();
            console.log("Updated Grid Size:", gridCount);
            console.log("Updated PixelSize:", pixelSize);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawStoredPixels(1);
        }
        else{
            console.log("Quadrant 4");
        }
    }
    else{
        if (y < 250){
            console.log("Quadrant 2");
        }
        else{
            console.log("Quadrant 3");
        }
    }
    console.log("This is where the user clicked to zoom:", x);
    console.log("This is where the user clicked to zoom:", y);
});

const pixelData = {};

function storePixel(x, y, color){
    pixelData[`${x},${y}`] = color;
}

for (let i = 0; i < 500; i++){
    storePixel(i, 250, '#0000FF');
    storePixel(i, i, '#FF0000');
    storePixel(i, 499 - i, '#FFFF00');
    storePixel(250, i, '#FF6600')
}

function drawStoredPixels(quadrant) {
    if (quadrant == 1){
        for (const [key, color] of Object.entries(pixelData)) {
            const [x, y] = key.split(',').map(Number);
            if (x >= 250 && x <= 499 && y >= 0 && y <= 249) {
                const pixelCanvasPos = new Point(x, y);
                ctx.fillStyle = color;
                console.log(pixelCanvasPos);
                draw(pixelCanvasPos, color);
            }
        }
    }
    else{
        for (const [key, color] of Object.entries(pixelData)) {
            const [x, y] = key.split(',').map(Number);
            const pixelCanvasPos = new Point(x, y);
            ctx.fillStyle = color;
            draw(pixelCanvasPos, color);
        }
    }
}

drawStoredPixels();

/*
document.getElementById("zoomIn").addEventListener("click", () => {
    if (zoom < 100.0) {
        if (zoom == 1.0){
            zoom = 4.0;
        }
        else{
            zoom += 4.0;
        }
        gridCount = updateGridCount();
        pixelSize = updatePixelSize();
        console.log(zoom);
        console.log(gridCount);
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(); // Redraw the grid with updated zoom
});

/*
document.getElementById("zoomOut").addEventListener("click", () => {
    if (zoom > 1.0) {
        if (zoom <= 4.0){
            zoom = 1.0;
        }
        else{
            zoom -= 4.0;
        }
        gridCount = updateGridCount();
        pixelSize = updatePixelSize();
        console.log(zoom);
        console.log(gridCount);
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(); // Redraw the grid with updated zoom
});
*/
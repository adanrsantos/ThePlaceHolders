const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvasSize = 500;
const dataSize = 1000;
let zoom = 1.0;

function getGridCount() {
    return canvasSize / zoom;
}

function getCenterPixel() {
    return getPixelSize() / 2;
}

function getPixelSize() {
    return canvasSize / getGridCount() * zoom;
}

canvas.width = canvasSize;
canvas.height = canvasSize;

function drawGrid() {
    if (getPixelSize() < 5) {
        return;
    }
    ctx.strokeStyle = '#000'; // Set grid line color
    ctx.lineWidth = 1; // Set grid line width
    // Draw horizontal lines
    for (let i = 0; i <= getGridCount(); i++) {
        let y = i * getPixelSize();
        ctx.beginPath();
        ctx.moveTo(0, y); // Start the line at the left edge (x = 0)
        ctx.lineTo(canvasSize, y); // Draw to the right edge (x = canvasSize)
        ctx.stroke();
    }
    // Draw vertical lines
    for (let i = 0; i <= getGridCount(); i++) {
        let x = i * getPixelSize();
        ctx.beginPath();
        ctx.moveTo(x, 0); // Start the line at the top edge (y = 0)
        ctx.lineTo(x, canvasSize); // Draw to the bottom edge (y = canvasSize)
        ctx.stroke();
    }
}

drawGrid();

class Point {
    // new Point(x, y)
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    // Convert canvas position to data position
    canvasToData() {
        return new Point(
            Math.round(this.x / canvasSize * getGridCount()),
            Math.round(this.y / canvasSize * getGridCount())
        );
    }
    // Convert data position to canvas position
    dataToCanvas() {
        return new Point(
            this.x / getGridCount() * canvasSize,
            this.y / getGridCount() * canvasSize
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
    point = point.canvasToData().dataToCanvas()
    console.log(point.x + " " + point.y);
    ctx.fillStyle = color;
    ctx.fillRect(point.x, point.y, getPixelSize(), getPixelSize());
}

canvas.addEventListener("mousedown", (e) => {
    let x = e.clientX - canvas.getBoundingClientRect().left - getCenterPixel();
    let y = e.clientY - canvas.getBoundingClientRect().top - getCenterPixel();
    let color = document.getElementById("stroke").value;
    let point = new Point(x, y)
    draw(point, color);
});

document.getElementById("zoomIn").addEventListener("click", () => {
    if (zoom < 100.0){
        zoom += 1.0;
    }
    console.log(zoom);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    drawGrid(); // Redraw the grid with updated zoom
});

document.getElementById("zoomOut").addEventListener("click", () => {
    if (zoom > 1.0){
        zoom -= 1.0;
    }
    console.log(zoom);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    drawGrid(); // Redraw the grid with updated zoom
});

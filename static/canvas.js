const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvasSize = 500;
const dataSize = 1000;
const gridCount = 10;
let zoom = 1.0;
const centerPixel = getPixelSize() / 2;

function getPixelSize() {
    return canvasSize / gridCount * zoom;
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
    for (let i = 0; i <= gridCount; i++) {
        let y = i * getPixelSize();
        ctx.beginPath();
        ctx.moveTo(0, y); // Start the line at the left edge (x = 0)
        ctx.lineTo(canvasSize, y); // Draw to the right edge (x = canvasSize)
        ctx.stroke();
    }

    // Draw vertical lines
    for (let i = 0; i <= gridCount; i++) {
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

function draw(point) {
    point = point.canvasToData().dataToCanvas()
    ctx.fillRect(point.x, point.y, getPixelSize(), getPixelSize());
}

canvas.addEventListener("mousedown", (e) => {
    let x = e.clientX - canvas.getBoundingClientRect().left - centerPixel;
    let y = e.clientY - canvas.getBoundingClientRect().top - centerPixel;
    let point = new Point(x, y)
    draw(point);
});

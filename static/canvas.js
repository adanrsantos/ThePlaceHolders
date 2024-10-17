const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvasSize = 500;
const dataSize = 1000;
canvas.width = canvasSize;
canvas.height = canvasSize;

class Point {
    // new Point(x, y)
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    // Convert canvas position to data position
    canvasToData() {
        return new Point(
            Math.round(this.x / canvasSize * dataSize),
            Math.round(this.y / canvasSize * dataSize)
        );
    }
    // Convert data position to canvas position
    dataToCanvas() {
        return new Point(
            this.x / dataSize * canvasSize,
            this.y / dataSize * canvasSize
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

let pixelSize = canvasSize / dataSize;
const centerPixel = pixelSize / 2;

function draw(x, y) {
    ctx.fillRect(x, y, pixelSize, pixelSize);
}

canvas.addEventListener("mousedown", (e) => {
    let x = e.clientX - canvas.getBoundingClientRect().left - centerPixel;
    let y = e.clientY - canvas.getBoundingClientRect().top - centerPixel;
    draw(x, y);
})

//const toolbar = document.getElementById("toolbar");
//const strokePicker = document.getElementById("stroke");
//const canvasOffsetX = canvas.offsetLeft;
//const canvasOffsetY = canvas.offsetTop;
//canvas.width = 150;
//canvas.height = 150;

/*
let isPainting = false;
let lineWidth = 5;
let strokeColor = "#000000";
let startX;
let startY;

function drawGrid(lineInterval, lineColor) {
    // Set the color of the grid lines
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;  // Set the gridline thickness
    
    // Draw vertical grid lines
    for (let x = 0; x <= canvas.width; x += lineInterval) {
        ctx.beginPath();
        ctx.moveTo(x, 0);  // Start from top of the canvas
        ctx.lineTo(x, canvas.height);  // Draw line down to the bottom
        ctx.stroke();
    }
    
    // Draw horizontal grid lines
    for (let y = 0; y <= canvas.height; y += lineInterval) {
        ctx.beginPath();
        ctx.moveTo(0, y);  // Start from the left of the canvas
        ctx.lineTo(canvas.width, y);  // Draw line across to the right
        ctx.stroke();
    }
    ctx.beginPath();
}

// Call the drawGrid function with 50px intervals and a light gray color
drawGrid(10, '#A9A9A9');

toolbar.addEventListener("click", e => {
    if (e.target.id === "clear"){
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawGrid(10, '#A9A9A9');
    }

    if (e.target.id === "lineWidth"){
        lineWidth = e.target.value;
    }
});

strokePicker.addEventListener("input", (e) => {
    strokeColor = e.target.value;
});

const draw = (e) => {
    if (!isPainting){
        return;
    }
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeColor;
    ctx.lineCap = "round";

    ctx.lineTo(e.clientX - canvasOffsetX, e.clientY - canvasOffsetY);
    ctx.stroke();
}

canvas.addEventListener("mousedown", (e) => {
    isPainting = true;
    startX = e.clientX;
    startY = e.clientY;
});

canvas.addEventListener("mouseup", (e) => {
    isPainting = false;
    ctx.stroke();
    ctx.beginPath();
});

canvas.addEventListener("mousemove", draw);
*/

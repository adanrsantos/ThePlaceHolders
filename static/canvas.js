const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const CANVAS_SIZE = 500;
const DATA_SIZE = 200;
let scale = 1;
let offx = 0;
let offy = 0;

let clickx = 0;
let clicky = 0;

let mouseClicked = false;
// Array of [red, blue, green, transparency] * width * height
let image = new ImageData(DATA_SIZE, DATA_SIZE);
// Drawable image
let bitmap = null;

async function sendPixelData(x, y, color) {
    try {
        const response = await fetch("http://localhost:8080/savePixel", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ x: x, y: y, color: color })
        });
        
        if (response.ok) {
            const updatedPixels = await response.json();
            // Refresh the canvas with updated pixel data
            updateCanvasWithData(updatedPixels);
        } else {
            console.error("Failed to send pixel data:", response.statusText);
        }
    } catch (error) {
        console.error("Error sending pixel data:", error);
    }
}

function updateCanvasWithData(pixelDataArray) {
    // Clear the canvas image data
    for (let x = 0; x < DATA_SIZE * DATA_SIZE * 4; x++) {
        image.data[x] = 255; // Reset to white
    }
    
    // Set each pixel from the server data
    pixelDataArray.forEach(pixel => {
        setPixel(image.data, pixel.x, pixel.y, pixel.color);
    });
    
    // Redraw and update canvas
    redraw();
    draw();
}

canvas.addEventListener("mouseup", async (e) => {
    if (e.button == 0 && mouseClicked) {
        mouseClicked = false;
        let mouse = mousePosition(e);
        let cx = mouse.x;
        let cy = mouse.y;
        
        if (cx < 0 || cx > CANVAS_SIZE || cy < 0 || cy > CANVAS_SIZE) {
            return;
        }
        
        const color = [0, 0, 255, 255];
        setPixel(image.data, cx, cy, color);
        
        // Send pixel data to the server
        await sendPixelData(cx, cy, color);
    }
});

window.addEventListener("load", async (e) => {
    for (let x = 0; x < DATA_SIZE * DATA_SIZE * 4; x++) {
        image.data[x] = 255;
    }
    ctx.imageSmoothingEnabled = false;
    // Create drawable image, update it every half second
    await redraw();
    setInterval(redraw, 500);
    setInterval(draw, 500);
});


async function redraw() {
    // Create a new ImageBitmap based on the updated image data
    bitmap = await createImageBitmap(image);
    console.log("Redrawing canvas...");
}

// Color is an array of four numbers 0-255 (RGB + transparency)
function setPixel(data, x, y, color) {
    let start = (y * DATA_SIZE + x) * 4;
    for (let i = 0; i < 4; i++) {
        data[start + i] = color[i];
    }
}

function draw() {
    ctx.fillStyle = "rgb(0 0 0 255)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let drawScale = CANVAS_SIZE / DATA_SIZE * scale;
    ctx.scale(drawScale, drawScale);
    ctx.drawImage(bitmap, offx, offy);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function mousePosition(e) {
    let x = e.clientX - canvas.getBoundingClientRect().left;
    let y = e.clientY - canvas.getBoundingClientRect().top;
    let cx = Math.round(x / (CANVAS_SIZE * scale) * DATA_SIZE - offx - 0.5);
    let cy = Math.round(y / (CANVAS_SIZE * scale) * DATA_SIZE - offy - 0.5);
    return {x: cx, y: cy};
}

function moveOffset(x, y) {
    offx = Math.min(Math.max(x, -10 - DATA_SIZE / 2), DATA_SIZE + 10);
    offy = Math.min(Math.max(y, -10 - DATA_SIZE / 2), DATA_SIZE + 10);
}

function changeColor() {
    var button = document.getElementById("colorPicker");
    var style = getComputedStyle(button);
  
    console.log(style['background-color']);
}

canvas.addEventListener("wheel", async (e) => {
    let mouse = mousePosition(e);
    let oldScale = scale;
    if (e.deltaY < 0) {
        scale += 0.1;
    } else if (e.deltaY > 0) {
        scale -= 0.1;
    }
    scale = Math.min(Math.max(scale, 0.5), 10);
    let diff = (CANVAS_SIZE / oldScale) - (CANVAS_SIZE / scale);
    let ratiox = (mouse.x - (CANVAS_SIZE / 2)) / CANVAS_SIZE;
    let ratioy = (mouse.y - (CANVAS_SIZE / 2)) / CANVAS_SIZE;
    moveOffset(diff * ratiox, diff*  ratioy);
    draw(image);
});

canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();
})

canvas.addEventListener("mousedown", async (e) => {
    // Left click
    if (e.button == 0) {
        mouseClicked = true;
        setTimeout(() => {
            mouseClicked = false;
        }, 200);
    }
});

canvas.addEventListener("mouseup", async (e) => {
    if (e.button == 0 && mouseClicked) {
        mouseClicked = false;
        clickx = e.clientX;
        clicky = e.clientY;
        let mouse = mousePosition(e);
        let cx = mouse.x;
        let cy = mouse.y;
        
        if (cx < 0 || cx > CANVAS_SIZE || cy < 0 || cy > CANVAS_SIZE) {
            return;
        }
        setPixel(image.data, cx, cy, pixelColor);
        await redraw();
        draw();
    }
});

canvas.addEventListener("mousemove", async (e) => {
    // `buttons` is a bitflag for some dumb reason
    if (e.buttons & 1) {
        offx += e.movementX * (1.0 / scale) * 0.45;
        offy += e.movementY * (1.0 / scale) * 0.45;
        moveOffset(
            offx + e.movementX * (1.0 / scale) * 0.45,
            offy + e.movementY * (1.0 / scale) * 0.45
        );
        draw(image);
    } 
});

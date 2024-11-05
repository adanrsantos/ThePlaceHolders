const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const CANVAS_SIZE = 500;
const DATA_SIZE = 200;
let scale = 1;
// Array of [red, blue, green, transparency] * width * height
const image = new ImageData(DATA_SIZE, DATA_SIZE);

// Color is an array of four numbers 0-255 (RGB + transparency)
function setPixel(data, x, y, color) {
    let start = (y * DATA_SIZE + x) * 4;
    for (let i = 0; i < 4; i++) {
        data[start + i] = color[i];
    }
}

async function draw(image) {
    ctx.fillStyle = "rgb(0 0 0 255)";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let drawScale = CANVAS_SIZE / DATA_SIZE * scale;
    let bitmap = await createImageBitmap(image);
    ctx.imageSmoothingEnabled = false;
    ctx.scale(drawScale, drawScale);
    ctx.drawImage(bitmap, 0, 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

canvas.addEventListener("wheel", async (e) => {
    if (e.deltaY < 0) {
        scale += 0.1;
    } else if (e.deltaY > 0) {
        scale -= 0.1;
    }
    await draw(image);
});

canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();
})

canvas.addEventListener("mousedown", async (e) => {
    // Left click
    if (e.button == 0) {
        let x = e.clientX - canvas.getBoundingClientRect().left;
        let y = e.clientY - canvas.getBoundingClientRect().top;

        let cx = Math.round(x / (CANVAS_SIZE * scale) * DATA_SIZE);
        let cy = Math.round(y / (CANVAS_SIZE * scale) * DATA_SIZE);

        setPixel(image.data, cx, cy, [255, 0, 0, 255]);
        await draw(image);
    }
    // Right click
    else if (e.button == 2) {
        
    }
});

const canvas = document.getElementById("canvas");
const toolbar = document.getElementById("toolbar");
const strokePicker = document.getElementById("stroke");
const ctx = canvas.getContext("2d");

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

canvas.width = 850;
canvas.height = 500;

let isPainting = false;
let lineWidth = 5;
let strokeColor = "#000000";
let startX;
let startY;

toolbar.addEventListener("click", e => {
    if (e.target.id === "clear"){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
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
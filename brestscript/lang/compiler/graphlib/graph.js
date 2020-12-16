const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function set_color(color){
    ctx.fillStyle = color;
}

function set_pixel(x, y){
    ctx.fillRect(x, y, 1, 1);
}

function rect(x, y, w, h){
    ctx.fillRect(x, y, w, h);
}
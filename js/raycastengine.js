const scr = document.getElementById('windowcanvas');
const ctx = scr.getContext('2d');

const debugwindow = document.getElementById('debug');
const debugctx = debugwindow.getContext('2d');

const windowWidth = 800;
const windowHeight = 600;

let mouseX = 0;
let mouseY = 0;

let px = 200;
let py = 200;
let PmoveDir = {x: 0, y: 0};
let playerAngle = 0;
let ProtateDir = 0;

let raydistance = 1000;
let rayCount = 100;
let FOV = 90;
const raystep = FOV / rayCount;

let walls = [
    100,100, 500,100, 
    100,500, 100,100,
    100,500, 500,500,
    500,500, 500,100,

    300,150, 300,300, 
    300,400, 200,500, 
];

let firstContactdir = null;

window.addEventListener('keydown', (e) => {
    //console.log(e.code);
    if(e.code == 'KeyW'){
        //py -= 10;
        PmoveDir.y = -1;
    }
    if(e.code == 'KeyS'){
        //py += 10;
        PmoveDir.y = 1;
    }
    if(e.code == 'KeyA'){
        //px -= 10;
        PmoveDir.x = -1;
    }
    if(e.code == 'KeyD'){
        //px += 10;
        PmoveDir.x = 1;
    }

    if(e.code == 'ArrowLeft'){
        ProtateDir = 1;
    }
    if(e.code == 'ArrowRight'){
        ProtateDir = -1;
    }
});
window.addEventListener('keyup', (e) => {
    if(e.code == 'KeyW' || e.code == 'KeyS'){
        PmoveDir.y = 0;
    }
    if(e.code == 'KeyA' || e.code == 'KeyD'){
        PmoveDir.x = 0;
    }

    if(e.code == 'ArrowLeft' || e.code == 'ArrowRight'){
        ProtateDir = 0;
    }
});

window.addEventListener('mousemove', (e) => {
    //console.log(e);
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function drawCircle(ctx, x,y, r){
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.stroke();
}

function drawLine(ctx, x1, y1, x2, y2, color){
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(Math.floor(x1) + 0.5,Math.floor(y1) + 0.5);
    ctx.lineTo(Math.floor(x2) + 0.5, Math.floor(y2) + 0.5);
    ctx.stroke();
}

function rayIntersect(x1,y1, x2,y2, x3,y3, x4,y4){
    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if(denom == 0){return null;}

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;

    if (t > 0 && t < 1 && u > 0 && u < 1){
        const x = x1 + t * (x2 - x1);
        const y = y1 + t * (y2 - y1);
        return {x: x, y: y};
    }
    return null;
}

function dotOnLine(px,py, x1,y1, x2,y2){
    const crossProduct = (py - y1) * (x2 - x1) - (px - x1) * (y2 - y1);

    if(Math.abs(crossProduct) > 1e-10){return false;}
    if (px < Math.min(x1, x2) || px > Math.max(x1, x2) || 
        py < Math.min(y1, y2) || py > Math.max(y1, y2)) {
        return false;
    }
    
    return true;
}

let contactWall = null;
function collisionWithWalls(){
    if(contactWall != null){
        let offset = contactWall * 4;
        let x1 = walls[offset];
        let y1 = walls[offset +1];
        let x2 = walls[offset +2];
        let y2 = walls[offset +3];
        if(!dotOnLine(px,py, x1,y1, x2,y2)){
            if(firstContactdir != null){
                firstContactdir = null;
                contactWall = null;
            }
        }
    }

    for(let i = 0; i < walls.length / 4; i++){
        let offset = i * 4;
        let x1 = walls[offset];
        let y1 = walls[offset +1];
        let x2 = walls[offset +2];
        let y2 = walls[offset +3];

        let tmp
        if(x2 < x1){
            tmp = x2;
            x2 = x1;
            x1 = tmp;
        }
        if(y2 < y1){
            tmp = y2;
            y2 = y1;
            y1 = tmp;
        }

        let collide = false;
        if(dotOnLine(px + 5 * PmoveDir.x,py + 5 * PmoveDir.y, x1,y1, x2,y2)){
            if(firstContactdir == null && contactWall == null){
                firstContactdir = {x: PmoveDir.x, y: PmoveDir.y};
                contactWall = i;
                console.log("Colliding");
            }
            collide = true;
        }
        if(collide){return;}
    }
}

function main(){
    debugctx.rect(0,0, windowWidth, windowHeight);
    debugctx.fillStyle = '#FFFFFF';
    debugctx.fill();

    //ctx.rect(0,0, windowWidth, windowHeight);
    //ctx.fillStyle = 'white';
    //ctx.fill();

    ctx.rect(0,0, windowWidth, windowHeight / 2);
    ctx.fillStyle = '#0000FF';
    ctx.fill();

    ctx.beginPath();
    ctx.rect(0,windowHeight / 2, windowWidth, windowHeight);
    ctx.fillStyle = '#AAAAAA';
    ctx.fill();

    //playerAngle++;
    //playerAngle = mouseX * 0.8;
    playerAngle += ProtateDir * 2;

    collisionWithWalls();

    if(firstContactdir != null){
        if(PmoveDir.x * firstContactdir.x > 0){
            PmoveDir.x = 0;
            //px -= 5 * firstContactdir.x;
        }
        if(PmoveDir.y * firstContactdir.y > 0){
            PmoveDir.y = 0;
            //py -= 5 * firstContactdir.y;
        }
    }

    px += 5 * PmoveDir.x;
    py += 5 * PmoveDir.y;

    let prevX = -windowWidth / rayCount;
    for(let i = 0; i < rayCount; i++){
        const rayangle = ((i + playerAngle) * raystep) * (3.14 / 180);
        let rayStepX = Math.cos(rayangle);
        let rayStepY = Math.sin(rayangle);

        let intersect = null;
        let currentdistance = 0;
        drawLine(debugctx, px /2, py /2, (px + rayStepX * raydistance) /2, (py + rayStepY * raydistance) /2, "#FF00FF");
        while(currentdistance < raydistance){
            if(intersect != null){break;}
            let rayX = px + rayStepX * currentdistance;
            let rayY = py + rayStepY * currentdistance;

            for(let j = 0; j < walls.length / 4; j++){
                let offset = j * 4;
                intersect = rayIntersect(px,py, rayX,rayY, walls[offset],walls[offset +1], walls[offset +2],walls[offset +3]);
                if(intersect != null){break;}
            }
            currentdistance += 1;
        }

        if(intersect != null){
            drawLine(debugctx, px /2, py /2, intersect.x /2, intersect.y /2, "#FFFF00");
            let x = i * (windowWidth / rayCount);
            let wallDistance = Math.sqrt((intersect.x - px) ** 2 + (intersect.y - py) ** 2);
            let wallHeight = (20 * windowHeight) / wallDistance;

            let startY = (windowHeight / 2) - (wallHeight / 2);
            let endY = startY + wallHeight;

            for(let j = 0; j < x - prevX; j++){
                drawLine(ctx, x + j, startY, x + j, endY, "#00EE00");
            }
            prevX = x;
            //drawLine(ctx, x, startY, x, endY, "#EE0000");
        }
    }
    drawCircle(debugctx, px /2, py /2, 5);

    for(let i = 0; i < walls.length / 4; i++){
        let offset = i * 4;
        drawLine(debugctx, walls[offset] /2,walls[offset +1] /2, walls[offset +2] /2,walls[offset +3] /2, "black");
    }

    requestAnimationFrame(main);
}
main();

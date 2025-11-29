const board_transforms = {scale: 0.15, translateX: -5, translateY: -1};
const boardGame = document.getElementById("board-game");
const marbles = [];
let signal = true;

const path_1 = document.querySelector("#path-1 path");
const path_1_Length = path_1.getTotalLength();
const path_2 = document.querySelector("#path-2 path");
const path_2_Length = path_2.getTotalLength();
const path_3 = document.querySelector("#path-3 path");
const path_3_Length = path_3.getTotalLength();
const path_4 = document.querySelector("#path-4 path");
const path_4_Length = path_4.getTotalLength();
const path_5 = document.querySelector("#path-5 path");
const path_5_Length = path_5.getTotalLength();
const path_6 = document.querySelector("#path-6 path");
const path_6_Length = path_6.getTotalLength();
const path_7 = document.querySelector("#path-7 path");
const path_7_Length = path_7.getTotalLength();
const path_8 = document.querySelector("#path-8 path");
const path_8_Length = path_8.getTotalLength();

const start_path = document.querySelector("#start-path path");
const start_path_Length = start_path.getTotalLength();
const end_path = document.querySelector("#end-path path");
const end_path_Length = end_path.getTotalLength();

const marble_startLength = (15 * 2) / start_path_Length; 
const marble_endLength = (15 * 2) / end_path_Length;
const start_slots = [];
const end_slots = [];
start_slots.push(1);
end_slots.push(1 - marble_endLength * 2/3);
for(let i = 1; i < 16; i++){
    start_slots.push(start_slots[i-1] - marble_startLength);
    end_slots.push(end_slots[i-1] - marble_endLength);
}


class Marble {
    constructor(rotator_id, element_id, options = {}) {
        this.rotator_id = rotator_id;
        this.element_id = element_id;
        this.angle = 0;
        this.rotation = { a: 0, b: 360 };
        this.rotation_speed = 6;
        this.ctranslate = { x: 0.5, y: 0.5 };
        this.cp = null;
        this.lastX = options.lastX ?? null;
        this.lastY = options.lastY ?? null;
        this.progress = options.progress ?? 0;
        this.leftTriggered = options.leftTriggered ?? false;
        this.middleTriggered = options.middleTriggered ?? false;
        this.rightTriggered = options.rightTriggered ?? false;
        this.turnerTriggered = options.turnerTriggered ?? false;
        this.pusherTriggered = options.pusherTriggered ?? false;
        this.equalizerTriggered = options.equalizerTriggered ?? false;
        this.endProgress = options.endProgress ?? 0;
        this.rolled = options.rolld ?? false;
        this.inserted = options.inserted ?? false;
        this.endSlot = options.endSlot ?? null;
        this.speed = 0.0075;
        this.advanceSpeed = 0.0025;
        this.initialSpeed = 0.0075;
        this.insertSpeed = 0.005;
        this.fall_backSpeed = 0.001;
        this.endPoint = 0;
    }
}

const turner = {
    rotator_id: "turner-mover",
    element_id: "turner",
    flipped: -1,
    angle: 0,
    rotation : {
        a: 0,
        b: -45
    },
    rotation_speed: 9,
    ctranslate : {
        x: 0.2,
        y: 0.8
    },
    cp: null
};
turner.cp = getRotatingPoint(turner);

const equalizer = {
    rotator_id: "equalizer-mover",
    element_id: "equalizer",
    flipped: -1,
    angle: 0,
    rotation : {
        a: 0,
        b: -60
    },
    rotation_speed: 5,
    ctranslate : {
        x: 0.5,
        y: 0.8
    },
    cp: null
};
equalizer.cp = getRotatingPoint(equalizer);

class levers {
    constructor(rotator_id, element_id) {
        this.rotator_id = rotator_id;
        this.element_id = element_id;
        this.flipped = -1;
        this.angle = 0;
        this.rotation = {
            a: 0,
            b: -55
        };
        this.rotation_speed = 3;
        this.ctranslate = {
            x: 0.5,
            y: 0.5
        };
        this.cp = null;
    }
};

const left_flip_flop = new levers("left-flip-flop-rotator", "left-flip-flop");
left_flip_flop.cp = getRotatingPoint(left_flip_flop);
const middle_flip_flop = new levers("middle-flip-flop-rotator", "middle-flip-flop");
middle_flip_flop.cp = getRotatingPoint(middle_flip_flop);
const right_flip_flop = new levers("right-flip-flop-rotator", "right-flip-flop");
right_flip_flop.cp = getRotatingPoint(right_flip_flop);

const trigger = document.getElementById("trigger");
const trigger_pusher = document.getElementById("trigger-pusher");
const pusher = document.getElementById("pusher");
const pusher_trigger = document.getElementById("pusher-trigger");


function getRotatingPoint(piece){
    const element = document.getElementById(piece.element_id);
    const bbox = element.getBBox();

    const transformedX = bbox.x * board_transforms.scale + board_transforms.translateX;
    const transformedY = bbox.y * board_transforms.scale + board_transforms.translateY;
    const transformedWidth = bbox.width * board_transforms.scale;
    const transformedHeight = bbox.height * board_transforms.scale;

    const cx = transformedX + transformedWidth * piece.ctranslate.x;
    const cy = transformedY + transformedHeight * piece.ctranslate.y;

    return {cx, cy};
}

function turn(piece) {
    return new Promise((resolve) => { 
        function animate(){
            if (!(piece.rotation.b <= piece.angle && piece.angle <= piece.rotation.a)) {
                piece.flipped = 0 - piece.flipped;
                piece.angle += piece.rotation_speed * piece.flipped;
                resolve();
                return;
            }

            const rotator = document.getElementById(piece.rotator_id);
            rotator.setAttribute("transform", `rotate(${piece.angle} ${piece.cp.cx} ${piece.cp.cy})`);
            piece.angle += piece.rotation_speed * piece.flipped;
            requestAnimationFrame(() => animate());
        }

        animate();
    });
}

async function push_trigger() {
    trigger_pusher.style.transform = 'scale(0.95) translate(0px, -0.2px)';
    pusher_trigger.style.transform = 'scale(1.5) translate(0px, -0.1px)';
    await delay(250);
    trigger_pusher.style.transform = '';
    pusher_trigger.style.transform = '';
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function triggerListener(){
  push_trigger(); 
  roll();
}

function enterListener(event) {
  if (event.key === 'Enter') {
    try{
      push_trigger();
      roll();
    }
    catch (error) {
      console.error("Error caught:", error.message || error);
      alert("An error occurred: " + (error.message || error));
    }
  }
}


async function roll_path_1(marble, currentMarble, marbleNum) {
    const point = path_1.getPointAtLength(marble.progress * path_1_Length);
    const x = point.x * board_transforms.scale + board_transforms.translateX;
    const y = point.y * board_transforms.scale + board_transforms.translateY;

    if (marble.lastX !== null && marble.lastY !== null) {
        const rotator = document.getElementById(marble.rotator_id);
        rotator.setAttribute(
            "transform",
            `translate(${x - marble.cp.cx} ${y - marble.cp.cy}) rotate(${marble.angle} ${marble.cp.cx} ${marble.cp.cy})`
        );
    }

    marble.lastX = x;
    marble.lastY = y;

    if (!marble.leftTriggered && marble.progress >= 0.45) {
        turn(left_flip_flop);
        marble.leftTriggered = true;
    }

    if(marble.progress >= 0.50 && marble.progress <= 0.80)
        marble.speed = 0.0125;
    else marble.speed = marble.initialSpeed;

    if (turner.flipped == 1 && !marble.turnerTriggered && marble.progress >= 0.80) {
        turn(turner);
        marble.turnerTriggered = true;
    }

    marble.progress += marble.speed;

    if(!marble.inserted && marble.progress > 0.925){
        if(currentMarble < 9)
            marble.endSlot = currentMarble+1;
        else
            marble.endSlot = 9;
        insertMarble(currentMarble, marbleNum);
        marble.inserted = true;
    }

    if (marble.progress < 1) {
        requestAnimationFrame(() => roll_path_1(marble, currentMarble, marbleNum));
    }
    else {
        marble.endPoint = 9;
        position_in_endSlot(marble, 9);
        roll_in_slot(marble, marble.endSlot);
        
        if(currentMarble == 8){
            move_forward(marbles[currentMarble], marbles[currentMarble].endSlot, marble_endLength/2, marbles[currentMarble].insertSpeed);
        }

        if(currentMarble >= 9){
            await delay(500);
            for(let i=0; i < 9; i++){
                fall_back(marbles[i], marbles[i].endSlot, -marble_endLength/2, marbles[i].fall_backSpeed);
            }
            for(let i=9; i <=currentMarble; i++){
                fall_back(marbles[i], marbles[i].endSlot, marble_endLength/2, marbles[i].fall_backSpeed);
            }
        }
    }
}


async function roll_path_2(marble, currentMarble, marbleNum) {
    const point = path_2.getPointAtLength(marble.progress * path_2_Length);
    const x = point.x * board_transforms.scale + board_transforms.translateX;
    const y = point.y * board_transforms.scale + board_transforms.translateY;

    if (marble.lastX !== null && marble.lastY !== null) {
        const rotator = document.getElementById(marble.rotator_id);
        rotator.setAttribute(
            "transform",
            `translate(${x - marble.cp.cx} ${y - marble.cp.cy}) rotate(${marble.angle} ${marble.cp.cx} ${marble.cp.cy})`
        );
    }

    marble.lastX = x;
    marble.lastY = y;

    if (!marble.middleTriggered && marble.progress >= 0.35) {
        turn(middle_flip_flop);
        turn(left_flip_flop);
        marble.middleTriggered = true;
        marble.leftTriggered = false;
    }

    if (turner.flipped == 1 && !marble.turnerTriggered && marble.progress >= 0.80) {
        turn(turner);
        marble.turnerTriggered = true;
    }

    if(marble.progress >= 0.35 && marble.progress <= 0.45)
        marble.speed = 0.01;
    else if(marble.progress >= 0.60 && marble.progress <= 0.80)
        marble.speed = 0.01;
    else marble.speed = marble.initialSpeed;

    if(!marble.inserted && marble.progress > 0.925){
        if(currentMarble < 9)
            marble.endSlot = currentMarble+1;
        else
            marble.endSlot = 9;
        insertMarble(currentMarble, marbleNum);
        marble.inserted = true;
    }

    marble.progress += marble.speed;

    if (marble.progress < 1) {
        requestAnimationFrame(() => roll_path_2(marble, currentMarble));
    }
    else {
        marble.endPoint = 9;
        position_in_endSlot(marble, 9);
        roll_in_slot(marble, marble.endSlot);

        if(currentMarble == 8){
            move_forward(marbles[currentMarble], marbles[currentMarble].endSlot, marble_endLength/2, marbles[currentMarble].insertSpeed);
        }

        if(currentMarble >= 9){
            await delay(500);
            for(let i=0; i < 9; i++){
                fall_back(marbles[i], marbles[i].endSlot, -marble_endLength/2, marbles[i].fall_backSpeed);
            }
            for(let i=9; i <=currentMarble; i++){
                fall_back(marbles[i], marbles[i].endSlot, marble_endLength/2, marbles[i].fall_backSpeed);
            }
        }
    }
}


async function roll_path_3(marble, currentMarble, marbleNum) {
    const point = path_3.getPointAtLength(marble.progress * path_3_Length);
    const x = point.x * board_transforms.scale + board_transforms.translateX;
    const y = point.y * board_transforms.scale + board_transforms.translateY;

    if (marble.lastX !== null && marble.lastY !== null) {
        const rotator = document.getElementById(marble.rotator_id);
        rotator.setAttribute(
            "transform",
            `translate(${x - marble.cp.cx} ${y - marble.cp.cy}) rotate(${marble.angle} ${marble.cp.cx} ${marble.cp.cy})`
        );
    }

    marble.lastX = x;
    marble.lastY = y;

    if (!marble.rightTriggered && marble.progress >= 0.30) {
        turn(right_flip_flop);
        turn(middle_flip_flop);
        marble.middleTriggered = false;
        marble.rightTriggered = true;
    }

    if(marble.progress >= 0.30 && marble.progress <= 0.45)
        marble.speed = 0.01;
    else if(marble.progress >= 0.60 && marble.progress <= 0.80)
        marble.speed = 0.01;
    else marble.speed = marble.initialSpeed;

    if (equalizer.flipped == -1 && !marble.equalizerTriggered && marble.progress >= 0.50) {
        turn(equalizer);
        marble.equalizerTriggered = true;
    }

    if (turner.flipped == 1 && !marble.turnerTriggered && marble.progress >= 0.80) {
        turn(turner);
        marble.turnerTriggered = true;
    }

    if(!marble.inserted  && marble.progress > 0.925){
        if(currentMarble < 9)
            marble.endSlot = currentMarble+1;
        else
            marble.endSlot = 9;
        insertMarble(currentMarble, marbleNum);
        marble.inserted = true;
    }

    marble.progress += marble.speed;

    if (marble.progress < 1) {
        requestAnimationFrame(() => roll_path_3(marble, currentMarble));
    }
    else {
        marble.endPoint = 9;
        position_in_endSlot(marble, 9);
        roll_in_slot(marble, marble.endSlot);

        if(currentMarble == 8){
            move_forward(marbles[currentMarble], marbles[currentMarble].endSlot, marble_endLength/2, marbles[currentMarble].insertSpeed);
        }

        if(currentMarble >= 9){
            await delay(500);
            for(let i=0; i < 9; i++){
                fall_back(marbles[i], marbles[i].endSlot, -marble_endLength/2, marbles[i].fall_backSpeed);
            }
            for(let i=9; i <=currentMarble; i++){
                fall_back(marbles[i], marbles[i].endSlot, marble_endLength/2, marbles[i].fall_backSpeed);
            }
        }
    }
}

async function roll_path_4(marble, currentMarble, marbleNum) {
    marble.endPoint = 9;
    const point = path_4.getPointAtLength(marble.progress * path_4_Length);
    const x = point.x * board_transforms.scale + board_transforms.translateX;
    const y = point.y * board_transforms.scale + board_transforms.translateY;

    if (marble.lastX !== null && marble.lastY !== null) {
        const rotator = document.getElementById(marble.rotator_id);
        rotator.setAttribute(
        "transform",
        `translate(${x - marble.cp.cx} ${y - marble.cp.cy}) rotate(${marble.angle} ${marble.cp.cx} ${marble.cp.cy})`
        );
    }

    marble.lastX = x;
    marble.lastY = y;

    if (!marble.rightTriggered && marble.progress >= 0.35) {
        turn(right_flip_flop);
        turn(middle_flip_flop);
        marble.middleTriggered = false;
        marble.rightTriggered = true;
    }

    if(marble.progress >= 0.35 && marble.progress <= 80)
        marble.speed = 0.01;
    else marble.speed = marble.initialSpeed;

    if(!marble.inserted && marble.progress > 0.925){
        if(currentMarble < 9)
            marble.endSlot = currentMarble+1;
        else
            marble.endSlot = 9;
        insertMarble(currentMarble, marbleNum);
        marble.inserted = true;
    }
    
    marble.progress += marble.speed;

    if (marble.progress < 1) {
        requestAnimationFrame(() => roll_path_4(marble, currentMarble));
    }
    else {
        position_in_endSlot(marble, 9);
        roll_in_slot(marble, marble.endSlot);

        if(currentMarble == 8){
            move_forward(marbles[currentMarble], marbles[currentMarble].endSlot, marble_endLength/2, marbles[currentMarble].insertSpeed);
        }

        if(currentMarble >= 9){
            await delay(500);
            for(let i=0; i < 9; i++){
                fall_back(marbles[i], marbles[i].endSlot, -marble_endLength/2, marbles[i].fall_backSpeed);
            }
            for(let i=9; i <=currentMarble; i++){
                fall_back(marbles[i], marbles[i].endSlot, marble_endLength/2, marbles[i].fall_backSpeed);
            }
        }
    }
}

async function roll_path_5(marble, currentMarble, marbleNum) {
    const point = path_5.getPointAtLength(marble.progress * path_5_Length);
    const x = point.x * board_transforms.scale + board_transforms.translateX;
    const y = point.y * board_transforms.scale + board_transforms.translateY;

    if (marble.lastX !== null && marble.lastY !== null) {
        const rotator = document.getElementById(marble.rotator_id);
        rotator.setAttribute(
        "transform",
        `translate(${x - marble.cp.cx} ${y - marble.cp.cy}) rotate(${marble.angle} ${marble.cp.cx} ${marble.cp.cy})`
        );
    }

    marble.lastX = x;
    marble.lastY = y;

    if (!marble.rightTriggered && marble.progress >= 0.30) {
        turn(right_flip_flop);
        turn(middle_flip_flop);
        marble.middleTriggered = false;
        marble.rightTriggered = true;
    }

    if(marble.progress >= 0.35 && marble.progress <= 0.55)
        marble.speed = 0.01;
    else marble.speed = marble.initialSpeed;

    if(marble.progress >= 0.95 && !marble.pusherTriggered){
        marble.pusherTriggered = true;
    }

    marble.progress += marble.speed;

    if (marble.progress < 1) {
        requestAnimationFrame(() => roll_path_5(marble, currentMarble));
    }
    else {
        marble.endPoint = 15;
        position_in_endSlot(marble, 15);
        marble.endSlot = currentMarble+1;
        roll_in_slot(marble, marble.endSlot);

        if(currentMarble == 8){
            await delay(850);
            for(let i=0; i <= currentMarble; i++)
                move_forward(marbles[i], marbles[i].endSlot, marble_endLength/2, marbles[i].fall_backSpeed);
        }
        if(currentMarble > 8){
            const df = marbles[currentMarble-1].progress - end_slots[marbles[currentMarble-1].endSlot];
            move_forward(marble, marble.endSlot, df, marble.insertSpeed);
        }
    }
}

async function roll_path_6(marble, currentMarble, marbleNum) {
    const point = path_6.getPointAtLength(marble.progress * path_6_Length);
    const x = point.x * board_transforms.scale + board_transforms.translateX;
    const y = point.y * board_transforms.scale + board_transforms.translateY;

    if (marble.lastX !== null && marble.lastY !== null) {
        const rotator = document.getElementById(marble.rotator_id);
        rotator.setAttribute(
        "transform",
        `translate(${x - marble.cp.cx} ${y - marble.cp.cy}) rotate(${marble.angle} ${marble.cp.cx} ${marble.cp.cy})`
        );
    }

    marble.lastX = x;
    marble.lastY = y;

    if (!marble.rightTriggered && marble.progress >= 0.15) {
        turn(right_flip_flop);
        marble.rightTriggered = true;
    }

    if(marble.progress >= 0.95 && !marble.pusherTriggered){
        marble.pusherTriggered = true;
    }

    marble.progress += marble.speed;

    if (marble.progress < 1) {
        requestAnimationFrame(() => roll_path_6(marble, currentMarble));
    }
    else {
        console.log(marble.pusherTriggered + "????????????\n");
        marble.endPoint = 15;
        position_in_endSlot(marble, 15);
        marble.endSlot = currentMarble+1;
        roll_in_slot(marble, marble.endSlot);

        marble.pusherTriggered = true;

        if(currentMarble == 8){
            await delay(850);
            for(let i=0; i <= currentMarble; i++)
                move_forward(marbles[i], marbles[i].endSlot, marble_endLength/2, marbles[i].fall_backSpeed);
        }
        if(currentMarble > 8){
            const df = marbles[currentMarble-1].progress - end_slots[marbles[currentMarble-1].endSlot];
            move_forward(marble, marble.endSlot, df, marble.insertSpeed);
        }
    }
}

async function roll_path_7(marble, currentMarble, marbleNum) {
    const point = path_7.getPointAtLength(marble.progress * path_7_Length);
    const x = point.x * board_transforms.scale + board_transforms.translateX;
    const y = point.y * board_transforms.scale + board_transforms.translateY;

    if (marble.lastX !== null && marble.lastY !== null) {
        const rotator = document.getElementById(marble.rotator_id);
        rotator.setAttribute(
            "transform",
            `translate(${x - marble.cp.cx} ${y - marble.cp.cy}) rotate(${marble.angle} ${marble.cp.cx} ${marble.cp.cy})`
        );
    }

    marble.lastX = x;
    marble.lastY = y;

    if (!marble.rightTriggered && marble.progress >= 0.18) {
        turn(right_flip_flop);
        marble.rightTriggered = true;
    }

    if(marble.progress >= 0.20 && marble.progress <= 0.40)
        marble.speed = 0.01;
    else if(marble.progress >= 0.60 && marble.progress <= 0.90)
        marble.speed = 0.01;
    else marble.speed = marble.initialSpeed;

    if(!marble.inserted && marble.progress > 0.925){
        if(currentMarble < 9)
            marble.endSlot = currentMarble+1;
        else
            marble.endSlot = 9;
        insertMarble(currentMarble, marbleNum);
        marble.inserted = true;
    }

    marble.progress += marble.speed;

    if (marble.progress < 1) {
        requestAnimationFrame(() => roll_path_7(marble, currentMarble));
    }
    else {
        marble.endPoint = 9;
        position_in_endSlot(marble, 9);
        roll_in_slot(marble, marble.endSlot);

        if(currentMarble == 8){
            move_forward(marbles[currentMarble], marbles[currentMarble].endSlot, marble_endLength/2, marbles[currentMarble].insertSpeed);
        }

        if(currentMarble >= 9){
            await delay(500);
            for(let i=0; i < 9; i++){
                fall_back(marbles[i], marbles[i].endSlot, -marble_endLength/2, marbles[i].fall_backSpeed);
            }
            for(let i=9; i <=currentMarble; i++){
                fall_back(marbles[i], marbles[i].endSlot, marble_endLength/2, marbles[i].fall_backSpeed);
            }
        }
    }
}


async function roll_path_8(marble, currentMarble, marbleNum) {
    const point = path_8.getPointAtLength(marble.progress * path_8_Length);
    const x = point.x * board_transforms.scale + board_transforms.translateX;
    const y = point.y * board_transforms.scale + board_transforms.translateY;

    if (marble.lastX !== null && marble.lastY !== null) {
        const rotator = document.getElementById(marble.rotator_id);
        rotator.setAttribute(
            "transform",
            `translate(${x - marble.cp.cx} ${y - marble.cp.cy}) rotate(${marble.angle} ${marble.cp.cx} ${marble.cp.cy})`
        );
    }

    marble.lastX = x;
    marble.lastY = y;

    if (!marble.rightTriggered && marble.progress >= 0.15) {
        turn(right_flip_flop);
        marble.rightTriggered = true;
    }

    if(marble.equalizerTriggered == false && marble.progress >= 0.45){
        turn(equalizer);
        marble.equalizerTriggered = true;
    }

    if(marble.progress >= 0.20 && marble.progress <= 0.30)
        marble.speed = 0.01;
    else marble.speed = marble.initialSpeed;

    if (turner.flipped == 1 && !marble.turnerTriggered && marble.progress >= 0.78) {
        turn(turner);
        marble.turnerTriggered = true;
    }

    if(!marble.inserted && marble.progress > 0.925){
        if(currentMarble < 9)
            marble.endSlot = currentMarble+1;
        else
            marble.endSlot = 9;
        insertMarble(currentMarble, marbleNum);
        marble.inserted = true;
    }

    marble.progress += marble.speed;

    if (marble.progress < 1) {
        requestAnimationFrame(() => roll_path_8(marble, currentMarble));
    }
    else {
        marble.endPoint = 9;
        position_in_endSlot(marble, 9);
        roll_in_slot(marble, marble.endSlot);

        if(currentMarble == 8){
            move_forward(marbles[currentMarble], marbles[currentMarble].endSlot, marble_endLength/2, marbles[currentMarble].insertSpeed);
        }

        if(currentMarble >= 9){
            await delay(500);
            for(let i=0; i < 9; i++){
                fall_back(marbles[i], marbles[i].endSlot, -marble_endLength/2, marbles[i].fall_backSpeed);
            }
            for(let i=9; i <=currentMarble; i++){
                fall_back(marbles[i], marbles[i].endSlot, marble_endLength/2, marbles[i].fall_backSpeed);
            }
        }
    }
}

async function roll_in_slot(marble, slot) {
    const point = end_path.getPointAtLength(marble.progress * end_path_Length);
    const x = point.x * board_transforms.scale + board_transforms.translateX;
    const y = point.y * board_transforms.scale + board_transforms.translateY;

    if (marble.lastX !== null && marble.lastY !== null) {
        const rotator = document.getElementById(marble.rotator_id);
        rotator.setAttribute(
            "transform",
            `translate(${x - marble.cp.cx} ${y - marble.cp.cy}) rotate(${marble.angle} ${marble.cp.cx} ${marble.cp.cy})`
        );
    }

    marble.lastX = x;
    marble.lastY = y;

    marble.progress += marble.speed;

    if (marble.progress < end_slots[slot]) {
        requestAnimationFrame(() => roll_in_slot(marble, slot));
    }
    else {
        position_in_endSlot(marble, slot);
        marble.endSlot = slot;
        if(!marble.pusherTriggered)
            signal = true;
    }
}



function determine_path() {
  if (right_flip_flop.flipped == -1 && middle_flip_flop.flipped == -1 && left_flip_flop.flipped == -1) 
        return 1;
    else if (right_flip_flop.flipped == -1 && middle_flip_flop.flipped == -1 && left_flip_flop.flipped ==  1)
        return 2;
    else if (right_flip_flop.flipped == -1 && middle_flip_flop.flipped ==  1 && left_flip_flop.flipped == -1 && equalizer.flipped == -1)
        return 3;
    else if (right_flip_flop.flipped == -1 && middle_flip_flop.flipped ==  1 && left_flip_flop.flipped == -1 && equalizer.flipped ==  1 && turner.flipped == -1)
        return 4;
    else if (right_flip_flop.flipped == -1 && middle_flip_flop.flipped ==  1 && left_flip_flop.flipped == -1 && equalizer.flipped ==  1 && turner.flipped ==  1)
        return 5;
    else if (right_flip_flop.flipped ==  1 && middle_flip_flop.flipped == -1 && left_flip_flop.flipped == -1 && equalizer.flipped ==  1 && turner.flipped ==  1)
        return 6;
    else if (right_flip_flop.flipped ==  1 && middle_flip_flop.flipped == -1 && left_flip_flop.flipped == -1 && equalizer.flipped ==  1 && turner.flipped == -1)
        return 7;
    else if (right_flip_flop.flipped ==  1 && middle_flip_flop.flipped == -1 && left_flip_flop.flipped == -1 && equalizer.flipped == -1)
        return 8;
}


function release_marble(currentMarble, marbleNum) {
        const marble = marbles[currentMarble];
        marble.progress = 0;
        const path = determine_path();
        if (path === 1) {
            roll_path_1(marble, currentMarble, marbleNum);
        } else if (path === 2) {
            roll_path_2(marble, currentMarble, marbleNum);
        } else if (path === 3) {
            roll_path_3(marble, currentMarble, marbleNum);
        } else if (path === 4) {
            roll_path_4(marble, currentMarble, marbleNum);
        } else if (path === 5) {
            roll_path_5(marble, currentMarble, marbleNum);
        } else if (path === 6) {
            roll_path_6(marble, currentMarble, marbleNum);
        } else if (path === 7) {
            roll_path_7(marble, currentMarble, marbleNum);
        } else if (path === 8) {
            roll_path_8(marble, currentMarble, marbleNum);
        }
}

function position_in_startSlot(marble, slotNum) {
    marble.progress = start_slots[slotNum];
    const point = start_path.getPointAtLength(start_path_Length * marble.progress);
    const x = point.x * board_transforms.scale + board_transforms.translateX;
    const y = point.y * board_transforms.scale + board_transforms.translateY;

    const rotator = document.getElementById(marble.rotator_id);
    rotator.setAttribute(
        "transform",
        `translate(${x - marble.cp.cx} ${y - marble.cp.cy}) rotate(${marble.angle} ${marble.cp.cx} ${marble.cp.cy})`
    );
}

function position_in_endSlot(marble, slotNum, df=0) {
    marble.progress = end_slots[slotNum] + df;
    const point = end_path.getPointAtLength(end_path_Length * marble.progress);
    const x = point.x * board_transforms.scale + board_transforms.translateX;
    const y = point.y * board_transforms.scale + board_transforms.translateY;

    const rotator = document.getElementById(marble.rotator_id);
    rotator.setAttribute(
        "transform",
        `translate(${x - marble.cp.cx} ${y - marble.cp.cy}) rotate(${marble.angle} ${marble.cp.cx} ${marble.cp.cy})`
    );
}

function advanceSlots(marbleNum, nextMarble) {
    function advance(marble, slot, speed) {
        const point = start_path.getPointAtLength(marble.progress * start_path_Length);
        const x = point.x * board_transforms.scale + board_transforms.translateX;
        const y = point.y * board_transforms.scale + board_transforms.translateY;
  
        
        const rotator = document.getElementById(marble.rotator_id);
        rotator.setAttribute(
          "transform",
          `translate(${x - marble.cp.cx} ${y - marble.cp.cy}) rotate(${marble.angle} ${marble.cp.cx} ${marble.cp.cy})`
        );
  
        marble.lastX = x;
        marble.lastY = y;
        marble.progress += speed;
      
        if (marble.progress <= start_slots[slot]) {
          requestAnimationFrame(() => advance(marble, slot, speed));
        }
        else {
          position_in_startSlot(marble, slot);
        }
    }

    let slot = 0;
    for(let i=nextMarble; i < marbleNum; i++){
        const marble = marbles[i];
        advance(marble, slot, marble.advanceSpeed);
        slot += 1;
    }
}

function insertMarble(currentMarble) { 
    if(currentMarble < 8) return;
    if(currentMarble == 8)
        for(let i=0; i < 8; i++)
            move_forward(marbles[i], marbles[i].endSlot, marble_endLength/2, marbles[i].insertSpeed);
    else if(currentMarble == 9)
        for(let i=0; i < 9; i++)
            move_forward(marbles[i], marbles[i].endSlot, marble_endLength, marbles[i].insertSpeed);
    else{
        for(let i=0; i < 9; i++)
            move_forward(marbles[i], marbles[i].endSlot, marble_endLength, marbles[i].insertSpeed);
        for(let i=9; i < currentMarble; i++){
            if(marbles[i].endPoint == 9){
                marbles[i].endSlot += 1;
            }
            else{
                marbles[i].endPoint = 9;
            }
            fall_back(marbles[i], marbles[i].endSlot, 0, marbles[i].insertSpeed);
        }
    }
}

function move_forward(marble, slot, df, speed) {
    const point = end_path.getPointAtLength(marble.progress * end_path_Length);
    const x = point.x * board_transforms.scale + board_transforms.translateX;
    const y = point.y * board_transforms.scale + board_transforms.translateY;

    const rotator = document.getElementById(marble.rotator_id);
    rotator.setAttribute(
        "transform",
        `translate(${x - marble.cp.cx} ${y - marble.cp.cy}) rotate(${marble.angle} ${marble.cp.cx} ${marble.cp.cy})`
    );

    marble.lastX = x;
    marble.lastY = y;
    
    marble.progress += speed;

    if (marble.progress < end_slots[slot] + df) {
        requestAnimationFrame(() => move_forward(marble, slot, df, speed));
    }
    else{
        position_in_endSlot(marble, slot, df);
    }
}

function fall_back(marble, slot, df, speed) {
    const point = end_path.getPointAtLength(marble.progress * end_path_Length);
    const x = point.x * board_transforms.scale + board_transforms.translateX;
    const y = point.y * board_transforms.scale + board_transforms.translateY;

    const rotator = document.getElementById(marble.rotator_id);
    rotator.setAttribute(
        "transform",
        `translate(${x - marble.cp.cx} ${y - marble.cp.cy}) rotate(${marble.angle} ${marble.cp.cx} ${marble.cp.cy})`
    );

    marble.lastX = x;
    marble.lastY = y;
    
    marble.progress -= speed;
    
    if (marble.progress > end_slots[slot] - df) {
        requestAnimationFrame(() => fall_back(marble, slot, df, speed));
    }
    else{
        position_in_endSlot(marble, slot, -df);
    }
}

async function loadGame(marbleNum){
  for (let i = 0; i < marbleNum; i++) {
    const rotatorId = `marble-${i}-roller`;
    const marbleId = `marble-${i}`;
    const roller = document.createElementNS("http://www.w3.org/2000/svg", "g");
    roller.setAttribute("id", rotatorId);
    const marbleElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
    marbleElement.setAttribute("class", "marble");
    marbleElement.setAttribute("id", marbleId);
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", "158");
    circle.setAttribute("cy", "72");
    circle.setAttribute("r", "15");
    marbleElement.appendChild(circle);
    roller.appendChild(marbleElement);
    boardGame.appendChild(roller);
    const marble = new Marble(rotatorId, marbleId, {
        progress: 0,
        lastX: null,
        lastY: null,
        leftTriggered: false,
        middleTriggered: false,
        rightTriggered: false,
        turnerTriggered: false,
        pusherTriggered: false,
        equalizerTriggered: false,
        inserted: false,
        endSlot: 15
    });
    marble.cp = getRotatingPoint(marble);
    marbles.push(marble);
    position_in_startSlot(marble, i+1);
  }

    await delay(500);
    advanceSlots(marbleNum, 0);
    await delay(500);
    signal = true;
  
    for(let i = 0; i < marbleNum; i++) {
        if(signal) {
            const keydownPromise = waitForEvent(document, 'keydown');
            const mousedownPromise = waitForEvent(trigger, 'mousedown');

            await Promise.race([keydownPromise, mousedownPromise]);

            try{
                signal = false;
                push_trigger();
                release_marble(i, marbleNum);
                advanceSlots(marbleNum, i + 1);
            }
            catch(error){
                console.log(error);
            }
        }
        else  {
            await delay(200); 
            i -= 1;
            if(marbles[i].pusherTriggered){
                try{
                    signal = false;
                    i += 1;
                    push_trigger();
                    release_marble(i, marbleNum);
                    advanceSlots(marbleNum, i + 1);
                }
                catch(error){
                    console.log(error);
                }  
            }
        }
    }
}




loadGame(15);

function waitForEvent(element, eventName) {
    return new Promise((resolve) => {
        function handler(event) {
            element.removeEventListener(eventName, handler);
            resolve(event);
        }

        element.addEventListener(eventName, handler);
    });
}


document.getElementById(turner.element_id).addEventListener("click", () => turn(turner));
document.getElementById(equalizer.element_id).addEventListener("click", () => turn(equalizer));

document.getElementById(right_flip_flop.element_id).addEventListener("click", () => turn(right_flip_flop));
document.getElementById(middle_flip_flop.element_id).addEventListener("click", () => turn(middle_flip_flop));
document.getElementById(left_flip_flop.element_id).addEventListener("click", () => turn(left_flip_flop));



/** Menu & rules & button events */

// Așteaptă până se încarcă tot conținutul paginii
document.addEventListener("DOMContentLoaded", () => {
  // Selectăm elementele din HTML
  const menuOverlay = document.getElementById("menu-overlay");
  const startBtn = document.getElementById("start-btn");
  const rulesBtn = document.getElementById("rules-btn");
  const exitBtn = document.getElementById("exit-btn");
  const rulesBox=document.getElementById("rules");
  const closeRules=document.getElementById("close-rules");
  const pauseBtn=document.getElementById("pauseBtn");

  // ---- START GAME ----
  startBtn.addEventListener("click", () => {
    // Dispare meniul
    menuOverlay.style.display = "none";
   
    // Aici poți adăuga funcția ta care pornește jocul
    console.log("Jocul a început!");
  });

  // ---- RULES ----
  rulesBtn.addEventListener("click", () => {
    
    menuOverlay.style.display="none";
    rulesBox.style.display="block";
  });

  closeRules.addEventListener("click",()=>{
     menuOverlay.style.display="flex";
     rulesBox.style.display="none";
  });

  // ---- EXIT ----
  exitBtn.addEventListener("click", () => {
    // Închide pagina (funcționează doar în anumite contexte)
    if (confirm("Sigur vrei să ieși din joc?")) {
      // Încearcă să închidă fereastra
      window.close();

      // Dacă nu merge (de exemplu în tab-uri normale), mergem la pagina anterioară
      if (!window.closed) {
        window.history.back();
      }
    }
  });

  pauseBtn.addEventListener("click",()=>{
    menuOverlay.style.display="flex";

  })
  
});
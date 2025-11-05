const scale = 0.15;
const translateX = 13.5;
const translateY = 15;
function getRotatingPoint(piece){
    const element = document.getElementById(piece.element_id);
    const bbox = element.getBBox();

    const transformedX = bbox.x * scale + translateX;
    const transformedY = bbox.y * scale + translateY;
    const transformedWidth = bbox.width * scale;
    const transformedHeight = bbox.height * scale;

    const cx = transformedX + transformedWidth * piece.ctranslate.x;
    const cy = transformedY + transformedHeight * piece.ctranslate.y;

    return {cx, cy};
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
            b: -50
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

document.getElementById(turner.element_id).addEventListener("click", () => turn(turner));
document.getElementById(equalizer.element_id).addEventListener("click", () => turn(equalizer));

document.getElementById(right_flip_flop.element_id).addEventListener("click", () => turn(right_flip_flop));
document.getElementById(middle_flip_flop.element_id).addEventListener("click", () => turn(middle_flip_flop));
document.getElementById(left_flip_flop.element_id).addEventListener("click", () => turn(left_flip_flop));

async function push_trigger() {
    trigger_pusher.style.transform = 'scale(0.95) translate(0px, -0.2px)';
    pusher_trigger.style.transform = 'scale(1.5) translate(0px, -0.1px)';
    await delay(250);
    trigger_pusher.style.transform = '';
    pusher_trigger.style.transform = '';
}

trigger.addEventListener('mousedown', push_trigger);
document.addEventListener('keydown', enterListener);

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function enterListener(event) {
    if (event.key === 'Enter') {
        push_trigger();
        roll();
    }
}


const path_1 = document.querySelector("#path-1 path");
const path_1_Length = path_1.getTotalLength();

let progress = 0;            
let speed = 0.0030;                 
const rollRadius = 12 * scale;      
let lastX = null, lastY = null;

let leftTriggered = false;
let middleTriggered = false;
let turnerTriggered = false;


function roll_path_1(marble) {
    const point = path_1.getPointAtLength(marble.progress * path_1_Length);
    const x = point.x * scale + translateX;
    const y = point.y * scale + translateY;

    if (marble.lastX !== null && marble.lastY !== null) {
        const dx = x - marble.lastX;
        const dy = y - marble.lastY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const rotator = document.getElementById(marble.rotator_id);
        rotator.setAttribute(
            "transform",
            `translate(${x - marble.cp.cx} ${y - marble.cp.cy}) rotate(${marble.angle} ${marble.cp.cx} ${marble.cp.cy})`
        );
    }

    marble.lastX = x;
    marble.lastY = y;

    if (!marble.leftTriggered && marble.progress >= 0.55) {
        turn(left_flip_flop);
        marble.leftTriggered = true;
    }

    if (turner.flipped == 1 && !marble.turnerTriggered && marble.progress >= 0.76) {
        turn(turner);
        marble.turnerTriggered = true;
    }

    marble.progress += marble.speed;

    if (marble.progress < 1) {
        requestAnimationFrame(() => roll_path_1(marble));
    }
    else {
        stopMarbleAtEnd(marble, path_1, path_1_Length);
    }
}


const path_2 = document.querySelector("#path-2 path");
const path_2_Length = path_2.getTotalLength();

function roll_path_2(marble) {
    const point = path_2.getPointAtLength(marble.progress * path_2_Length);
    const x = point.x * scale + translateX;
    const y = point.y * scale + translateY;

    if (marble.lastX !== null && marble.lastY !== null) {
        const dx = x - marble.lastX;
        const dy = y - marble.lastY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const rotator = document.getElementById(marble.rotator_id);
        rotator.setAttribute(
            "transform",
            `translate(${x - marble.cp.cx} ${y - marble.cp.cy}) rotate(${marble.angle} ${marble.cp.cx} ${marble.cp.cy})`
        );
    }

    marble.lastX = x;
    marble.lastY = y;

    if (!marble.middleTriggered && marble.progress >= 0.5) {
        turn(middle_flip_flop);
        turn(left_flip_flop);
        marble.middleTriggered = true;
        marble.leftTriggered = false;
    }

    if (turner.flipped == 1 && !marble.turnerTriggered && marble.progress >= 0.76) {
        turn(turner);
        marble.turnerTriggered = true;
    }

    marble.progress += marble.speed;

    if (marble.progress < 1) {
        requestAnimationFrame(() => roll_path_2(marble));
    }
    else {
        stopMarbleAtEnd(marble, path_2, path_2_Length);
    }
}


const path_3 = document.querySelector("#path-3 path");
const path_3_Length = path_3.getTotalLength();
let equalizerTriggered = false;
let rightTriggered = false;

function roll_path_3(marble) {
  const point = path_3.getPointAtLength(marble.progress * path_3_Length);
  const x = point.x * scale + translateX;
  const y = point.y * scale + translateY;

  if (marble.lastX !== null && marble.lastY !== null) {
    const dx = x - marble.lastX;
    const dy = y - marble.lastY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const rotator = document.getElementById(marble.rotator_id);
    rotator.setAttribute(
      "transform",
      `translate(${x - marble.cp.cx} ${y - marble.cp.cy}) rotate(${marble.angle} ${marble.cp.cx} ${marble.cp.cy})`
    );
  }

  marble.lastX = x;
  marble.lastY = y;

  if (!marble.rightTriggered && marble.progress >= 0.45) {
    turn(right_flip_flop);
    turn(middle_flip_flop);
    marble.middleTriggered = false;
    marble.rightTriggered = true;
  }

  if (equalizer.flipped == -1 && !marble.equalizerTriggered && marble.progress >= 0.55) {
    turn(equalizer);
    marble.equalizerTriggered = true;
  }

  if (turner.flipped == 1 && !marble.turnerTriggered && marble.progress >= 0.76) {
    turn(turner);
    marble.turnerTriggered = true;
  }

  marble.progress += marble.speed;

  if (marble.progress < 1) {
    requestAnimationFrame(() => roll_path_3(marble));
  }
  else {
        stopMarbleAtEnd(marble, path_3, path_3_Length);
  }
}


const path_4 = document.querySelector("#path-4 path");
const path_4_Length = path_4.getTotalLength();

function roll_path_4(marble) {
  const point = path_4.getPointAtLength(marble.progress * path_4_Length);
  const x = point.x * scale + translateX;
  const y = point.y * scale + translateY;

  if (marble.lastX !== null && marble.lastY !== null) {
    const dx = x - marble.lastX;
    const dy = y - marble.lastY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const rotator = document.getElementById(marble.rotator_id);
    rotator.setAttribute(
      "transform",
      `translate(${x - marble.cp.cx} ${y - marble.cp.cy}) rotate(${marble.angle} ${marble.cp.cx} ${marble.cp.cy})`
    );
  }

  marble.lastX = x;
  marble.lastY = y;

  if (!marble.rightTriggered && marble.progress >= 0.5) {
    turn(right_flip_flop);
    turn(middle_flip_flop);
    marble.middleTriggered = false;
    marble.rightTriggered = true;
  }

  if (turner.flipped == 1 && !marble.turnerTriggered && marble.progress >= 0.76) {
    turn(turner);
    marble.turnerTriggered = true;
  }

  marble.progress += marble.speed;

  if (marble.progress < 1) {
    requestAnimationFrame(() => roll_path_4(marble));
  }
  else {
        stopMarbleAtEnd(marble, path_4, path_4_Length);
  }
}


const path_5 = document.querySelector("#path-5 path");
const path_5_Length = path_5.getTotalLength();

function roll_path_5(marble) {
  const point = path_5.getPointAtLength(marble.progress * path_5_Length);
  const x = point.x * scale + translateX;
  const y = point.y * scale + translateY;

  if (marble.lastX !== null && marble.lastY !== null) {
    const dx = x - marble.lastX;
    const dy = y - marble.lastY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const rotator = document.getElementById(marble.rotator_id);
    rotator.setAttribute(
      "transform",
      `translate(${x - marble.cp.cx} ${y - marble.cp.cy}) rotate(${marble.angle} ${marble.cp.cx} ${marble.cp.cy})`
    );
  }

  marble.lastX = x;
  marble.lastY = y;

  if (!marble.rightTriggered && marble.progress >= 0.5) {
    turn(right_flip_flop);
    turn(middle_flip_flop);
    marble.middleTriggered = false;
    marble.rightTriggered = true;
  }

  marble.progress += marble.speed;

  if (marble.progress < 1) {
    requestAnimationFrame(() => roll_path_5(marble));
  }
    else {
        stopMarbleAtEnd(marble, path_5, path_5_Length);
    }
}

const path_6 = document.querySelector("#path-6 path");
const path_6_Length = path_6.getTotalLength();

function roll_path_6(marble) {
  const point = path_6.getPointAtLength(marble.progress * path_6_Length);
  const x = point.x * scale + translateX;
  const y = point.y * scale + translateY;

  if (marble.lastX !== null && marble.lastY !== null) {
    const dx = x - marble.lastX;
    const dy = y - marble.lastY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const rotator = document.getElementById(marble.rotator_id);
    rotator.setAttribute(
      "transform",
      `translate(${x - marble.cp.cx} ${y - marble.cp.cy}) rotate(${marble.angle} ${marble.cp.cx} ${marble.cp.cy})`
    );
  }

  marble.lastX = x;
  marble.lastY = y;

  if (!marble.rightTriggered && marble.progress >= 0.45) {
    turn(right_flip_flop);
    marble.rightTriggered = true;
  }

  marble.progress += marble.speed;

  if (marble.progress < 1) {
    requestAnimationFrame(() => roll_path_6(marble));
  }
    else {
        stopMarbleAtEnd(marble, path_6, path_6_Length);
    }
}

const path_7 = document.querySelector("#path-7 path");
const path_7_Length = path_7.getTotalLength();

function roll_path_7(marble) {
  const point = path_7.getPointAtLength(marble.progress * path_7_Length);
  const x = point.x * scale + translateX;
  const y = point.y * scale + translateY;

  if (marble.lastX !== null && marble.lastY !== null) {
    const dx = x - marble.lastX;
    const dy = y - marble.lastY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const rotator = document.getElementById(marble.rotator_id);
    rotator.setAttribute(
      "transform",
      `translate(${x - marble.cp.cx} ${y - marble.cp.cy}) rotate(${marble.angle} ${marble.cp.cx} ${marble.cp.cy})`
    );
  }

  marble.lastX = x;
  marble.lastY = y;

  if (!marble.rightTriggered && marble.progress >= 0.45) {
    turn(right_flip_flop);
    marble.rightTriggered = true;
  }

  marble.progress += marble.speed;

  if (marble.progress < 1) {
    requestAnimationFrame(() => roll_path_7(marble));
  }
    else {
        stopMarbleAtEnd(marble, path_7, path_7_Length);
    }
}

const path_8 = document.querySelector("#path-8 path");
const path_8_Length = path_8.getTotalLength();

function roll_path_8(marble) {
    const point = path_8.getPointAtLength(marble.progress * path_8_Length);
    const x = point.x * scale + translateX;
    const y = point.y * scale + translateY;

    if (marble.lastX !== null && marble.lastY !== null) {
        const dx = x - marble.lastX;
        const dy = y - marble.lastY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const rotator = document.getElementById(marble.rotator_id);
        rotator.setAttribute(
            "transform",
            `translate(${x - marble.cp.cx} ${y - marble.cp.cy}) rotate(${marble.angle} ${marble.cp.cx} ${marble.cp.cy})`
        );
    }

    marble.lastX = x;
    marble.lastY = y;

    if (!marble.rightTriggered && marble.progress >= 0.45) {
        turn(right_flip_flop);
        marble.rightTriggered = true;
    }

    if(marble.equalizerTriggered == false && marble.progress >= 0.6){
        turn(equalizer);
        marble.equalizerTriggered = true;
    }

    marble.progress += marble.speed;

    if (marble.progress < 1) {
        requestAnimationFrame(() => roll_path_8(marble));
    }
    else {
        stopMarbleAtEnd(marble, path_8, path_8_Length);
    }
}

function release_marble(marble) {
         if (right_flip_flop.flipped == -1 && middle_flip_flop.flipped == -1 && left_flip_flop.flipped == -1) 
        roll_path_1(marble);
    else if (right_flip_flop.flipped == -1 && middle_flip_flop.flipped == -1 && left_flip_flop.flipped ==  1)
        roll_path_2(marble);
    else if (right_flip_flop.flipped == -1 && middle_flip_flop.flipped ==  1 && left_flip_flop.flipped == -1 && equalizer.flipped == -1)
        roll_path_3(marble);
    else if (right_flip_flop.flipped == -1 && middle_flip_flop.flipped ==  1 && left_flip_flop.flipped == -1 && equalizer.flipped ==  1 && turner.flipped == -1)
        roll_path_4(marble);
    else if (right_flip_flop.flipped == -1 && middle_flip_flop.flipped ==  1 && left_flip_flop.flipped == -1 && equalizer.flipped ==  1 && turner.flipped ==  1)
        roll_path_5(marble);
    else if (right_flip_flop.flipped ==  1 && middle_flip_flop.flipped == -1 && left_flip_flop.flipped == -1 && equalizer.flipped ==  1 && turner.flipped ==  1)
        roll_path_6(marble);
    else if (right_flip_flop.flipped ==  1 && middle_flip_flop.flipped == -1 && left_flip_flop.flipped == -1 && equalizer.flipped ==  1 && turner.flipped == -1)
        roll_path_7(marble);
    else if (right_flip_flop.flipped ==  1 && middle_flip_flop.flipped == -1 && left_flip_flop.flipped == -1 && equalizer.flipped == -1)
        roll_path_8(marble);
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
        this.speed = options.speed ?? 0.003;
        this.leftTriggered = options.leftTriggered ?? false;
        this.middleTriggered = options.middleTriggered ?? false;
        this.rightTriggered = options.rightTriggered ?? false;
        this.turnerTriggered = options.turnerTriggered ?? false;
        this.equalizerTriggered = options.equalizerTriggered ?? false;
    }
}

const boardGame = document.getElementById("board-game");
const marbles = [];

for (let i = 1; i <= 20; i++) {
    const rotatorId = `marble-${i}-roller`;
    const marbleId = `marble-${i}`;
    const roller = document.createElementNS("http://www.w3.org/2000/svg", "g");
    roller.setAttribute("id", rotatorId);
    const marbleElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
    marbleElement.setAttribute("class", "marble");
    marbleElement.setAttribute("id", marbleId);
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", "24.562");
    circle.setAttribute("cy", "-31.665");
    circle.setAttribute("r", "12");
    marbleElement.appendChild(circle);
    roller.appendChild(marbleElement);
    boardGame.appendChild(roller);
    const marble = new Marble(rotatorId, marbleId, {
        progress: 0,
        speed: 0.003,
        lastX: null,
        lastY: null,
        leftTriggered: false,
        middleTriggered: false,
        rightTriggered: false,
        turnerTriggered: false,
        equalizerTriggered: false
    });
    marble.cp = getRotatingPoint(marble);
    marbles.push(marble);
}

let i=0;
async function roll() {
    document.removeEventListener('keydown', enterListener);

    if (i >= marbles.length) return; 

    await release_marble(marbles[i]);
    i += 1;
}

function stopMarbleAtEnd(marble, path, pathLength) {
    marble.progress = 1;
    const point = path.getPointAtLength(pathLength);
    const x = point.x * scale + translateX;
    const y = point.y * scale + translateY;

    const rotator = document.getElementById(marble.rotator_id);
    rotator.setAttribute(
        "transform",
        `translate(${x - marble.cp.cx} ${y - marble.cp.cy}) rotate(${marble.angle} ${marble.cp.cx} ${marble.cp.cy})`
    );
    document.addEventListener('keydown', enterListener);
}


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
    rotation_speed: 3,
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
    rotation_speed: 3,
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
        this.rotation_speed = 1;
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


const set = [
    {l: -1, m: -1, r: -1}, 
    {l:  1, m: -1, r: -1},
    {l: -1, m:  1, r: -1},
    {l: -1, m: -1, r:  1}
];

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function iterations(){
    for(let i=0; i <= 100; i++){
        const promises = [];
        if(set[i%4].l !== left_flip_flop.flipped)
            promises.push(turn(left_flip_flop));
        if(set[i%4].m !== middle_flip_flop.flipped)
            promises.push(turn(middle_flip_flop));
        if(set[i%4].r !== right_flip_flop.flipped)
            promises.push(turn(right_flip_flop));

        await Promise.all(promises); 
        await delay(1000);
    }
}

iterations();

document.getElementById(turner.element_id).addEventListener("click", () => turn(turner));
document.getElementById(equalizer.element_id).addEventListener("click", () => turn(equalizer));

async function push_trigger() {
    trigger_pusher.style.transform = 'scale(0.95) translate(0px, -0.2px)';
    pusher_trigger.style.transform = 'scale(1.5) translate(0px, -0.1px)';
    await delay(250);
    trigger_pusher.style.transform = '';
    pusher_trigger.style.transform = '';
}

trigger.addEventListener('mousedown', push_trigger);
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        push_trigger();
    }
});
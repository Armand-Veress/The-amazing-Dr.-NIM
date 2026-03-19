async function loadGame_background(it){
    await removeAllMarbles();
    configure_DrNIM(9, 1, true);
    determineGoal(0);

    for (let i = 0; i < 15; i++) {
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
        if(i <= 6)
            position_in_endSlot(marble, i+1);
        else
            position_in_startSlot(marble, i-7);
    }

    try{
        await delay(1500);
        signal = false;
        push_trigger();
        release_marble(7, 15);
        advanceSlots(15, 8);
        await waitForSignal();

        startFlip_FlopCounter();
    }
    catch(error){
        console.log(error);
    }

    function startFlip_FlopCounter(){
        const set = [
            {l: -1, m: -1, r: -1}, 
            {l:  1, m: -1, r: -1},
            {l: -1, m:  1, r: -1},
            {l: -1, m: -1, r:  1}
        ];

        async function iterations(){
            for(let i=0; i <= it; i++){
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
    }
}

loadGame_background(1000);
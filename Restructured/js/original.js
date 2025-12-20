async function loadGame_originalDrNIM(marbleNum){ // just as the original physical model of Dr. NIM
    await removeAllMarbles();
    determineGoal(0);
    
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
            unlock_pieces();
            const keydownPromise = waitForKey('Enter');
            const mousedownPromise = waitForEvent(trigger, 'mousedown');

            await Promise.race([keydownPromise, mousedownPromise]);

            try{
                signal = false;
                lock_pieces();
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


loadGame_originalDrNIM(15);
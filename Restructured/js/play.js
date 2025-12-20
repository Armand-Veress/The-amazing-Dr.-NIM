async function loadGame_playDrNIM(marbleNum, goal, playersTurn){ // play against Dr. NIM
    await removeAllMarbles();
    determineGoal(goal);
    configure_DrNIM(marbleNum, goal, playersTurn); 

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
    
    let lastTurn;

    for(let i = 0; i < marbleNum; i++) {
        if(signal && turner.flipped == -1)
            playersTurn = true;
        else if(signal && turner.flipped == 1)
            playersTurn = false;
           
        if(playersTurn && signal && !paused) {
            nextTurn = turner.flipped;

            const keydownPromise = waitForKey('Enter');
            const mousedownPromise = waitForEvent(trigger, 'mousedown');
            const nextTurnPromise = waitForEvent(document.getElementById(turner.element_id), 'click');

            const solved = await Promise.race([
                tagPromise(keydownPromise, 'keydown'),
                tagPromise(mousedownPromise, 'mousedown'),
                tagPromise(nextTurnPromise, 'turnerClick')
            ]);

            if(solved.source == 'turnerClick'){
                turn(turner);
                await delay(400);
            }

            if(turner.flipped != nextTurn){
                playersTurn = !playersTurn;
            }

            try{
                signal = false;
                push_trigger();
                release_marble(i, marbleNum);
                advanceSlots(marbleNum, i + 1);

                lastTurn = playersTurn;
            }
            catch(error){
                console.log(error);
            }
        }
        else if(!playersTurn && signal && !paused){
            try{
                signal = false;
                push_trigger();
                release_marble(i, marbleNum);
                advanceSlots(marbleNum, i + 1);
            }
            catch(error){
                console.log(error);
            }
            
            lastTurn = playersTurn;
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

    await waitForSignal();
    if(goal == 1){
        if(lastTurn == true)
            alert("Game ended: You win!");
        else
            alert("Game ended: Dr. NIM wins!");
    }
    if(goal == -1){
        if(lastTurn == false)
            alert("Game ended: You win!");
        else
            alert("Game ended: Dr. NIM wins!");
    }
}

loadGame_playDrNIM(15, 1, true); 
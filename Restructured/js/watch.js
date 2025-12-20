async function loadGame_watchDrNIM(marbleNum, goal){ // watch Dr. NIM play against himself
    await removeAllMarbles();
    determineGoal(goal);
    configure_DrNIM(marbleNum, goal, false); 

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
    
    let DrNIMturn = 1; // 1- Dr. NIM 1 starts first; 2 - Dr. NIM 2's turn
    let lastTurn;

    await delay(2000);

    for(let i = 0; i < marbleNum; i++) {   
        if(signal){
            if(turner.flipped == -1){
                await delay(1000);
                turn(turner);
                await delay(600);
            }

            try{
                signal = false;
                push_trigger();
                release_marble(i, marbleNum);
                advanceSlots(marbleNum, i + 1);
            }
            catch(error){
                console.log(error);
            }
            
            lastTurn = DrNIMturn;
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
        if(lastTurn == 1)
            alert("Game ended: Dr. NIM 1 wins!");
        else
            alert("Game ended: Dr. NIM 2 wins!");
    }
    if(goal == -1){
        if(lastTurn == 2)
            alert("Game ended: Dr. NIM 1 wins!");
        else
            alert("Game ended: Dr. NIM 2 wins!");
    }
}

loadGame_watchDrNIM(15, -1);
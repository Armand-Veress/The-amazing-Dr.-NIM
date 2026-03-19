pauseBtn.style.display = "flex";

const rawData = localStorage.getItem('Parameters');

if (rawData) {
    const param = JSON.parse(rawData);

    const marbleNum = param.marbles;
    const goal = param.goal;
    const playersTurn = param.turn;
    const impossible = param.impossible;
    
    loadGame_playDrNIM(marbleNum, goal, playersTurn, impossible); 
} else {
    console.log("Missing configuration parameters...");
}

async function loadGame_playDrNIM(marbleNum, goal, playersTurn, impossible){ // play against Dr. NIM
    await removeAllMarbles();
    determineGoal(goal);
    configure_DrNIM(marbleNum, goal, playersTurn, impossible); 

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
    const yourTurnLabel = document.getElementById("your-turn");
    const nimTurnLabel = document.getElementById("nim-turn");

    if(impossible == true){
        window.addEventListener("keydown", equalListener);
        document.getElementById(equalizer.element_id).addEventListener("click", equalizerListener);
    }

    let firstTurn = playersTurn;;
    let marblesRolled = 0;
    for(let i = 0; i < marbleNum; i++) {
        if(impossible == true && firstTurn == true)
            playersTurn = true;
        else if(signal && turner.flipped == -1)
            playersTurn = true;
        else if(signal && turner.flipped == 1)
            playersTurn = false;

        if(playersTurn == true){
            yourTurnLabel.style.display = "flex";
            nimTurnLabel.style.display = "none";
        }
        if(playersTurn == false){
            yourTurnLabel.style.display = "none";
            nimTurnLabel.style.display = "flex";
        }
           
        if(playersTurn && signal && !paused) {
            nextTurn = turner.flipped;

            const enterPromise = waitForKey('Enter');
            const spacebarPromise = waitForKey(' ');
            const rollPromise = Promise.race([
                tagPromise(enterPromise, 'roll'),
                tagPromise(waitForEvent(trigger, 'mousedown'), 'roll'),
            ]);
            const nextTurnPromise = Promise.race([
                tagPromise(spacebarPromise, 'nextTurn'),
                tagPromise(waitForEvent(document.getElementById(turner.element_id), 'mousedown'), 'nextTurn'),
            ]);
    

            const solved = await Promise.race([
                tagPromise(rollPromise, 'roll'),
                tagPromise(nextTurnPromise, 'nextTurn'),
            ]);

            window.removeEventListener("keydown", equalListener);
            document.getElementById(equalizer.element_id).removeEventListener("click", equalizerListener);

            if(solved.source == 'roll'){
                if(impossible == true && firstTurn == true){
                    marblesRolled = i;
                    console.log(marblesRolled);
                }
                if(marblesRolled == 3){
                    paused = true;
                    myAlert("Illegal move!", "You can only roll up to 3 marbles per turn! Switch the turner-lever to end your turn.");
                    i = i-1;
                    continue;
                }
            }

            if(solved.source == 'nextTurn'){
                if(impossible == true && firstTurn == true && marblesRolled == 0){
                    turn(turner);
                    i = i-1;
                    continue;
                }
                else if(marblesRolled == 0){
                    paused = true;
                    myAlert("Illegal move!", "You must roll at least one marble before switching turns!");
                    i = i-1;
                    continue;
                }

                firstTurn = false;
                turn(turner);
                marblesRolled = -1;
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
                marblesRolled += 1;
            }
            catch(error){
                console.log(error);
            }
        }
        else if(!playersTurn && signal && !paused){
            await delay(1000);
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
            if(i >= 0 && marbles[i].pusherTriggered){
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
            myAlert("Game ended:", "You win!");
        else
            myAlert("Game ended:", "Dr. NIM wins!");
    }
    if(goal == -1){
        if(lastTurn == false)
            myAlert("Game ended:", "You win!");
        else
            myAlert("Game ended:", "Dr. NIM wins!");
    }
}
window.marbleNum = 12;
window.goal = 1;
window.playersTurn = true;
window.impossible = false;

document.addEventListener("DOMContentLoaded", () => {
 
/**
* START - Main menu
**/

    var mode = "none";
    const menuOverlay = document.getElementById("menu-overlay");
    const pdfViewer = document.getElementById("pdf-viewer");
    const rulesBox=document.getElementById("rules");
    
    const originalBtn = document.getElementById("original-btn");
    const playBtn = document.getElementById("play-dr-nim-btn");
    const watchBtn = document.getElementById("watch-dr-nim-btn");
    const rulesBtn = document.getElementById("rules-btn");
    const closeRules=document.getElementById("close-rules");
    const turnChoice = document.getElementById("turn-choice");
    const impossibleChoice = document.getElementById("impossible-choice");

    if (originalBtn) {
        originalBtn.onclick = () => {
            window.location.search = "?:original";
        };
    }
    
    if (playBtn) {
        playBtn.onclick = () => {
            mode = "play";
            menuOverlay.style.display = "none";
            submenu.style.display = "flex";
        };
    }
    
    if (watchBtn) {
        watchBtn.onclick = () => {
            mode = "watch";
            menuOverlay.style.display = "none";
            submenu.style.display = "flex";

            if(mode == "watch"){
                turnChoice.style.display = "none";
                impossibleChoice.style.display = "none";
            }
        };
    }
    
    rulesBtn.addEventListener("click", () => {
        menuOverlay.style.display="none";
        rulesBox.style.display="block";
    });
    
    closeRules.addEventListener("click",()=>{
        menuOverlay.style.display="flex";
        rulesBox.style.display="none";
    });
    
    
    if (query.includes('?:')) {
        menuOverlay.style.display = "none";
    } else {
        menuOverlay.style.display = "flex";
    }
    
    /**
     * END - Main menu
    **/
   
   /**
    * START - Submenu
   **/
  
    const submenu = document.getElementById("configurations-menu");
    const slider = document.getElementById('bar');
    const display = document.getElementById('marbleNum');
    const confirmBtn = document.getElementById("confirm");
  
    if (slider) {
        slider.oninput = function() {
            window.marbleNum = parseInt(this.value);
            if (display) display.innerText = this.value;
        };
    }
    
    document.querySelectorAll('#submenu-box input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                if (this.name === 'goal') window.goal = (this.value === "wins" ? 1 : -1);
                if (this.name === 'turn') window.playersTurn = (this.value === "true");
                if (this.name === 'impossible') window.impossible = (this.value === "true");
            }
        });
    });
    
    if (confirmBtn) {
        confirmBtn.onclick = () => {
            const param = {
                marbles: window.marbleNum,
                goal: window.goal,
                turn: window.playersTurn,
                impossible: window.impossible
            };
            
            localStorage.setItem('Parameters', JSON.stringify(param));
            
            window.location.search = "?:" + mode;
        };
    }
    
/**
* END - Submenu
**/ 
   
/**
* START - Pause menu
*/
  
    const board = document.getElementById("board");
    const pauseBtn=document.getElementById("pauseBtn");
    const menuOverlayPause=document.getElementById("menu-overlay-pause");
    const newGameBtn = document.getElementById("new-game");
    const continueBtn = document.getElementById("continue")
    const manualBtn = document.getElementById("manual");
    const splitPdf = document.getElementById("split-pdf");
    const closePdf = document.getElementById("close-pdf");
       
    pauseBtn.addEventListener("click",()=>{
        menuOverlayPause.style.display="flex";
        paused = true;
    });

    newGameBtn.addEventListener("click",()=>{
        menuOverlayPause.style.display="none";
        paused = true;
        menuOverlay.style.display="flex";
        paused = true ;
      
    });

    continueBtn.addEventListener("click", () => {
        menuOverlayPause.style.display = "none";
        paused = false; 
    });

    manual.addEventListener("click", () => {
        menuOverlayPause.style.display="none";
        pdfViewer.style.display = "flex";
        paused = true;
    });

    splitPdf.addEventListener('click', () => {
        board.classList.toggle('split');
        pdfViewer.classList.toggle('split');
    });
       
    closePdf.addEventListener("click", () => {
        pdfViewer.style.display = "none";
        pdfViewer.setAttribute("class", "center");
        board.setAttribute("class", "center");
        paused = false;
    });
       
       
   
/**
* END - Pause menu
**/

    const infoBtn = document.getElementById('info-help');
    const tutorialOverlay = document.getElementById('tutorial-svg');

    infoBtn.addEventListener('click', () => {
        tutorialOverlay.classList.toggle('hidden');
    });

});






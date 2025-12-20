document.addEventListener("DOMContentLoaded", () => {

    const menuOverlay = document.getElementById("menu-overlay");
    const originalBtn = document.getElementById("original-btn");
  
    const rulesBtn = document.getElementById("rules-btn");
    
    const rulesBox=document.getElementById("rules");
    const closeRules=document.getElementById("close-rules");
    const pauseBtn=document.getElementById("pauseBtn");
    const playDrNim = document.getElementById("play-dr-nim-btn");
    const watchDrNim = document.getElementById("watch-dr-nim-btn");
    const pdfViewer = document.getElementById("pdf-viewer");
    const closePdf = document.getElementById("close-pdf");

    if (query.includes('?:')) {
        menuOverlay.style.display = "none";
    } else {
        menuOverlay.style.display = "flex";
    }

    originalBtn.addEventListener("click", () => {
        pdfViewer.style.display = "flex";
        const board = document.getElementById("board");
        board.setAttribute("class", "opened-manual");
        menuOverlay.style.display="none";
    });

    closePdf.addEventListener("click", () => {
        pdfViewer.style.display = "none";
        const board = document.getElementById("board");
        board.setAttribute("class", "closed-manual");
    });
    
    rulesBtn.addEventListener("click", () => {
    
        menuOverlay.style.display="none";
        rulesBox.style.display="block";
    });

    closeRules.addEventListener("click",()=>{
        menuOverlay.style.display="flex";
        rulesBox.style.display="none";
    });

    pauseBtn.addEventListener("click",()=>{
        menuOverlay.style.display="flex";
    });

    originalBtn.addEventListener("click", () => {
        window.location.search = "?:original";
    });

    playDrNim.addEventListener("click", () => {
        window.location.search = "?:play";
    });

    watchDrNim.addEventListener("click", () => {
        window.location.search = "?:watch";
    });
  

    pauseBtn.addEventListener("click",()=>{
        menuOverlay.style.display="flex";
    });



    const infoBtn = document.getElementById('info-help');
    const tutorialOverlay = document.getElementById('tutorial-svg');

    infoBtn.addEventListener('click', () => {
        tutorialOverlay.classList.toggle('hidden');
    });

});

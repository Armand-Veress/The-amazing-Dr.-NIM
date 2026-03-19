# The amazing Dr. NIM - Digital Recreation as a browser-game

This repository contains a Software Engineering university-project following all stages of a development pipeline, from requirements engineering and logical modeling to interactive web deployment. The project is focused on the digital recreation of the 1960s mechanical computer toy, Dr. NIM, and was developed as a collaborative effort to bridge the gap between a 60-year-old hardware-based logic system and a modern, interactive web application.

## What is Dr. NIM?
The game is a variant of NIM, where players compete to avoid taking the last object. In this digital version, the mechanical logic is translated into a precise algorithmic engine that plays optimally against the user. The game also serves as a good study object in computational or algorithmic thinking courses for children and was sold in its original form alongside a very thorough and educational manual, which was incorporated in the project. (Link to original manual: https://www.kareltherobot.ch/website/amazingdrnim.html)

## Tech Stack & Tools
* **Logic & Game behaviour:** Vanilla JavaScript (ES6+)
* **Interface:** HTML5 & CSS
* **Vector Graphics:** All visual components (including the board, interactive levers, quick (i) tutorial & the hidden paths that the marbles follow when rolling) were custom-designed using the online tool Boxy-SVG. This ensured a proportional and scalable look that faithfully replicates the original plastic toy's appearance.
* **Animations:** Hardcoded CSS-animations & JavaScript-controlled state transitions using requestAnimationFrame()

## Features
* **"Original Dr. NIM" gameplay mode:**
  A replica mode where the user can interact with the 2d representation in the same way as with the physical toy.
* **"Play against Dr. NIM" gameplay mode:**
  The standard mode where the user challenges the digital logic. Dr. NIM is programmed to follow the primitive computer logic outlined in the original 1960s manual.
* **"Dr. NIM vs Dr. NIM" gameplay mode:**
  Educational tool described in the original manual that allows the player to observe Dr. NIM playing against itself.
* **Optional PDF viewer of the original manual:**
  The manual can be toggled for every gameplay mode and displayed in parallel with the interactive game-board. Allows the user to study the educational contents while also interacting with Dr. NIM.
* **Configurations:**
  For the "Play against Dr. NIM" & "Dr. NIM vs Dr. NIM" gameplay modes, the user can choose the number of marbles, the goal of the game and who rolls the first marble.

## How to run locally
* Clone repository
* Open index.html in any modern browser
  
## Play directly in browser!
https://armand-veress.github.io/The-amazing-Dr.-NIM/

## Team members:
* Anghel Mihai-Alexandru
* Veress Armand




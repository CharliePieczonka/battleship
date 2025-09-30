import "./styles.css";
import { Player } from "./player.js"

let ships = [5, 4, 3, 3, 2];
let shipNames = ["carrier", "battleship", "destroyer", "submarine", "patrol"]
let toggleWaitTimes = 1; // 0 = off, 1 = on

const gameController = (function () {
    let player1, computer;
    let isPlayerTurn, isGameOver, isSetup;
    
    const beginSetup = () => {
        player1 = new Player();
        computer = new Player();
        populateComputerBoard();

        isPlayerTurn = true;
        isGameOver = false;
        isSetup = true;
        displayController.displayMessage("When you are ready, click the start button!");
        displayController.displayMessage("Please use the controls to move your ships to your desired positions.");
        displayController.renderPlayerBoard(player1);
        displayController.renderPlayerShips(false);
    }

    const startGame = () => {
        isSetup = false;
        displayController.clearGameInfo();
        displayController.toggleHideShips();
        displayController.displayMessage("The Game has begun!");
        displayController.displayMessage("-------------------------------");
        displayController.displayMessage("It is your turn.");
    }

    const populateComputerBoard = () => {
        console.log("populating computer board...");
        let played = 0;

        while(played < ships.length) {
            let orientations = ["horizontal", "vertical"];
            let randomX = Math.floor(Math.random() * computer.board.size);
            let randomY = Math.floor(Math.random() * computer.board.size);
            let randomOrientation = Math.floor(Math.random() * 2);

            let success = computer.board.playShip(randomX, randomY, ships[played], orientations[randomOrientation]);
            if(success === "success") {
                played++;
            }
        }

        computer.board.printBoard();
        displayController.renderComputerBoard(computer);

        // add eventlisteners for each cell
        let cells = document.querySelectorAll(".cell");
        cells.forEach(cell => {
            cell.addEventListener('click', () => {
                console.log(`player clicked cell (${cell.getAttribute('data-row')}, ${cell.getAttribute('data-col')})`);
                if(isPlayerTurn && !isGameOver && !isSetup) playerTurn(cell);
            });
        });
    }

    const populatePlayerBoard = () => {
        for(let i = 0; i < ships.length; i++) {
            let shipLength = ships[i];
            let shipName = shipNames[i];

            let orientationCheckbox = document.querySelector(`.hidden-check[ship="${shipName}"]`); // unchecked = horizontal, checked = vertical
            let orientation = orientationCheckbox.checked ? "vertical" : "horizontal";
            let xInput = document.querySelector(`input[ship="${shipName}"][coord="x"]`);
            let yInput = document.querySelector(`input[ship="${shipName}"][coord="y"]`);
            let xNum = xInput ? Number(xInput.value) - 1 : 0;
            let yNum = yInput ? Number(yInput.value) - 1 : 0;

            let success = player1.board.playShip(xNum, yNum, shipLength, orientation);
            if(success != "success") {
                player1.board.ships = [];
                player1.board.setCoordinates(); // clear the coordinates back to all 0s
                displayController.displayMessage("There is an error with your arrangement: " + success);
                return false;
            }
        }
        
        // if all ships have been played with no errors detected then the setup phase is over
        player1.board.printBoard();
        return true;
    }

    const computerTurn = () => {
        if(!isGameOver) {
            let randomX = -1;
            let randomY = -1;
            let shipId = "x";
            
            // note that this randomly selects from all squares -> as the game goes on this will take longer to find an unchosen square
            // TODO: keep track of unchosen squares separately and select from that list randomly
            while(shipId === "x" || shipId === "o") {
                randomX = Math.floor(Math.random() * player1.board.size);
                randomY = Math.floor(Math.random() * player1.board.size);
                shipId = player1.board.coordinates[randomY][randomX]; // [row][col] i.e. y = row, x = col.
            }

            let playerBoard = document.querySelector(".player-board");
            let cell = playerBoard.querySelector(`.cell[data-row="${randomY}"][data-col="${randomX}"]`);
            
            if(player1.board.receiveAttack(randomY, randomX)) {
                displayController.displayMessage(`Computer has hit ship ${shipId}!`);

                if(player1.board.ships[shipId-1].isSunk()) {
                    displayController.displayMessage(`Your ship ${shipId} has sunk!`);
                }

                if(player1.board.isGameOver()) {
                    displayController.displayMessage(`All of your ships have been sunk! You Lose!`);
                    isGameOver = true;
                    displayController.displayReset();
                }

                player1.board.coordinates[randomY][randomX] = "x";
                cell.textContent = "X";
                cell.style.backgroundColor = "red";
            }
            else {
                displayController.displayMessage('Miss.');
                player1.board.coordinates[randomY][randomX] = "o";
                cell.style.backgroundColor = "blue";
            }

            setTimeout(() => {
                displayController.displayMessage("-------------------------------");
                displayController.displayMessage("It is your turn.");
                isPlayerTurn = true;
            }, 1000 * toggleWaitTimes);
        }
    }

    const playerTurn = (cell) => {
        let row = cell.getAttribute('data-row');
        let col = cell.getAttribute('data-col');
        let shipId = computer.board.coordinates[row][col];
        console.log(`computer's board (${row}, ${col}) = ${shipId}`)

        if(shipId != "x" && shipId != "o") {
            if(computer.board.receiveAttack(row, col)) {
                displayController.displayMessage(`Player has hit battleship ${shipId}!`);

                if(computer.board.ships[shipId-1].isSunk()) {
                    displayController.displayMessage(`Computer ship ${shipId} has sunk!`);
                }

                if(computer.board.isGameOver()) {
                    displayController.displayMessage(`All computer ships have been sunk! You Win!`);
                    isGameOver = true;
                    displayController.displayReset();
                }

                computer.board.coordinates[row][col] = "x";
                cell.textContent = "X";
                cell.style.backgroundColor = "red";
            }
            else {
                displayController.displayMessage('Miss.');
                computer.board.coordinates[row][col] = "o";
                cell.style.backgroundColor = "blue";
            }

            isPlayerTurn = false;

            setTimeout(() => {
                if(!isGameOver) {
                    displayController.displayMessage("Computer's turn.");
                }
            }, 1000 * toggleWaitTimes);
           
            let computerThink = 1000 + Math.floor(Math.random() * 2000); // 1000 to wait out the first message, plus anywhere from 0-2 extra seconds of thinking.
            setTimeout(() => {
                computerTurn();
            }, computerThink * toggleWaitTimes);
        }
    }

    return { beginSetup, startGame, populateComputerBoard, populatePlayerBoard }
})();


const displayController = (function () {
    let gameInfo = document.querySelector(".game-info");
    let computerBoard = document.querySelector(".computer-board");
    let playerBoard = document.querySelector(".player-board");
    let coordinateInputs = document.querySelectorAll(".ship-coord");
    let rotateInputs = document.querySelectorAll(".rotate-button");

    // event listener so that anytime a coordinate value changes the display is updated
    coordinateInputs.forEach(input => {
        input.addEventListener('input', () => {
            renderPlayerShips(false);
        });
    });

    // prevent user from typing into any input, only let them use certain keys or the up/down arrows
    coordinateInputs.forEach(input => {
        input.addEventListener("keydown", function (e) {
        if (
            e.key === "ArrowUp" ||
            e.key === "ArrowDown" ||
            e.key === "Tab"
        ) {
            return;
        }

        // prevent all other key input
        e.preventDefault();
        });
    });
    

    // evenlistener for rotation
    rotateInputs.forEach(input => {
        input.addEventListener('click', () => {
            let toggle = input.nextElementSibling
            toggle.checked = toggle.checked ? false : true;
            renderPlayerShips(true);
        });
    });

    const renderComputerBoard = (computer) => {
        let size = computer.board.size;
        for(let i = size-1; i >= 0; i--) {
            let row = document.createElement("div");
            row.setAttribute("class", "row");
            
            for(let j = 0; j < size; j++) {
                let cell = document.createElement("div");
                cell.setAttribute("class", "cell");
                cell.setAttribute("data-row", i);
                cell.setAttribute("data-col", j);

                // print computer ship locations
                // cell.textContent = computer.board.coordinates[i][j];
                // if(cell.textContent === "0") {
                //     cell.textContent = "";
                // }
                
                row.appendChild(cell);
            }

            computerBoard.appendChild(row);
        }
    }

    const renderPlayerBoard = (player) => {
        let size = player.board.size;
        for(let i = size-1; i >= 0; i--) {
            let row = document.createElement("div");
            row.setAttribute("class", "row");
            
            for(let j = 0; j < size; j++) {
                let cell = document.createElement("div");
                cell.setAttribute("class", "cell");
                cell.setAttribute("data-row", i);
                cell.setAttribute("data-col", j);             
                row.appendChild(cell);
            }

            playerBoard.appendChild(row);
        }
    }

    // renders the ships on the players board
    const renderPlayerShips = (rotated) => {
        // blank slate
        let playerCells = playerBoard.querySelectorAll(".cell");
        playerCells.forEach(cell => cell.style.backgroundColor = "white");

        // for each ship
        for(let i = 0; i < ships.length; i++) {
            let shipLength = ships[i];
            let shipName = shipNames[i];
            let first = true;

            let xInput = document.querySelector(`input[ship="${shipName}"][coord="x"]`);
            let yInput = document.querySelector(`input[ship="${shipName}"][coord="y"]`);
            let xNum = xInput ? Number(xInput.value) - 1 : 0;
            let yNum = yInput ? Number(yInput.value) - 1 : 0;
            let orientation = document.querySelector(`.hidden-check[ship="${shipName}"]`); // unchecked = horizontal, checked = vertical
            let currCoord = playerBoard.querySelector(`div[data-row="${yNum}"][data-col="${xNum}"]`); 

            // from the starting cell, iterate over the length of the ship colouring in each one
            while (shipLength != 0) {
                if(rotated) {
                    // if the last movement was a rotation, and now the piece is out of bounds, untoggle the rotation and render it as it was before
                    if(xNum + shipLength > 10 && !orientation.checked) {
                        orientation.checked = true;
                    }

                    if(yNum + shipLength > 10 && orientation.checked) {
                        orientation.checked = false;
                    }
                }
                else {
                    // if it was not a rotation, and its out of bounds, decrement the respective value to bring it back in bounds
                    if(xNum + shipLength > 10 && !orientation.checked) {
                        xInput.value = xNum;
                        xNum--;
                        currCoord = playerBoard.querySelector(`div[data-row="${yNum}"][data-col="${xNum}"]`); 
                    }

                    if(yNum + shipLength > 10 && orientation.checked) {
                        yInput.value = yNum;
                        yNum--;
                        currCoord = playerBoard.querySelector(`div[data-row="${yNum}"][data-col="${xNum}"]`); 
                    }
                }
                
                // TODO: pick different colours for the ships
                if(first) {
                    currCoord.style.backgroundColor = "grey";
                    first = false;
                }
                else {
                    currCoord.style.backgroundColor = "lightgrey";
                }

                // drawing direction
                if(!orientation.checked) {
                    xNum++;
                }
                else {
                    yNum++;
                }
                
                currCoord = playerBoard.querySelector(`div[data-row="${yNum}"][data-col="${xNum}"]`); 
                shipLength--;
            }
        }
    }

    const displayMessage = (message) => {
        let newMsg = document.createElement("p");
        newMsg.innerText = message;
        gameInfo.prepend(newMsg);
    }

    const displayReset = () => {
        let resetButton = document.createElement("button");
        resetButton.setAttribute("class", "game-button");
        resetButton.setAttribute("id", "reset-button");
        resetButton.textContent = "Reset Game";

        resetButton.addEventListener("click", () => {
            clearGameInfo();
            clearComputerBoard();
            clearPlayerBoard();
            toggleHideShips();
            gameController.beginSetup();
        });

        gameInfo.prepend(resetButton);
    }

    const clearGameInfo = () => {
        gameInfo.innerHTML = "";
    }

    const clearComputerBoard = () => {
        computerBoard.innerHTML = "";
    }

    const clearPlayerBoard = () => {
        playerBoard.innerHTML = "";
    }

    const toggleCoordinateInputs = () => {
         let coordinateInputs = document.querySelectorAll(".ship-coord");
         
        coordinateInputs.forEach(input => {
            input.disabled = input.disabled ? false : true;
        });

        rotateInputs.forEach(button => {
            button.disabled = button.disabled ? false : true;
        });
    }

    const toggleHideShips = () => {
        let main = document.querySelector(".main-container");
        let shipsDiv = main.querySelector(".right");

        if(shipsDiv.hidden) {
            main.style.gridTemplateColumns = "1fr 4fr 2fr";
            shipsDiv.hidden = false;
        }
        else {
            main.style.gridTemplateColumns = "1fr 3fr";
            shipsDiv.hidden = true;
        }
    }

    return { renderComputerBoard, renderPlayerBoard, renderPlayerShips, displayMessage, displayReset, clearGameInfo, toggleCoordinateInputs, toggleHideShips }
})();

let beginButton = document.querySelector("#begin-button");
let startButton = document.querySelector("#start-button");
beginButton.addEventListener("click", () => {
    displayController.clearGameInfo();
    displayController.toggleCoordinateInputs();
    gameController.beginSetup();
    startButton.hidden = false;
});


startButton.addEventListener("click", () => {
    let playerBoardOk = gameController.populatePlayerBoard();
    if(playerBoardOk) gameController.startGame();
});

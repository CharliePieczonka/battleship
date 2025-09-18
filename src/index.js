import "./styles.css";
import { Player } from "./player.js"

let ships = [5, 4, 3, 3, 2];
let shipNames = ["carrier", "battleship", "destroyer", "submarine", "patrol"]

const gameController = (function () {
    let player1, computer;
    let isPlayerTurn, isGameOver, isSetup;

    const startGame = () => {
        player1 = new Player();
        computer = new Player();
        populateComputerBoard();

        isPlayerTurn = true;
        isGameOver = false;
        isSetup = true;
        displayController.displayMessage("When you are ready, click the start button!");
        displayController.displayMessage("Please use the controls to move your ships to your desired positions.");
        displayController.renderPlayerBoard(player1);
        displayController.renderPlayerShips();
    }

    const populateComputerBoard = () => {
        console.log("populating computer board...")
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

            //isPlayerTurn = false;
        }
        
    }

    return { startGame, populateComputerBoard }
})();


const displayController = (function () {
    let gameInfo = document.querySelector(".game-info");
    let computerBoard = document.querySelector(".computer-board");
    let playerBoard = document.querySelector(".player-board");
    let coordinateInputs = document.querySelectorAll(".ship-coord");

    // event listener so that anytime a coordinate value changes the display is updated
    coordinateInputs.forEach(input => {
        input.addEventListener('input', () => {
            renderPlayerShips();
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

                cell.textContent = computer.board.coordinates[i][j];
                if(cell.textContent === "0") {
                    cell.textContent = "";
                }
                
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
    const renderPlayerShips = () => {
        let playerCells = playerBoard.querySelectorAll(".cell");
        playerCells.forEach(cell => cell.style.backgroundColor = "white");

        for(let i = 0; i < ships.length; i++) {
            let shipLength = ships[i];
            let shipName = shipNames[i];
            let first = true;

            let xInput = document.querySelector(`input[ship="${shipName}"][coord="x"]`);
            let yInput = document.querySelector(`input[ship="${shipName}"][coord="y"]`);
            let xNum = xInput ? Number(xInput.value) - 1 : 0;
            let yNum = yInput ? Number(yInput.value) - 1 : 0;
            let currCoord = playerBoard.querySelector(`div[data-row="${yNum}"][data-col="${xNum}"]`); 

            while (shipLength != 0) {
                if(xNum + shipLength > 10) {
                    xInput.value = xNum;
                    xNum--;
                    currCoord = playerBoard.querySelector(`div[data-row="${yNum}"][data-col="${xNum}"]`); 
                }

                if(first) {
                    currCoord.style.backgroundColor = "grey";
                    first = false;
                }
                else {
                    currCoord.style.backgroundColor = "lightgrey";
                }

                xNum++; // ships are only horizontal for now; will eventually need to allow rotating and checking that
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
            //clearPlayerBoard();
            gameController.startGame();
        });

        gameInfo.prepend(resetButton);
    }

    const clearGameInfo = () => {
        gameInfo.innerHTML = "";
    }

    const clearComputerBoard = () => {
        computerBoard.innerHTML = "";
    }

    const toggleCoordinateInputs = () => {
        coordinateInputs.forEach(input => {
            input.disabled = input.disabled ? false : true;
        });
    }

    return { renderComputerBoard, renderPlayerBoard, renderPlayerShips, displayMessage, displayReset, clearGameInfo, toggleCoordinateInputs }
})();

let startButton = document.querySelector("#begin-button")
startButton.addEventListener("click", () => {
    displayController.clearGameInfo();
    displayController.toggleCoordinateInputs();
    gameController.startGame();
});


//displayController.testMethod();

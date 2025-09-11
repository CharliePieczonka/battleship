import "./styles.css";
import { Player } from "./player.js"

const gameController = (function () {
    let ships = [5, 4, 3, 3, 2];
    let player1, computer;
    let isPlayerTurn, isGameOver;

    const startGame = () => {
        player1 = new Player();
        computer = new Player();
        populateComputerBoard();

        isPlayerTurn = true;
        isGameOver = false;
        displayController.displayMessage("Player Turn");
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
                if(isPlayerTurn && !isGameOver) playerTurn(cell);
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

    const resetGame = () => {

    }

    return { startGame, populateComputerBoard, resetGame }
})();


const displayController = (function () {
    let gameInfo = document.querySelector(".game-info");
    let computerBoard = document.querySelector(".computer-board");
    let playerBoard = document.querySelector(".player-board");

    const renderComputerBoard = (computer) => {
        let size = computer.board.size;
        for(let i = size-1; i >= 0; i--) {
            let row = document.createElement("div");
            row.setAttribute("class", "row");
            row.setAttribute("id", "row-" + i);
            
            for(let j = 0; j < size; j++) {
                let cell = document.createElement("div");
                cell.setAttribute("class", "cell");
                cell.setAttribute("id", "cell-" + i + "-" + j);
                cell.setAttribute("data-row", i);
                cell.setAttribute("data-col", j);

                //cell.textContent = "cell-" + i + "-" + j;
                cell.textContent = computer.board.coordinates[i][j];
                if(cell.textContent === "0") {
                    cell.textContent = "";
                }
                
                row.appendChild(cell);
            }

            computerBoard.appendChild(row);
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

    return { renderComputerBoard, displayMessage, displayReset, clearGameInfo }
})();

let startButton = document.querySelector("#start-button")
startButton.addEventListener("click", () => {
    displayController.clearGameInfo();
    gameController.startGame();
});


//displayController.testMethod();

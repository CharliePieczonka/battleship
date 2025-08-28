import "./styles.css";
import { Player } from "./player.js"

const gameController = (function () {
    let ships = [5, 4, 3, 3, 2];
    let player1, computer;
    let isPlayerTurn;

    const startGame = () => {
        player1 = new Player();
        computer = new Player();
        populateComputerBoard();

        isPlayerTurn = true;
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
                if(isPlayerTurn) playerTurn(cell.getAttribute('data-row'), cell.getAttribute('data-col'));
            });
        });
    }

    const playerTurn = (row, col) => {
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
                }

                computer.board.coordinates[row][col] = "x";
            }
            else {
                displayController.displayMessage('Miss.');
                computer.board.coordinates[row][col] = "o";
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
        gameInfo.appendChild(newMsg);
    }

    return { renderComputerBoard, displayMessage }
})();

let startButton = document.querySelector("#start-button")
startButton.addEventListener("click", () => {
    gameController.startGame();
    let startInfoDiv = document.querySelector(".starting-info");
    startInfoDiv.style.display = "none";
});


//displayController.testMethod();

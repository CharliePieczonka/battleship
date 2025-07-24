import "./styles.css";
import { Player } from "./player.js"

const gameController = (function () {
    let ships = [5, 4, 3, 3, 2];
    let player1, computer;

    const startGame = () => {
        player1 = new Player();
        computer = new Player();
        populateComputerBoard();
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
    }

    return { startGame, populateComputerBoard }
})();


const displayController = (function () {
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

    const testMethod = () => {
        console.log("test success");
    }

    return { renderComputerBoard, testMethod }
})();



gameController.startGame();
displayController.testMethod();

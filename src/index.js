import "./styles.css";
import { Player } from "./player.js"

const gameController = (function () {
    let ships = [5, 4, 3, 3, 2];
    let player, computer;

    const startGame = () => {
        player = new Player();
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
    }

    return { startGame, populateComputerBoard }
})();


const displayController = (function () {

});



gameController.startGame();
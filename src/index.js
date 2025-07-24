import "./styles.css";
import { Gameboard } from "./gameboard.js"

let board = new Gameboard()
console.log(board.playShip(8, 2, 4, "horizontal"));
console.log(board.playShip(4, 4, 2, "vertical"));
console.log(board.playShip(1, 7, 3, "vertical"));
// console.log(board.playShip(1, 9, 3, "horizontal"));
board.printBoard()
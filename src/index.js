import "./styles.css";
import { Gameboard } from "./gameboard.js"

let board = new Gameboard()
console.log(board.playShip(5, 2, 3, "horizontal"));
// console.log(board.playShip(4, 4, 2, "vertical"));
// console.log(board.playShip(1, 7, 3, "vertical"));

console.log("hit: " + board.receiveAttack(5, 2));
console.log("hit: " + board.receiveAttack(6, 2));
console.log("hit: " + board.receiveAttack(7, 2));

console.log("is gameover? " + board.isGameOver());

console.log(board.ships[0].numHits)

board.printBoard()
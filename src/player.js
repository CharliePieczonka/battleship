import { Gameboard } from "./gameboard.js"

class Player {
    board;

    constructor() {
        this.board = new Gameboard();
    }
}

export { Player }
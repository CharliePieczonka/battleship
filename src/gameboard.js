import { Ship } from "./ship.js"

class Gameboard {
    size = 10;
    coordinates = [];
    ships = [];
    missed = [];
    hits = [];

    constructor() {
        for(let i = 0; i < this.size; i++) {
            this.coordinates[i] = [];
            for(let j = 0; j < this.size; j++) {
                this.coordinates[i][j] = 0;
            }
        }
    }

    playShip(x, y, length, orientation) {
        let ship = new Ship(this.ships.length + 1, length);
        let newCoords = []

        if(orientation === "vertical") {
            // check if ship would go out of bounds
            if(y + length > this.size) return "out of bounds";

            // check if this ship would intersect another
            for(let k = 0; k < ship.length; k++) {
                if (this.coordinates[y+k][x] !== 0) {
                    return "collision";
                }

                newCoords.push([y+k, x]);
            }

            // update our board with the ship
            newCoords.forEach(coordPair => {
                this.coordinates[coordPair[0]][coordPair[1]] = ship.id;
            });
        }
        else if(orientation === "horizontal") {
            if(x + length > this.size) return "out of bounds";

            for(let k = 0; k < ship.length; k++) {
                if (this.coordinates[y][x+k] !== 0) {
                    return "collision";
                }

                newCoords.push([y, x+k]);
            }

            newCoords.forEach(coordPair => {
                this.coordinates[coordPair[0]][coordPair[1]] = ship.id;
            });
        }

        this.ships.push(ship);
        return "success";
    }

    receiveAttack(x, y) {
        let shipID = this.coordinates[x][y];
        if(shipID === 0) {
            this.missed.push([x, y]);
            return false;
        }
        else {
            this.hits.push([x, y]);
            this.ships[shipID - 1].numHits++;
            return true;
        }
    }

    isGameOver() {
        let totalLength = 0;
        let totalHits = 0;
        this.ships.forEach(ship => {
            totalLength += ship.length;
            totalHits += ship.numHits;
        });

        if(totalHits >= totalLength) {
            return true;
        }
        else {
            return false;
        }
    }

    printBoard() {
        for(let i = this.size - 1; i >= 0; i--) {
            console.log(this.coordinates[i].join(" "));
        }
    }
}

export { Gameboard }
class Ship {
    length = 0;
    numHits = 0;
    sunk = false;

    constructor(length) {
        this.length = length;
    }
    
    hit() {
        this.numHits++;
    }

    isSunk() {
        if(this.numHits >= this.length) {
            return true;
        }
        else {
            return false;
        }
    }
}

export { Ship }
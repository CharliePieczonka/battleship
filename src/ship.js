class Ship {
    id = 0;
    length = 0;
    numHits = 0;
    sunk = false;

    constructor(id, length) {
        this.id = id;
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
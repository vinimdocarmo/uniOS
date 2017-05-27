'use strict';

class BlockMemory {
    constructor(data, size) {
        if (!size) {
            throw TypeError('you must pass the size of the block');
        }
        this.id = _.uniqueId();
        this.data = data;
        this.size = size;
        this.nextBlock = null;
    }

    next() {
        return this.nextBlock;
    }

    setNextBlock(nextBlock) {
        this.nextBlock = nextBlock;
    }

    isHole() {
        return !this.data;
    }
}
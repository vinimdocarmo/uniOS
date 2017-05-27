'use strict';

class BestFit {
    constructor(memory) {
        this.memory = memory;
    }

    allocate(size) {
        let currentBlock = this.memory.head;
        let allocatedBlock = null;

        do {
            if (currentBlock.isHole()) {
                if (!allocatedBlock) {
                    allocatedBlock = currentBlock;
                } else {
                    if (currentBlock.size >= size && currentBlock.size < allocatedBlock.size) {
                        allocatedBlock = currentBlock;
                    }
                }
            }
        } while (currentBlock = currentBlock.next());

        return allocatedBlock;
    }
}
'use strict';

(function () {
    angular
        .module('best-fit', [])
        .factory('BestFit', function () {
            class BestFit {
                constructor(memory) {
                    this.memory = memory;
                }

                allocate(size) {
                    let currentBlock = this.memory.blockList.head;
                    let allocatedBlock = null;

                    do {
                        if (!currentBlock) {
                            break;
                        }
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

                    return allocatedBlock || this.memory.allocate(size);
                }

                free(block) {
                    block.free();
                }
            }

            return BestFit;
        });
})();
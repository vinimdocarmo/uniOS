'use strict';

(function () {
    angular
        .module('merge-fit', [])
        .factory('MergeFit', function (BlockMemory) {
            class MergeFit {
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
                                if (currentBlock.size >= size) {
                                    allocatedBlock = currentBlock;
                                }
                            } else {
                                if (currentBlock.size >= size && currentBlock.size < allocatedBlock.size) {
                                    allocatedBlock = currentBlock;
                                }
                            }
                        }
                    } while (currentBlock = currentBlock.next());

                    if (allocatedBlock) {
                        allocatedBlock.setAllocatedSize(size);
                        return allocatedBlock;
                    }

                    return allocatedBlock || this.memory.allocate(size);
                }

                free(block) {
                    block.free();

                    let mostRightAllocatedBlock;
                    let mostLeftAllocatedBlock;
                    let sizeSum = block.getSize();

                    mostRightAllocatedBlock = block.next();
                    mostLeftAllocatedBlock = block.prev();

                    if (!mostRightAllocatedBlock.isHole() && !mostLeftAllocatedBlock.isHole()) {
                        return;
                    }

                    while (mostRightAllocatedBlock && mostRightAllocatedBlock.isHole()) {
                        sizeSum += mostRightAllocatedBlock.getSize();
                        mostRightAllocatedBlock = mostRightAllocatedBlock.next();
                    }

                    while (mostLeftAllocatedBlock && mostLeftAllocatedBlock.isHole()) {
                        sizeSum += mostLeftAllocatedBlock.getSize();
                        mostLeftAllocatedBlock = mostLeftAllocatedBlock.prev();
                    }

                    const isHole = true;
                    const blockMerged = new BlockMemory(sizeSum, isHole);

                    if (mostLeftAllocatedBlock) {
                        mostLeftAllocatedBlock.setNextBlock(blockMerged);
                        blockMerged.setPrevBlock(mostRightAllocatedBlock);
                    } else {
                        this.memory.getBlockList().setHead(blockMerged);
                        blockMerged.setNextBlock(mostRightAllocatedBlock);
                    }

                    if (mostRightAllocatedBlock) {
                        mostRightAllocatedBlock.setPrevBlock(blockMerged);
                        blockMerged.setNextBlock(mostRightAllocatedBlock);
                    } else {
                        mostLeftAllocatedBlock.setNextBlock(blockMerged);
                    }
                }
            }

            return MergeFit;
        });
})();
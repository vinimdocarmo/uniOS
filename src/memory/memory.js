'use strict';

(function () {
    angular
        .module('memory', ['linked-list'])
        .factory('BlockMemory', function () {
            class BlockMemory {
                constructor(size) {
                    if (!size) {
                        throw TypeError('you must pass the size of the block');
                    }
                    this.id = _.uniqueId();
                    this.size = size;
                    this.allocatedSize = size;
                    this.process = null;
                    this.nextBlock = null;
                    this.prevBlock = null;
                }

                setProcess(process) {
                    this.process = process;
                }

                getProcess() {
                    return this.process;
                }

                free() {
                    this.allocatedSize = 0;
                    this.process = null;
                }

                setAllocatedSize(size) {
                    if (size > this.size) {
                        throw new Error(`attempt to allocate ${size} in block of size ${this.size}`);
                    }
                    this.allocatedSize = size;
                }

                getSize() {
                    return this.size;
                }

                getAllocatedSize() {
                    return this.allocatedSize;
                }

                next() {
                    return this.nextBlock;
                }

                prev() {
                    return this.prevBlock;
                }

                setNextBlock(nextBlock) {
                    this.nextBlock = nextBlock;
                }

                setPrevBlock(prevBlock) {
                    this.prevBlock = prevBlock;
                }

                isHole() {
                    return this.allocatedSize === 0;
                }
            }

            return BlockMemory;
        })
        .factory('Memory', function (BlockMemory, LinkedList) {
            class Memory {
                constructor(size) {
                    if (!size) {
                        throw new TypeError('size must be passed to the constructor');
                    }
                    this.blockList = new LinkedList();
                    this.size = size;
                }

                getSize() {
                    return this.size;
                }

                get allocatedSize() {
                    let allocatedSize = 0;
                    this.asArray().forEach(function (block) {
                        allocatedSize += block.getAllocatedSize();
                    });
                    return allocatedSize;
                }

                asArray() {
                    let memoryAsArray = [];
                    let currentBlock = this.getFirstBlock();

                    while (currentBlock) {
                        memoryAsArray.push(currentBlock);
                        currentBlock = currentBlock.next();
                    }

                    return memoryAsArray;
                }

                getBlockList() {
                    return this.blockList;
                }

                getFirstBlock() {
                    return this.blockList.head;
                }

                allocate(size) {
                    if (this.allocatedSize + size > this.size) {
                        throw new Error('OutOfMemory');
                    }
                    const block = new BlockMemory(size);
                    this.blockList.add(block);
                    return block;
                }
            }

            return Memory;
        });

})();


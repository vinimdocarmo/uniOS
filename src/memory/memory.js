'use strict';

(function () {
    angular
        .module('memory', ['linked-list'])
        .factory('BlockMemory', function () {
            class BlockMemory {
                constructor(size, isHole) {
                    if (size !== 0 && !size) {
                        throw TypeError('you must pass the size of the block');
                    }
                    this.locked = false;
                    this.id = _.uniqueId();
                    this.size = size;
                    this.allocatedSize = isHole ? 0 : size;
                    this.process = null;
                    this.nextBlock = null;
                    this.prevBlock = null;
                }

                setProcess(process) {
                    this.process = process;
                }

                lock() {
                    this.locked = true;
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

                setSize(size) {
                    this.size = size;
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
                    return this.allocatedSize === 0 && !this.locked;
                }
            }

            return BlockMemory;
        })
        .factory('Memory', function (BlockMemory, LinkedList) {
            class Memory {
                constructor(size, listStructure) {
                    if (!size) {
                        throw new TypeError('size must be passed to the constructor');
                    }
                    if (!listStructure) {
                        throw new TypeError('you must pass a instance of a list structure');
                    }
                    this.blockList = listStructure;
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

                getLastBlock() {
                    let lastBlock = this.getFirstBlock();

                    while (lastBlock) {
                        if (lastBlock.next() === null) {
                            return lastBlock;
                        }
                        lastBlock = lastBlock.next();
                    }

                    return null;
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


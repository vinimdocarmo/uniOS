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
                    this.nextBlock = null;
                }

                free() {
                    this.allocatedSize = 0;
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

                setNextBlock(nextBlock) {
                    this.nextBlock = nextBlock;
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
                    this._allocatedSize = 0;
                    this.blockList = new LinkedList();
                    this.size = size;
                }

                getSize() {
                    return this.size;
                }

                getBlockList() {
                    return this.blockList;
                }

                getFirstBlock() {
                    return this.blockList.head;
                }

                allocate(size) {
                    if (this._allocatedSize + size > this.size) {
                        throw new Error('OutOfMemory');
                    }
                    const block = new BlockMemory(size);
                    this.blockList.add(block);
                    this._allocatedSize += block.size;
                    return block;
                }
            }

            return Memory;
        });

})();


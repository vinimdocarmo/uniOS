'use strict';

(function () {
    angular
        .module('memory', [])
        .factory('Memory', function () {
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

                getFirstBlock() {
                    return this.blockList.head;
                }

                allocate(size) {
                    if (this._allocatedSize + size > this.size) {
                        throw new Error('OutOfMemory');
                    }
                    const block = new BlockMemory(null, size);
                    this.blockList.add(block);
                    this._allocatedSize += block.size;
                    return block;
                }
            }

            return Memory;
        });

})();


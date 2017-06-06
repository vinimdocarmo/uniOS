'use strict';

(function () {
    angular
        .module('memory-manager', ['best-fit', 'quick-fit', 'merge-fit'])
        .factory('MemoryManagerBestFit', function (BestFit) {
            class MemoryManagerBestFit extends MemoryManager {
                constructor(memory) {
                    super(new BestFit(memory));
                    this.memory = memory;
                }

                allocate(size) {
                    return super.allocate(size);
                }
            }

            return MemoryManagerBestFit;
        })
        .factory('MemoryManagerQuickFit', function (QuickFit) {
            class MemoryManagerQuickFit extends MemoryManager {
                constructor(memory, numberOfLists, requestsInterval) {
                    super(new QuickFit(memory, numberOfLists, requestsInterval));
                    this.memory = memory;
                }

                allocate(size) {
                    return super.allocate(size);
                }

                getFreeBlocks() {
                    return this.allocator.getFreeBlocks();
                }

                getCache() {
                    return this.allocator.getCache();
                }

            }

            return MemoryManagerQuickFit;
        })
        .factory('MemoryManagerMergeFit', function (MergeFit) {
            class MemoryManagerMergeFit extends MemoryManager {
                constructor(memory) {
                    super(new MergeFit(memory));
                    this.memory = memory;
                }
            }

            return MemoryManagerMergeFit;
        });

    class MemoryManager {
        constructor(allocator) {
            this.allocator = allocator;
        }

        allocate(size) {
            return this.allocator.allocate(size);
        }

        free(block) {
            this.allocator.free(block);
        }

        getMemory() {
            return this.memory;
        }
    }
})();
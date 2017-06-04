'use strict';

(function () {
    angular
        .module('memory-manager', ['best-fit'])
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
        });

    class MemoryManager {
        constructor(allocator) {
            this.allocator = allocator;
        }

        allocate(size) {
            return this.allocator.allocate(size);
        }

        getMemory() {
            return this.memory;
        }
    }

    class MemoryManagerQuickFit extends MemoryManager {
        constructor(memory) {
            super(new QuickFit(memory));
        }
    }

    class MemoryManagerMergeQuick extends MemoryManager {
        constructor(memory) {
            super(new MergeFit(memory));
        }
    }
})();
'use strict';

class MemoryManager {
    constructor(allocator) {
        this.allocator = allocator;
    }

    allocate(size) {
        return this.allocator.allocate(size);
    }
}

class MemoryManagerBestFit extends MemoryManager {
    constructor(memory) {
        super(new BestFit(memory));
    }

    allocate(size) {
        return super.allocate(size);
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
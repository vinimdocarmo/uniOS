'use strict';

(function () {
    angular
        .module('quick-fit', ['node', 'linked-list'])
        .factory('QuickFit', function (Node, LinkedList) {
            class QuickFit {
                constructor(memory, numberOfList, requestsInterval) {
                    this.memory = memory;
                    this.numberOfLists = numberOfList || 3;
                    this.requestsInterval = requestsInterval || 100;
                    this.histogram = {};
                    this.cache = null;
                    this.numberOfRequests = 0;
                    this.freeBlocks = new LinkedList();

                    let currentBlock = this.memory.getFirstBlock();

                    while (currentBlock) {
                        if (currentBlock.isHole()) {
                            this.freeBlocks.add(new Node(currentBlock));
                        }
                        currentBlock = currentBlock.next();
                    }
                }

                allocate(size) {
                    let allocatedBlock = null;
                    this.populateHistogram(size);
                    this.numberOfRequests++;

                    if(this.cache && this.cache[size]) {
                        let currentNode = this.cache[size].head;

                        do {
                            if (currentNode.data.isHole()) {
                                allocatedBlock = currentNode.data;
                                allocatedBlock.setAllocatedSize(size);
                                this.cache[size].remove(currentNode);
                                break;
                            }
                        } while(currentNode = currentNode.next());

                    } else {
                        allocatedBlock = this.firstFitFreeBlocks(size);
                    }

                    if (this.numberOfRequests === this.requestsInterval) {
                        this.numberOfRequests = 0;
                        this.newCache();
                        this.histogram = {};
                    }

                    return allocatedBlock || this.memory.allocate(size);
                }

                firstFitFreeBlocks(size) {
                    let currentNode = this.freeBlocks.head;
                    let freeBlock = null;
                    while (currentNode) {
                        if (currentNode.data.isHole() && currentNode.data.size >= size) {
                            freeBlock = currentNode.data;
                            freeBlock.setAllocatedSize(size);
                            this.freeBlocks.remove(currentNode);
                            break;
                        }
                        currentNode = currentNode.next();
                    }
                    return freeBlock;
                }

                free(block) {
                    block.free();
                    if (this.cache && this.cache[block.size]) {
                        this.cache[block.size].add(new Node(block));
                    } else {
                        this.freeBlocks.add(new Node(block));
                    }
                }

                getFreeBlocks() {
                    return this.freeBlocks;
                }

                getHistogram() {
                    return this.histogram;
                }

                getCache() {
                    return this.cache;
                }

                newCache() {
                    const self = this;
                    let numberOfLists = this.numberOfLists;

                    self.cache = {};

                    while (numberOfLists !== 0) {
                        let mostRequestedSize = 0;
                        let maxRequest = 0;

                        _.each(this.histogram, function (requests, size) {
                            if (requests > maxRequest && !self.cache[size]) {
                                maxRequest = requests;
                                mostRequestedSize = size;
                            }
                        });

                        this.cache[mostRequestedSize] = new LinkedList();

                        numberOfLists--;
                    }

                    let currentBlock = self.memory.getFirstBlock();

                    do {
                        if (this.cache[currentBlock.size]) {
                            if (currentBlock.isHole()) {
                                this.cache[currentBlock.size].add(new Node(currentBlock));
                            }
                        } else {
                            if (currentBlock.isHole()) {
                                //todo
                            }
                        }
                    } while(currentBlock = currentBlock.next());
                }

                populateHistogram(size) {
                    if (this.histogram[size]) {
                        this.histogram[size]++;
                    } else {
                        this.histogram[size] = 1;
                    }
                }
            }

            return QuickFit;
        });
})();
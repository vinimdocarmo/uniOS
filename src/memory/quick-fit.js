'use strict';

(function () {
    angular
        .module('quick-fit', ['node', 'linked-list'])
        .factory('QuickFit', function (Node, LinkedList) {
            class QuickFit {
                constructor(memory, numberOfList, requestsInterval) {
                    this.memory = memory;
                    this.numberOfLists = numberOfList;
                    this.requestsInterval = requestsInterval;
                    this.histogram = {};
                    this.cache = null;
                    this.fallbackBlocks = new LinkedList();
                    this.numberOfRequests = 0;
                }

                allocate(size) {
                    let allocatedBlock = null;
                    this.populateHistogram(size);
                    this.numberOfRequests++;


                    if (!this.cache) {

                    } else if(this.cache[size]) {
                        let currentNode = this.cache[size].head;

                        do {
                            if (currentNode.data.isHole()) {
                                allocatedBlock = currentNode.data;
                                break;
                            }
                        } while(currentNode = currentNode.nextBlock());
                    } else {
                        allocatedBlock = this.firstQuickAllocate();
                    }

                    if (this.numberOfRequests === this.requestsInterval) {
                        this.numberOfRequests = 0;
                        this.newCache();
                        this.histogram = {};
                    }

                    return allocatedBlock;
                }

                firstQuickAllocate() {
                    let currentNode = this.fallbackBlocks.head;

                    do {
                        if (currentNode.data.isHole()) {
                            return currentNode.data;
                        }
                    } while(currentNode = currentNode.nextBlock());

                    return null;
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
                    this.fallbackBlocks = new LinkedList();

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
                                this.fallbackBlocks.add(new Node(currentBlock));
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

                getFallbackBlocks() {
                    return this.fallbackBlocks;
                }
            }

            return QuickFit;
        });
})();
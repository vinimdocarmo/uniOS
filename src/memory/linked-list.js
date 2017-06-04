'use strict';

(function () {
    angular
        .module('linked-list', [])
        .factory('LinkedList', function () {
            class LinkedList {
                constructor() {
                    this.size = 0;
                    this.head = null;
                }

                getSize() {
                    return this.size;
                }

                remove(node) {
                    if (this.head === node) {
                        let nextNode = this.head.next();

                        if (nextNode) {
                            this.head = nextNode;
                        } else {
                            this.head = null;
                        }
                        this.size--;
                    } else {
                        let currentNode = this.head.next();
                        let prevNode = this.head;

                        while (currentNode) {
                            if (currentNode === node) {
                                prevNode.nextBlock = node.next();
                                this.size--;
                                break;
                            }
                            prevNode = currentNode;
                            currentNode = currentNode.next();
                        }
                    }
                }

                add(node) {
                    if (this.size === 0) {
                        this.head = node;
                    } else {
                        let currentNode = this.head;
                        while (currentNode.nextBlock) {
                            currentNode = currentNode.next();
                        }
                        currentNode.nextBlock = node;
                    }
                    this.size++;
                }
            }

            return LinkedList;
        });
})();
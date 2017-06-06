'use strict';

(function () {
    angular
        .module('double-linked-list', [])
        .factory('DoubleLinkedList', function () {
            class DoubleLinkedList {
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
                            nextNode.setPrevBlock(this.head);
                        } else {
                            this.head = null;
                        }
                        this.size--;
                    } else {
                        let currentNode = this.head.next();
                        let prevNode = this.head;

                        while (currentNode) {
                            if (currentNode === node) {
                                let next = node.next();
                                prevNode.nextBlock = next;
                                next && next.setPrevBlock(prevNode);
                                this.size--;
                                break;
                            }
                            prevNode = currentNode;
                            currentNode = currentNode.next();
                        }
                    }
                }

                setHead(block) {
                    this.head = block;
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
                        node.setPrevBlock(currentNode);
                    }
                    this.size++;
                }
            }

            return DoubleLinkedList;
        });
})();
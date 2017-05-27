'use strict';

class LinkedList {
    constructor() {
        this.size = 0;
        this.head = null;
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
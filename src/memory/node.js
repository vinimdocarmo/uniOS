'use strict';

(function () {
    angular
        .module('node', [])
        .factory('Node', function () {
            class Node {
                constructor(data) {
                    this.data = data;
                    this.nextBlock = null;
                    this.prevBlock = null;
                }

                next() {
                    return this.nextBlock;
                }

                prev() {
                    return this.prevBlock;
                }

                setNextBlock(nextBlock) {
                    this.nextBlock = nextBlock;
                }

                setPrevBlock(nextBlock) {
                    this.nextBlock = nextBlock;
                }
            }

            return Node;
        });
})();
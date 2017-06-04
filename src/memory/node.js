'use strict';

(function () {
    angular
        .module('node', [])
        .factory('Node', function () {
            class Node {
                constructor(data) {
                    this.data = data;
                    this.nextBlock = null;
                }

                next() {
                    return this.nextBlock;
                }

                setNextBlock(nextBlock) {
                    this.nextBlock = nextBlock;
                }
            }

            return Node;
        });
})();
'use strict';

describe('linked list: ', function () {

    describe('quando a lista estiver vazia', function () {

        let linkedList;

        beforeEach(function () {
            linkedList = new LinkedList();
        });

        it('o tamanho da lista deve ser zero', function () {
            expect(linkedList.size).to.be.equal(0);
        });

        it('o atributo head é nulo', function () {
            expect(linkedList.head).to.be.null;
        });

    });

    describe('quando o primeiro nó é adicionado na lista', function () {
        let linkedList;
        let block;

        beforeEach(function () {
            linkedList = new LinkedList();
            block = new BlockMemory({}, 2);
            linkedList.add(block);
        });

        it('o novo tamanho da lista deve ser 1', function () {
            expect(linkedList.size).to.be.equal(1);
        });

        it('o atributo head deve ser igual ao nó adicionado', function () {
            expect(linkedList.head).to.be.equal(block);
        });
    });

    describe('quando uma lista não está vazia', function () {
        let linkedList;
        let block;

        beforeEach(function () {
            linkedList = new LinkedList();
            block = new BlockMemory({}, 10);
            linkedList.add(block);
        });

        it('deve ser capaz de adidionar mais um elemento', function () {
            linkedList.add(new BlockMemory(null, 10));
            expect(linkedList.size).to.be.equal(2);
        });
    });
});
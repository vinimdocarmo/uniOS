'use strict';

describe('linked list: ', function () {

    let BlockMemory, LinkedList;
    
    beforeEach(module('memory'));
    beforeEach(module('linked-list'));

    beforeEach(inject(function (_BlockMemory_, _LinkedList_) {
        BlockMemory = _BlockMemory_;
        LinkedList = _LinkedList_;
    }));

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
            block = new BlockMemory(2);
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
            block = new BlockMemory(10);
            linkedList.add(block);
        });

        it('deve ser capaz de adidionar mais um elemento', function () {
            linkedList.add(new BlockMemory(10));
            expect(linkedList.size).to.be.equal(2);
        });
    });

    describe('quando a lista tem vários elementos', function () {

        let list,
            firstElement,
            element,
            lastElement,
            initialSize;

        beforeEach(function () {
            list = new LinkedList();
            list.add(firstElement = new BlockMemory(16));
            list.add(new BlockMemory(16));
            list.add(new BlockMemory(16));
            list.add(new BlockMemory(16));
            list.add(element = new BlockMemory(16));
            list.add(new BlockMemory(16));
            list.add(new BlockMemory(16));
            list.add(lastElement = new BlockMemory(16));

            initialSize = list.getSize();
        });

        it('deve ser capaz de apagar o primeiro elemento da lista', function () {
            list.remove(firstElement);
            expect(list.getSize()).to.be.equal(initialSize - 1);
        });

        it('deve ser capaz de apagar o último elemento da list', function () {
            list.remove(element);
            expect(list.getSize()).to.be.equal(initialSize - 1);
        });

        it('deve ser capaz de apagar um elemento intermediário da lista', function () {
            list.remove(lastElement);
            expect(list.getSize()).to.be.equal(initialSize - 1);
        });

    });
});
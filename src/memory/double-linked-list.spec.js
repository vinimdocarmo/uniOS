'use strict';

describe('double linked list: ', function () {

    let BlockMemory, DoubleLinkedList;
    
    beforeEach(module('memory'));
    beforeEach(module('double-linked-list'));

    beforeEach(inject(function (_BlockMemory_, _DoubleLinkedList_) {
        BlockMemory = _BlockMemory_;
        DoubleLinkedList = _DoubleLinkedList_;
    }));

    describe('quando a lista estiver vazia', function () {

        let doubleLinkedList;

        beforeEach(function () {
            doubleLinkedList = new DoubleLinkedList();
        });

        it('o tamanho da lista deve ser zero', function () {
            expect(doubleLinkedList.size).to.be.equal(0);
        });

        it('o atributo head é nulo', function () {
            expect(doubleLinkedList.head).to.be.null;
        });

    });

    describe('quando o primeiro nó é adicionado na lista', function () {
        let doubleLinkedList;
        let block;

        beforeEach(function () {
            doubleLinkedList = new DoubleLinkedList();
            block = new BlockMemory(2);
            doubleLinkedList.add(block);
        });

        it('o novo tamanho da lista deve ser 1', function () {
            expect(doubleLinkedList.size).to.be.equal(1);
        });

        it('o atributo head deve ser igual ao nó adicionado', function () {
            expect(doubleLinkedList.head).to.be.equal(block);
        });

        it('o próximo elemento deve ser nulo', function () {
            expect(doubleLinkedList.head.next()).to.be.null;
        });

        it('o elemento anterior deve ser nulo', function () {
            expect(doubleLinkedList.head.prev()).to.be.null;
        });
    });

    describe('quando uma lista não está vazia', function () {
        let doubleLinkedList;
        let block;

        beforeEach(function () {
            doubleLinkedList = new DoubleLinkedList();
            block = new BlockMemory(10);
            doubleLinkedList.add(block);
        });

        it('deve ser capaz de adidionar mais um elemento', function () {
            const block = new BlockMemory(10);
            doubleLinkedList.add(block);
            expect(doubleLinkedList.size).to.be.equal(2);
            expect(block.next()).to.be.null;
            expect(block.prev()).to.be.equal(doubleLinkedList.head);
        });
    });

    describe('quando a lista tem vários elementos', function () {

        let list,
            firstElement,
            element,
            lastElement,
            initialSize;

        beforeEach(function () {
            list = new DoubleLinkedList();
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
'use strict';

describe('MemoryManagerQuickFit', function () {

    let MemoryManagerQuickFit, Memory, manager;

    beforeEach(module('memory-manager'));
    beforeEach(module('memory'));

    beforeEach(inject(function (_MemoryManagerQuickFit_, _Memory_) {
        MemoryManagerQuickFit = _MemoryManagerQuickFit_;
        Memory = _Memory_;
    }));


    describe('quando a memória estiver totalmente vazia', function () {
        beforeEach(function () {
            manager = new MemoryManagerQuickFit(new Memory(32));
        });

        describe('e um bloco for alocado', function () {

            let block;

            beforeEach(function () {
                block = manager.allocate(6);
            });

            it('o gerenciador de memória deve alocar o primeiro bloco de memória', function () {
                expect(manager.getMemory().getFirstBlock()).to.be.equal(block);
            });
        });
    });

    describe('quando a memória estiver parcialmente alocada', function () {

        let manager, prevBlockSize, block32Bytes;

        beforeEach(function () {
            const memory = new Memory(256);
            const numberOfLists = 2;
            const requestsInterval = 1000;
            manager = new MemoryManagerQuickFit(memory, numberOfLists, requestsInterval);
            manager.allocate(32);
            block32Bytes = manager.allocate(32);
            manager.allocate(32);
            manager.allocate(16);
            manager.allocate(16);
            manager.allocate(8);
            prevBlockSize = manager.getMemory().getBlockList().getSize();
        });

        it('deve ser criado um novo bloco quando o método allocate for chamado', function () {
            manager.allocate(2);
            expect(manager.getMemory().getBlockList().getSize()).to.be.equal(prevBlockSize + 1);
        });

        describe('e um bloco de 32 bytes for desalocado', function () {

            beforeEach(function () {
                manager.free(block32Bytes);
            });

            it('deve retornar o bloco de 32 bytes que foi desalocado ao tentar alocar um bloco de tamanho 32 bytes', function () {
                const block = manager.allocate(32);

                expect(block).to.be.equal(block32Bytes);
            });

        });


    });

    describe('quando o intervalo de requisições for atingido pela primeira vez', function () {

        let manager, numberOfLists = 2, requestsInterval = 10;

        let blocks8Bytes,
            blocks6Bytes,
            blocks4Bytes;

        beforeEach(function () {
            blocks8Bytes = [];
            blocks6Bytes = [];
            blocks4Bytes = [];
            manager = new MemoryManagerQuickFit(new Memory(256), numberOfLists, requestsInterval);

            blocks8Bytes.push(manager.allocate(8));
            blocks8Bytes.push(manager.allocate(8));
            blocks8Bytes.push(manager.allocate(8));
            blocks8Bytes.push(manager.allocate(8));

            blocks6Bytes.push(manager.allocate(6));
            blocks6Bytes.push(manager.allocate(6));
            blocks6Bytes.push(manager.allocate(6));
            blocks6Bytes.push(manager.allocate(6));

            blocks4Bytes.push(manager.allocate(4));
            blocks4Bytes.push(manager.allocate(4));
            blocks4Bytes.push(manager.allocate(4));
        });

        it(`deve ser criado um cache com ${numberOfLists} listas indexado por pelos tamanhos mais requisitados`, function () {
            const cache = manager.getCache();

            expect(cache).to.exists;
            expect(cache['8']).to.exists;
            expect(cache['6']).to.exists;
        });

        describe('a medida que os blocos mais requisitados forem sendo desalocados', function () {

            beforeEach(function () {
                blocks8Bytes.forEach(function (block) {
                    manager.free(block);
                });
                
                blocks6Bytes.forEach(function (block) {
                    manager.free(block);
                });
            });

            it('o cache deve conter os blocos livres', function () {
                const cache8Bytes = manager.getCache()['8'];
                const cache6Bytes = manager.getCache()['6'];

                expect(cache8Bytes.size).to.be.equal(blocks8Bytes.length);
                expect(cache6Bytes.size).to.be.equal(blocks6Bytes.length);
            });

            describe('a medida que os tamanhos mais requisitados forem requisitados novamente', function () {

                let allocatedBlocks8Bytes;

                beforeEach(function () {
                    allocatedBlocks8Bytes = [];
                    allocatedBlocks8Bytes.push(manager.allocate(8));
                    allocatedBlocks8Bytes.push(manager.allocate(8));
                });

                it('deve retornar os blocos que estão em cache', function () {
                    allocatedBlocks8Bytes.forEach(function (block, i) {
                        expect(block).to.be.equal(blocks8Bytes[i]);
                    });
                });

                it('os blocos retornados devem ser removidos do cache', function () {
                    const cachedBlocks8Bytes = manager.getCache()['8'];
                    let currentNode = cachedBlocks8Bytes.head;

                    do {
                        expect(allocatedBlocks8Bytes).to.not.include(currentNode.data);
                    } while (currentNode = currentNode.next());
                });

            });

        });

        describe('quando um blocoo de tamanho menos requisitado for desalocado', function () {

            let freeBlock;

            beforeEach(function () {
                manager.free(blocks4Bytes[0]);
                manager.free(blocks4Bytes[1]);
                freeBlock = blocks4Bytes[0];
            });

            describe('quando o mesmo bloco for alocado novamente', function () {
                beforeEach(function () {
                    manager.allocate(freeBlock.size);
                });

                it('o bloco retornado deve ser removido da lista de blocos livres', function () {
                    const freeBlocks = manager.getFreeBlocks();
                    let currentNode = freeBlocks.head;

                    do {
                        expect(freeBlock).to.not.be.equal(currentNode.data);
                    } while (currentNode = currentNode.next());
                });
            });

        });

    });



});
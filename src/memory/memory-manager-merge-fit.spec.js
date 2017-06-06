'use strict';

describe('memory manager: ', function () {
    let Memory, MemoryManagerMergeFit, BlockMemory, DoubleLinkedList;

    beforeEach(module('memory'));
    beforeEach(module('double-linked-list'));
    beforeEach(module('memory-manager'));

    beforeEach(inject(function(_Memory_, _MemoryManagerMergeFit_, _BlockMemory_, _DoubleLinkedList_) {
        Memory = _Memory_;
        MemoryManagerMergeFit = _MemoryManagerMergeFit_;
        BlockMemory = _BlockMemory_;
        DoubleLinkedList = _DoubleLinkedList_;
    }));

    describe('quando o algoritmo de alocação usado for o merge fit', function () {

        describe('e a memória estiver vazia', function () {

            let manager, memory;

            beforeEach(function () {
                memory = new Memory(256, new DoubleLinkedList());
                manager = new MemoryManagerMergeFit(memory);
            });

            it('deve alocar o primeiro bloco de memória ao chamar o método allocate', function () {
                const blockSize = 16;
                const block = manager.allocate(blockSize);
                expect(manager.getMemory().getFirstBlock()).to.be.equal(block);
            });
        });

        describe('e o método allocate for chamado', function () {

            let bestBlock,
                size = 5,
                memory,
                expectedBlock;

            beforeEach(function () {
                memory = new Memory(256, new DoubleLinkedList());

                memory.allocate(6);
                expectedBlock = memory.allocate(7);
                memory.allocate(10);
                memory.allocate(10);
                memory.allocate(16);

                const manager = new MemoryManagerMergeFit(memory);

                expectedBlock.free();

                bestBlock = manager.allocate(size);
            });

            it('retorna um bloco de memória', function () {
                expect(bestBlock).to.be.instanceOf(BlockMemory);
            });

            it('retorna o bloco que não está ocupado e que tem o menor valor maior igual ao espaço alocado', function () {
                expect(expectedBlock).to.be.equal(bestBlock);
            });

        });

        describe('e a memória estiver parcialmente alocada', function () {
            let memory, block7Bytes, block10Bytes,
                block8Bytes, block6Bytes, block5Bytes,
                manager;

            beforeEach(function () {
                memory = new Memory(256, new DoubleLinkedList());
                manager = new MemoryManagerMergeFit(memory);

                block5Bytes = manager.allocate(5);
                block7Bytes = manager.allocate(7);
                block8Bytes = manager.allocate(8);
                block10Bytes = manager.allocate(10);
                block6Bytes = manager.allocate(6);
            });

            describe('e dois blocos do lado direito forem liberados', function () {
                beforeEach(function () {
                    block10Bytes.free();
                    block6Bytes.free();
                });

                describe('quando o bloco do de 8 bytes for liberado', function () {
                    beforeEach(function () {
                        manager.free(block8Bytes);
                    });

                    it('deve ocorrer o merge dos blocos livres adjacentes a direita um a um', function () {
                        manager.getMemory().asArray().forEach(function (block) {
                            expect(block).to.not.be.equal(block8Bytes);
                            expect(block).to.not.be.equal(block10Bytes);
                            expect(block).to.not.be.equal(block6Bytes);
                        });

                        const newBlockSize = manager.getMemory().asArray().some(function (block) {
                            return block.getSize() === (block8Bytes.getSize() + block10Bytes.getSize() + block6Bytes.getSize());
                        });

                        expect(newBlockSize).to.be.true;
                    });

                    it('o último bloco agora é o novo bloco criado', function () {
                        expect(manager.getMemory().getLastBlock().getSize())
                            .to.be.equal(block8Bytes.getSize() + block10Bytes.getSize() + block6Bytes.getSize());
                    });
                });

            });

            describe('e dois blocos do lado esquerdo forem liberados', function () {
                beforeEach(function () {
                    block7Bytes.free();
                    block5Bytes.free();
                });

                describe('quando o bloco do de 8 bytes for liberado', function () {
                    beforeEach(function () {
                        manager.free(block8Bytes);
                    });

                    it('deve ocorrer o merge dos blocos livres adjacentes a direita um a um', function () {
                        manager.getMemory().asArray().forEach(function (block) {
                            expect(block).to.not.be.equal(block5Bytes);
                            expect(block).to.not.be.equal(block7Bytes);
                            expect(block).to.not.be.equal(block8Bytes);
                        });

                        const newBlockSize = manager.getMemory().asArray().some(function (block) {
                            return block.getSize() === (block5Bytes.getSize() + block7Bytes.getSize() + block8Bytes.getSize());
                        });

                        expect(newBlockSize).to.be.true;
                    });

                    it('o primeiro bloco agora é o novo bloco criado', function () {
                        expect(manager.getMemory().getFirstBlock().getSize())
                            .to.be.equal(block5Bytes.getSize() + block7Bytes.getSize() + block8Bytes.getSize());
                    });
                });

            });

            describe('e dois blocos não adjacentes forem liberados', function () {
                beforeEach(function () {
                    block7Bytes.free();
                    block10Bytes.free();
                });

                describe('quando o bloco do merio for liberado', function () {
                    beforeEach(function () {
                        manager.free(block8Bytes);
                    });

                    it('deve ocorrer o merge dos blocos livres adjacentes um a um', function () {
                        manager.getMemory().asArray().forEach(function (block) {
                            expect(block).to.not.be.equal(block7Bytes);
                            expect(block).to.not.be.equal(block8Bytes);
                            expect(block).to.not.be.equal(block10Bytes);
                        });

                        const newBlockSize = manager.getMemory().asArray().some(function (block) {
                            return block.getSize() === (block7Bytes.getSize() + block8Bytes.getSize() + block10Bytes.getSize());
                        });

                        expect(newBlockSize).to.be.true;
                    });
                });

            });
        });

    });
});
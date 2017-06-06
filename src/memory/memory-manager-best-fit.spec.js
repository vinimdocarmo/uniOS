'use strict';

describe('memory manager: ', function () {
    let Memory, MemoryManagerBestFit, BlockMemory, LinkedList;

    beforeEach(module('memory'));
    beforeEach(module('linked-list'));
    beforeEach(module('memory-manager'));

    beforeEach(inject(function(_Memory_, _MemoryManagerBestFit_, _BlockMemory_, _LinkedList_) {
        Memory = _Memory_;
        MemoryManagerBestFit = _MemoryManagerBestFit_;
        BlockMemory = _BlockMemory_;
        LinkedList = _LinkedList_;
    }));

    describe('quando o algoritmo de alocação usado for o best fit', function () {

        describe('e a memória estiver vazia', function () {

            let manager, memory;

            beforeEach(function () {
                memory = new Memory(256, new LinkedList());
                manager = new MemoryManagerBestFit(memory);
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
                memory = new Memory(256, new LinkedList());

                memory.allocate(6);
                expectedBlock = memory.allocate(7);
                memory.allocate(10);
                memory.allocate(10);
                memory.allocate(16);

                const manager = new MemoryManagerBestFit(memory);

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

    });
});
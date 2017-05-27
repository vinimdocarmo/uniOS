'use strict';

describe('memory manager: ', function () {
    it('deve ser capaz de criar uma instância de MemoryManager', function () {
        expect(new MemoryManager(null, BestFit)).to.exists;
    });

    describe('quando o algoritmo de alocação usado for o best fit', function () {

        describe('e o método allocate for chamado', function () {

            let bestBlock,
                size = 5,
                memory;

            before(function () {
                memory = new LinkedList();

                memory.add(new BlockMemory(null, 6));
                memory.add(new BlockMemory(null, 7));
                memory.add(new BlockMemory({}, 10));
                memory.add(new BlockMemory({}, 11));
                memory.add(new BlockMemory({}, 16));

                const manager = new MemoryManagerBestFit(memory);

                bestBlock = manager.allocate(size);
            });

            it('retorna um bloco de memória', function () {
                expect(bestBlock).to.be.instanceOf(BlockMemory);
            });

            it('retorna o bloco que não está ocupado e que tem o menor valor maior igual ao espaço alocado', function () {

                let currentBlock = memory.head;
                let expectedBlock = currentBlock;

                do {
                    if (currentBlock.isHole()) {
                        if (currentBlock.size < expectedBlock.size && currentBlock.size < size) {
                            expectedBlock = currentBlock;
                        }
                    }
                } while(currentBlock = currentBlock.next());

                expect(bestBlock.isHole()).to.be.true;
                expect(expectedBlock).to.be.equal(bestBlock);
            });

        });

    });
});
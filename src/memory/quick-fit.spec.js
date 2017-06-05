'use strict';

describe('quick fit: ', function () {

    let BlockMemory, Memory, QuickFit, LinkedList;

    beforeEach(module('memory'));
    beforeEach(module('quick-fit'));
    beforeEach(module('linked-list'));

    beforeEach(inject(function (_BlockMemory_, _Memory_, _QuickFit_, _LinkedList_) {
        BlockMemory = _BlockMemory_;
        Memory = _Memory_;
        QuickFit = _QuickFit_;
        LinkedList = _LinkedList_;
    }));

    describe('quando criar uma instancia do algoritmo passando a memória', function () {

        let memory, quickFit;

        beforeEach(function () {
            memory = new Memory(10000);

            memory.allocate(8);
            memory.allocate(20);
            memory.allocate(20);
            memory.allocate(20);
            memory.allocate(30);
            memory.allocate(30);
            memory.allocate(30);
            memory.allocate(40);
            memory.allocate(256);
            memory.allocate(30);
            memory.allocate(30);
            memory.allocate(256);
            memory.allocate(256);
            memory.allocate(256);

            quickFit = new QuickFit(memory);

        });

        it('deve ser criado um histograma de requisições após 10 requisições de alocação de memória', function () {
            quickFit.allocate(256);
            quickFit.allocate(256);
            quickFit.allocate(256);
            quickFit.allocate(30);
            quickFit.allocate(30);
            quickFit.allocate(30);
            quickFit.allocate(30);
            quickFit.allocate(40);
            quickFit.allocate(40);
            quickFit.allocate(8);

            const histogram = quickFit.getHistogram();

            expect(histogram['256']).to.be.equal(3);
            expect(histogram['30']).to.be.equal(4);
            expect(histogram['40']).to.be.equal(2);
            expect(histogram['8']).to.be.equal(1);
        });

        describe('e passando 2 e 10 como número de listas e intervalo de requisições', function () {

            let memory, quickFit, numberOfLists = 2, requestsInterval = 10, expectedBlock;

            beforeEach(function () {
                memory = new Memory(4000);

                memory.allocate(8).free();
                memory.allocate(8).free();
                memory.allocate(8).free();
                memory.allocate(8).free();
                memory.allocate(50).free();
                memory.allocate(116).free();
                memory.allocate(256).free();
                memory.allocate(256).free();
                memory.allocate(256).free();
                memory.allocate(256).free();
                memory.allocate(256).free();
                memory.allocate(256).free();
                memory.allocate(256).free();
                memory.allocate(10).free();
                memory.allocate(10).free();
                memory.allocate(50).free();
                memory.allocate(4).free();
                memory.allocate(4).free();

                quickFit = new QuickFit(memory, numberOfLists, requestsInterval);
            });

            describe('e fazendo 10 requesições de alocação de memória', function () {

                const sizeMostRequested = 256,
                    secondSizeMostRequested = 8;

                beforeEach(function () {
                    quickFit.allocate(sizeMostRequested);
                    quickFit.allocate(sizeMostRequested);
                    quickFit.allocate(sizeMostRequested);
                    quickFit.allocate(sizeMostRequested);
                    quickFit.allocate(sizeMostRequested);
                    quickFit.allocate(secondSizeMostRequested);
                    quickFit.allocate(secondSizeMostRequested);
                    quickFit.allocate(secondSizeMostRequested);
                    quickFit.allocate(4);
                    quickFit.allocate(4);
                });

                it('deve ser criada um cache com 2 listas com os blocos de tamanhos mais requisitados', function () {

                    const cache = quickFit.getCache();
                    let expectedNumberOfLists = 0;

                    for (let size in cache) {
                        if (cache.hasOwnProperty(size)) {
                            expectedNumberOfLists++;
                        }
                    }

                    expect(expectedNumberOfLists).to.be.equal(numberOfLists);

                    expect(cache[sizeMostRequested]).to.exists;
                    expect(cache[secondSizeMostRequested]).to.exists;
                });

                it('a lista que tem como chave o tamanho mais requisitado deve ter todos os blocos de memória vazios com este tamanho', function () {
                    const blocksWithSizeMostRequested = quickFit.getCache()[sizeMostRequested];

                    let numberOfHoleBlocksThatHaveTheMostRequestedSize = 0;

                    let currentBlock = memory.getFirstBlock();

                    do {
                         if (currentBlock.isHole() && currentBlock.size === sizeMostRequested) {
                             numberOfHoleBlocksThatHaveTheMostRequestedSize++;
                         }
                    } while (currentBlock = currentBlock.next());

                    expect(blocksWithSizeMostRequested.size).to.be.equal(numberOfHoleBlocksThatHaveTheMostRequestedSize);
                });

                it('a lista que tem como chave o segundo tamanho mais requisitado deve ter todos os blocos de memória vazios com este tamanho', function () {
                    const cacheBlocksWithSizeSecondMostRequested = quickFit.getCache()[secondSizeMostRequested];

                    let numberOfHoleBlocksThatHaveSecondMostRequestedSize = 0;

                    let currentBlock = memory.getFirstBlock();

                    do {
                        if (currentBlock.isHole() && currentBlock.size === secondSizeMostRequested) {
                            numberOfHoleBlocksThatHaveSecondMostRequestedSize++;
                        }
                    } while (currentBlock = currentBlock.next());

                    expect(cacheBlocksWithSizeSecondMostRequested.size).to.be.equal(numberOfHoleBlocksThatHaveSecondMostRequestedSize);
                });

                it('deve manter uma lista que possui todos os outros bloco de memória vazios', function () {
                    const freeBlocks = quickFit.getFreeBlocks();
                    const cache = quickFit.getCache();
                    let currentBlock = memory.getFirstBlock();
                    let freeBlocksCount = 0;

                    do {
                        if (currentBlock.isHole() && !cache[currentBlock.getSize()]) {
                            freeBlocksCount++;
                        }
                    } while (currentBlock = currentBlock.next());

                    expect(freeBlocks.size).to.be.equal(freeBlocksCount);
                });

                it('o histograma deve ser esvaziado', function () {
                    expect(Object.keys(quickFit.getHistogram())).to.have.length(0);
                });

                describe('e se a próxima requisição não estiver no cache', function () {
                    let block, firstFreeBlock;

                    beforeEach(function () {
                        firstFreeBlock = quickFit.getFreeBlocks().head.data;
                        block = quickFit.allocate(2);
                    });

                    it('o bloco retornado deve ser o primeiro bloco livre na lista \'others\'', function () {
                        expect(block).to.be.equal(firstFreeBlock);

                    });
                });

                describe('e se a próxima requisição estiver no cache', function () {

                    let block;

                    beforeEach(function () {
                        expectedBlock = quickFit.getCache()[sizeMostRequested].head.data;
                        block = quickFit.allocate(sizeMostRequested);
                    });

                    it('deve retornar o primeiro bloco vazio da lista no cache', function () {
                        expect(block).to.be.equal(expectedBlock);
                    });

                    /**
                     * TODO: só deve desalocar a memória do processo quando ele for abortado ou terminado
                     * TODO: se não tiver memória para alocar para o processo ele deve ser abortado
                     */

                });
            });


        });

    });

});
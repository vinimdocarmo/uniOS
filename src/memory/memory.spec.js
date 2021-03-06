'use strict';

describe('quando criar uma instancia de Memory', function () {

    let Memory, LinkedList;

    beforeEach(module('memory'));
    beforeEach(module('linked-list'));

    beforeEach(inject(function(_Memory_, _LinkedList_) {
        Memory = _Memory_;
        LinkedList = _LinkedList_;
    }));

    it('deve dar erro caso não se passa o tamanho total da memória no construtor', function () {
        try {
            new Memory();
            throw new Error('deveria ter lançado um erro de TypeError');
        } catch(error) {
            expect(error).to.be.instanceOf(TypeError);
        }
    });

    it('deve retornar o tamanho total da memória ao chamar o método getSize', function () {
        const size = 256;
        const memory = new Memory(size, new LinkedList());
        expect(memory.getSize()).to.be.equal(size);
    });

    describe('e alocar espaços na memória', function () {

        let memory;
        let firstBlockSize;

        before(function () {
            memory = new Memory(50, new LinkedList());
            firstBlockSize = 32;

            memory.allocate(firstBlockSize);
            memory.allocate(16);
        });

        it('deve retornar o primeiro bloco de memória ao chamar o método getFirstBlock', function () {
            expect(memory.getFirstBlock().size).to.be.equal(firstBlockSize);
        });

        it('deve retornar um array de blocos quando chamar o método asArray', function () {
            const memoryArray = memory.asArray();
            expect(memoryArray).to.have.length(memory.getBlockList().getSize());

            let currentBlock = memory.getFirstBlock(), i = 0;

            while (currentBlock) {
                expect(memoryArray[i]).to.be.equal(currentBlock);
                i++;
                currentBlock = currentBlock.next();
            }
        });

        describe('e a memória já estiver cheia', function () {
            it('deve dar erro caso tente alocar um bloco que seja maior que o espaço livre', function () {
                try {
                    memory.allocate(50);
                    throw new Error('deveria ter dado erro de falta de espaço');
                } catch (error) {
                    expect(error.message).to.match(/OutOfMemory/);
                }
            });
        });
    });
});
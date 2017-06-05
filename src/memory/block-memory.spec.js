'use strict';

describe('block memory: ', function () {

    let BlockMemory, Process;

    beforeEach(module('memory'));
    beforeEach(module('process'));

    beforeEach(inject(function (_BlockMemory_, _Process_) {
        BlockMemory = _BlockMemory_;
        Process = _Process_;
    }));

    describe('ao criar um bloco de memória', function () {

        let block;
        const size = 16;

        beforeEach(function () {
            block = new BlockMemory(size);
        });

        it('o tamanho alocado deve ser igual ao tamanho do bloco', function () {
            expect(block.size).to.be.equal(size);
            expect(block.allocatedSize).to.be.equal(size);
        });

        it('deve ser capaz de setar o processo associado ao bloco', function () {
            const process = new Process();
            block.setProcess(process);
            expect(block.getProcess()).to.be.equal(process);
        });

        describe('e o bloco for liberado', function () {
            beforeEach(function () {
                block.setProcess(new Process());
                block.free();
            });

            it('o método isHole deve retornar true', function () {
                expect(block.isHole()).to.be.true;
            });

            it('o processo deve ser nulo', function () {
                 expect(block.getProcess()).to.be.null;
            });
        });
        
        it('deve ser capaz de setar um novo valor de tamanho alocado', function () {
            const size = 2;
            block.setAllocatedSize(size);
            expect(block.getAllocatedSize()).to.be.equal(size);
        });

        it('deve dar erro caso o tamanho alocado seja maior que o tamanho do bloco', function () {
            try {
                block.setAllocatedSize(block.getSize() + 1);
                throw new Error('deveria ter dado erro');
            } catch (error) {
                expect(error.message).to.match(/attempt to allocate/);
            }
        });

    });

    it('deve ser capaz de setar o próximo bloco', function () {
        const size  = 8;
        const block = new BlockMemory(size);
        const nextBlock = new BlockMemory(5);

        block.setNextBlock(nextBlock);
    });

    describe('quando criar diversos blocos de memória', function () {

        let blocks = [];

        before(function () {
            blocks.push(new BlockMemory(19));
            blocks.push(new BlockMemory(19));
            blocks.push(new BlockMemory(19));
            blocks.push(new BlockMemory(19));
            blocks.push(new BlockMemory(19));
            blocks.push(new BlockMemory(19));
            blocks.push(new BlockMemory(19));
        });

        it('cada um deve ter um identificador diferente de todos os outros', function () {
            blocks.forEach(function (block) {
                blocks.forEach(function (otherBlock) {
                    if (block !== otherBlock) {
                        expect(block.id).to.not.be.equal(otherBlock.id);
                    }
                });
            });
        });
    })
});
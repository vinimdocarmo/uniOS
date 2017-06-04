'use strict';

describe('block memory: ', function () {

    let BlockMemory;

    beforeEach(module('memory'));

    beforeEach(inject(function (_BlockMemory_) {
        BlockMemory = _BlockMemory_;
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

        describe('e o bloco for liberado', function () {
            beforeEach(function () {
                block.free();
            });

            it('o método isHole deve retornar true', function () {
                expect(block.isHole()).to.be.true;
            });
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
'use strict';

describe('block memory: ', function () {
    it('deve ser capaz de criar uma instancia de entry', function () {
        const process = new Object();
        const len  = 8;
        const entry = new BlockMemory(process, len);

        expect(entry).to.exists;
        expect(entry.data).to.be.equal(process);
        expect(entry.size).to.be.equal(len);
    });

    it('deve ser capaz de setar a próxima entry', function () {
        const process = new Object();
        const len  = 8;
        const entry = new BlockMemory(process, len);
        const nextEntry = new BlockMemory({}, 5);

        entry.setNextBlock(nextEntry);
    });

    describe('quando uma entry não possuir um dado', function () {
        let entry;

        before(function () {
            entry = new BlockMemory(null, 10);
        });

        it('o método isHole() deve retornar true', function () {
            expect(entry.isHole()).to.be.true;
        });
    })
});
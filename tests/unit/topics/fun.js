'use strict';

const { expect } = require('chai');

const { ping } = require('../../../topics/fun');

describe('fun', () => {
    describe('ping', () => {
        it('should match regex', () => {
            expect(ping.regex.test('ping')).to.be.true;
        });

        it(`should respond with 'pong'`, () => {
            ping.handler({ reply: (res) => expect(res).to.equal('pong') });
        });
    });
});

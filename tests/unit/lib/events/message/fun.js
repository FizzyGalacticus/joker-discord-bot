'use strict';

const { expect } = require('chai');

const { ping } = require('../../../../../lib/events/message/fun');

describe('fun', () => {
    describe('ping', () => {
        it('should match regex', () => {
            expect(ping.match.test('ping')).to.be.true;
        });

        it(`should respond with 'pong'`, () => {
            ping.process({ reply: (res) => expect(res).to.equal('pong') });
        });
    });
});

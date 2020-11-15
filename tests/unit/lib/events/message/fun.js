'use strict';

const { expect } = require('chai');

const { parseMatch } = require('../../../../../util/regex');

const { ping, foo, fizz, roast, compliment, comeOn, pickUp } = require('../../../../../lib/events/message/fun');

describe('fun', () => {
    describe('ping', () => {
        it(`should respond with 'pong'`, () => {
            ping.process(null, { reply: res => expect(res).to.equal('pong') });
        });
    });

    describe('foo', () => {
        it(`should respond with 'bar'`, () => {
            foo.process(null, { reply: res => expect(res).to.equal('bar') });
        });
    });

    describe('fizz', () => {
        it(`should respond with 'buzz'`, () => {
            fizz.process(null, { reply: res => expect(res).to.equal('buzz') });
        });
    });

    describe(`roast`, () => {
        it(`should only be triggered with 'roast' at the beginning of a message`, () => {
            let matches = parseMatch(roast.match, 'roast Leeroy');

            expect(matches).to.have.lengthOf(2);

            matches = parseMatch(roast.match, 'This pot roast is great!');

            expect(matches).to.have.lengthOf(0);
        });
    });

    describe(`compliment`, () => {
        it(`should only be triggered with 'compliment' at the beginning of a message`, () => {
            let matches = parseMatch(compliment.match, 'compliment Leeroy');

            expect(matches).to.have.lengthOf(2);

            matches = parseMatch(compliment.match, `I don't know how to take a compliment`);

            expect(matches).to.have.lengthOf(0);
        });
    });

    describe(`comeOn`, () => {
        it(`should only be triggered with 'come on to' at the beginning of a message`, () => {
            let matches = parseMatch(comeOn.match, 'come on to Leeroy');

            expect(matches).to.have.lengthOf(2);

            matches = parseMatch(comeOn.match, `I don't like to come on to strangers`);

            expect(matches).to.have.lengthOf(0);
        });
    });

    describe(`pickUp`, () => {
        it(`should only be triggered with 'pick up' at the beginning of a message`, () => {
            let matches = parseMatch(pickUp.match, 'pick up Leeroy');

            expect(matches).to.have.lengthOf(2);

            matches = parseMatch(pickUp.match, `I like to pick up things and put them down`);

            expect(matches).to.have.lengthOf(0);
        });
    });
});

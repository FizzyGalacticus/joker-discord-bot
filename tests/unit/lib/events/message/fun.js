'use strict';

const { expect } = require('chai');

const { ping, foo, fizz } = require('../../../../../lib/events/message/fun');

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
        it(`should respond with 'bar'`, () => {
            fizz.process(null, { reply: res => expect(res).to.equal('buzz') });
        });
    });
});

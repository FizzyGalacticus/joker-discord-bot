'use strict';

const log = require('@fizzygalacticus/colored-fancy-log');

const wrap = (fn = () => {}) => async (...params) => {
    try {
        await fn(...params);
    } catch (err) {
        log.error(`Error from handler: ${fn.name}\n ${err.message}`);
    }
};

module.exports = { wrap };

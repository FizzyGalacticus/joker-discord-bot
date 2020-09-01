'use strict';

const arrUtil = require('../../../util/array');

module.exports = {
    ping: {
        match: /ping/i,
        process: (message) => message.reply('pong'),
    },
    isBetter: {
        match: /(which|who) is (better|worse),?\?* (.*) or (.*?)\??$/i,
        process: (message, match) => {
            const res = arrUtil.getRandomElement(match.slice(3));

            message.reply(`I think ${res}`);
        },
    },
    ban: {
        match: /ban (.*)/i,
        process: (message, match) => message.reply(`${match[1]} has been banned`),
    },
};

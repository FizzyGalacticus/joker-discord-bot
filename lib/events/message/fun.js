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
            const possibles = [
                ...match.slice(3).map((r) => `I think ${r}`),
                `I could tell you, but then I'd have to kill you`,
                'Answering that would be a matter of national security',
                `You can't possibly compare them!`,
                'Both hold a special place in my heart',
            ];

            const res = arrUtil.getRandomElement(possibles);

            message.reply(res);
        },
    },
    ban: {
        match: /ban (.*)/i,
        process: (message, match) => message.reply(`${match[1]} has been banned`),
    },
};

'use strict';

module.exports = {
    ping: {
        match: /ping/,
        process: (message) => message.reply('pong'),
    },
};

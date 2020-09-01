'use strict';

module.exports = {
    ping: {
        regex: /ping/,
        handler: (message) => message.reply('pong'),
    },
};

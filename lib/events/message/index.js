'use strict';

const { requireAllInDir } = require('../../../util/fs');
const { parseMatch } = require('../../../util/regex');

const messageHandlers = requireAllInDir(__dirname);

module.exports = client => message =>
    Object.values(messageHandlers).forEach(topicHandler =>
        Object.values(topicHandler).forEach(handler => {
            if (handler.match instanceof RegExp && handler.match.test(message.content)) {
                return handler.process(client, message, parseMatch(handler.match, message.content));
            } else if (
                typeof handler.match === 'string' &&
                handler.match.toLowerCase() === message.content.toLowerCase()
            ) {
                return handler.process(client, message);
            }
        })
    );

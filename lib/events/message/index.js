'use strict';

const { requireAllInDir } = require('../../../util/fs');
const { parseMatch } = require('../../../util/regex');

const messageHandlers = requireAllInDir(__dirname);

module.exports = (message) =>
    Object.values(messageHandlers).forEach((topicHandler) =>
        Object.values(topicHandler).forEach((handler) => {
            if (handler.match.test(message.content)) {
                return handler.process(message, parseMatch(handler.match, message.content));
            }
        })
    );

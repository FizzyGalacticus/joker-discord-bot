'use strict';

const { requireAllInDir } = require('../../../util/fs');
const { parseMatch } = require('../../../util/regex');

const messageHandlers = requireAllInDir(__dirname);

module.exports = client => message => {
    // console.log(message.author.username);

    return Promise.all(
        Object.values(messageHandlers).reduce(
            (acc, topicHandler) => [
                ...acc,
                ...Object.values(topicHandler)
                    .map(handler => {
                        const matchesRegex = handler.match instanceof RegExp && handler.match.test(message.content);
                        const matchesString =
                            typeof handler.match === 'string' &&
                            (handler.match === '*' || handler.match.toLowerCase() === message.content.toLowerCase());

                        if (matchesRegex) {
                            return handler.process(client, message, parseMatch(handler.match, message.content));
                        } else if (matchesString) {
                            return handler.process(client, message);
                        }
                    })
                    .filter(s => s),
            ],
            []
        )
    );
};

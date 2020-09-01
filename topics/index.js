'use strict';

const fs = require('fs');
const path = require('path');

const topicHandlerFiles = fs.readdirSync(__dirname);

const handlers = topicHandlerFiles.map((p) => require(path.join(__dirname, p)));

module.exports = (message) => {
    handlers.forEach((handlerDef) =>
        Object.values(handlerDef).forEach((handler) => {
            if (handler.regex.test(message.content)) {
                handler.handler(message);
            }
        })
    );
};

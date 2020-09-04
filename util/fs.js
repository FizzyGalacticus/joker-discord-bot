'use strict';

const fs = require('fs');
const path = require('path');

const requireAllInDir = dir => {
    const all = fs.readdirSync(dir);

    return all.reduce((acc, reqPath) => {
        if (reqPath !== 'index.js') {
            acc[reqPath] = require(path.join(dir, reqPath));
        }

        return acc;
    }, {});
};

module.exports = { requireAllInDir };

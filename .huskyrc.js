'use strict';

const tasks = (...arr) => arr.reduce((acc, o) => [...acc, ...(Array.isArray(o) ? o : [o])], []).join(' && ');

module.exports = {
    hooks: {
        'pre-commit': tasks([
            `npx eslint --fix $(git diff --name-only --cached | grep '.js$') --no-ignore`,
            `git add $(git diff --name-only --cached)`,
            'npm run test',
        ]),
    },
};

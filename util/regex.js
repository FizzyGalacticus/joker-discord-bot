'use strict';

const parseMatch = (regex, str) => {
    const m = regex.exec(str);

    if (!m) {
        return [];
    }

    return Object.keys(m)
        .filter(k => !isNaN(k))
        .map(k => m[k]);
};

module.exports = { parseMatch };

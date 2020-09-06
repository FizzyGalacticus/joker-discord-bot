'use strict';

const createFieldSearcher = (objKey, fieldKey, useCache = true) => (searchObj, searchVal) => {
    let cache = searchObj[objKey];

    if (useCache) {
        cache = cache?.cache;
    }

    if (cache) {
        for (const field of cache.values()) {
            if (field[fieldKey] === searchVal) {
                return field;
            }
        }
    }
};

const createIdSearcher = (objKey, useCache = true) => (searchObj, searchId) => {
    let cache = searchObj[objKey];

    if (useCache) {
        cache = cache?.cache;
    }

    if (cache) {
        for (const [id, field] of cache) {
            if (id === searchId) {
                return field;
            }
        }
    }
};

module.exports = { createFieldSearcher, createIdSearcher };

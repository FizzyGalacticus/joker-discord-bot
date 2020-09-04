'use strict';

const createFieldSearcher = (objKey, fieldKey) => (client, searchVal) => {
    const cache = client[objKey]?.cache;

    if (cache) {
        for (const field of cache.values()) {
            if (field[fieldKey] === searchVal) {
                return field;
            }
        }
    }
};

const createIdSearcher = objKey => (client, searchId) => {
    const cache = client[objKey]?.cache;

    if (cache) {
        for (const [id, field] of cache) {
            if (id === searchId) {
                return field;
            }
        }
    }
};

const getChannelByName = createFieldSearcher('channels', 'name');

const getChannelById = createIdSearcher('channels');

const getUserByUsername = createFieldSearcher('users', 'username');

const getUserById = createIdSearcher('users');

module.exports = {
    getChannelByName,
    getChannelById,
    getUserByUsername,
    getUserById,
};

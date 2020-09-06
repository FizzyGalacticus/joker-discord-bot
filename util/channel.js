'use strict';

const { createFieldSearcher, createIdSearcher } = require('./map');

const getChannelByName = createFieldSearcher('channels', 'name');

const getChannelById = createIdSearcher('channels');

const getUserByUsername = createFieldSearcher('users', 'username');

const getUserById = createIdSearcher('users');

const getDMByUserId = (searchObj, id) => getUserById(searchObj, id).createDM();

const getDMByUsername = (searchObj, username) => getUserByUsername(searchObj, username).createDM();

const getMemberByUserId = createIdSearcher('members');

module.exports = {
    getChannelByName,
    getChannelById,
    getUserByUsername,
    getUserById,
    getDMByUserId,
    getDMByUsername,
    getMemberByUserId,
};

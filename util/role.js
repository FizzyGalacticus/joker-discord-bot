'use strict';

const { createFieldSearcher, createIdSearcher } = require('./map');

const getRoleByName = createFieldSearcher('roles', 'name');

const getRoleById = createIdSearcher('roles');

const getMemberByUserId = createIdSearcher('members', false);

module.exports = { getRoleById, getRoleByName, getMemberByUserId };

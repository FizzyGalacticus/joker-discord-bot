'use strict';

const getRandomElement = (arr = []) => arr[Math.floor(Math.random() * arr.length)];

module.exports = { getRandomElement };

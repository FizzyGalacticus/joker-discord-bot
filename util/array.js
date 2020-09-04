'use strict';

const getRandomElement = (arr = [], previousIndex) => {
    let index;

    do {
        index = Math.floor(Math.random() * arr.length);
    } while (index === previousIndex);

    const el = arr[index];

    return { el, index };
};

module.exports = { getRandomElement };

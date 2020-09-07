'use strict';

const getRandomElement = (arr = [], previousIndex = []) => {
    const previousIsArray = Array.isArray(previousIndex);
    let index;

    if (previousIsArray && previousIndex.length === arr.length) {
        previousIndex = [];
    }

    do {
        index = Math.floor(Math.random() * arr.length);
    } while (Array.isArray(previousIndex) ? previousIndex.includes(index) : index === previousIndex);

    const el = arr[index];

    return { el, index: Number.isInteger(previousIndex) ? index : [...previousIndex, index] };
};

module.exports = { getRandomElement };

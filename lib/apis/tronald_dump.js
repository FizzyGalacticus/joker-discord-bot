'use strict';

const fetch = require('node-fetch');

const arrUtil = require('../../util/array');

const baseUrl = `https://api.tronalddump.io`;
const search = `search/quote`;
const quote = `/random/quote`;

const options = {
    headers: {
        Accept: 'application/hal+json',
    },
};

const searchSubject = async subject => {
    const res = await fetch(`${baseUrl}/${search}?query=${subject}`, options);

    const { _embedded: { quotes = [{ tags: [null], value: null }] } = {} } = await res.json();

    const {
        el: {
            tags: [quoteSubject],
            value: quote,
        },
    } = arrUtil.getRandomElement(quotes);

    return { subject: quoteSubject, quote };
};

const getQuote = async () => {
    const url = `${baseUrl}/${quote}`;

    const res = await fetch(url, options);

    const {
        tags: [subject],
        value,
    } = await res.json();

    return { subject, quote: value };
};

module.exports = { getQuote, searchSubject };

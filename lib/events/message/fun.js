'use strict';

const { getQuote: getTrumpQuote, searchSubject: searchTrumpSubject } = require('../../apis/tronald_dump');

const arrUtil = require('../../../util/array');
const { getDMByUsername } = require('../../../util/channel');
const { getMentionString } = require('../../../util/mention');

const isBetterResponses = require('../../../config/responses/is_better.json');
const roasts = require('../../../config/responses/roasts.json');
const compliments = require('../../../config/responses/compliments.json');
const pickups = require('../../../config/responses/pickups.json');
const arshTrolls = require('../../../config/responses/arsh_trolls.json');

const trumpThinkResponses = [
    'a tiny piece of the puzzle about',
    'a gem I found regarding',
    'a little bit of wisdom on',
    `the best thing I've ever read about`,
    `the word of POTUS regarding`,
    `some gospel truth on`,
];

const arshTrollResponses = [...roasts, ...arshTrolls];

let lastIsBetter;

let messagesSinceLastArshTroll = 0;
let lastArshTroll;

let lastTrumpThink;

const getArshTrollCounter = () =>
    arshTrollResponses.length * 2 - (messagesSinceLastArshTroll % (arshTrollResponses.length * 2)) - 1;

const singleWordsAndResponses = { ping: 'pong', foo: 'bar', fizz: 'buzz' };

const createFromArrayResponses = (match, availableResponses) => {
    let lastResponse;

    const process = (client, message) => {
        const mention = message.mentions?.users?.first();

        const { el, index } = arrUtil.getRandomElement(availableResponses, lastResponse);

        lastResponse = index;

        if (mention) {
            return message.channel.send(`${mention}, ${el}`);
        }

        return message.reply(el);
    };

    return { match, process };
};

module.exports = {
    ...Object.entries(singleWordsAndResponses).reduce(
        (acc, [msg, res]) => ({ ...acc, [msg]: { match: msg, process: (client, message) => message.reply(res) } }),
        {}
    ),
    isBetter: {
        match: /(which|who|what|where) (is|would be) (better|worse)(,|, | )(.*)(,|, | )or (.*)\??$/i,
        process: (client, message, match) => {
            const options = [match[5], match[7]].map(s => {
                let newStr = s;

                if (newStr.endsWith(',') || newStr.endsWith('?')) {
                    newStr = s
                        .split('')
                        .slice(0, s.length - 1)
                        .join('');
                }

                return newStr.trim();
            });

            const possibles = [...options.map(r => `I think ${r.trim()}.`), ...isBetterResponses];

            const { el, index } = arrUtil.getRandomElement(possibles, lastIsBetter);

            lastIsBetter = index;

            return message.reply(el);
        },
    },
    roast: createFromArrayResponses(/roast (.*)/i, roasts),
    compliment: createFromArrayResponses(/compliment (.*)/i, compliments),
    comeOn: createFromArrayResponses(/come on to (.*)/i, pickups),
    pickUp: createFromArrayResponses(/pick up (.*)/i, pickups),
    trumpThink: {
        match: /what does( Donald)?? Trump think( about (.*))??\??$/i,
        process: async (client, message, match) => {
            const [subjMatch] = match.slice(3);

            const subject = subjMatch?.split('?').join('');

            const { el: modifier, index } = arrUtil.getRandomElement(trumpThinkResponses, lastTrumpThink);
            lastTrumpThink = index;

            let msg = '';

            if (subject) {
                const { subject: quoteSubject, quote } = await searchTrumpSubject(subject);

                if (quote) {
                    msg = `Here's ${modifier} \`${quoteSubject}\`:\n${quote}`;

                    return message.channel.send(msg);
                }

                msg = `I can't find anything on ${subject}, but `;
            }

            const { subject: quoteSubject, quote } = await getTrumpQuote(subject);

            msg = `${msg}Here is ${modifier} \`${quoteSubject}\`:\n${quote}`;

            return message.channel.send(msg);
        },
    },
    trollArsh: {
        match: '*',
        process: async (client, message) => {
            if (message.author.username === 'killerhawk') {
                const counter = getArshTrollCounter();

                if (counter === 0) {
                    const mention = message.mentions?.users?.first();
                    let response;

                    if (mention) {
                        response = `leave ${getMentionString(mention)} alone!`;
                    } else {
                        const { el, index } = arrUtil.getRandomElement(arshTrollResponses, lastArshTroll);
                        lastArshTroll = index;

                        response = el;
                    }

                    await message.channel.send(`${getMentionString(message.author)} ${response}`);
                }

                messagesSinceLastArshTroll++;

                if (counter === 1) {
                    const dm = await getDMByUsername(client, 'FizzyGalacticus');

                    return dm.send(`Arsh about to get trolled!`);
                }
            }
        },
    },
};

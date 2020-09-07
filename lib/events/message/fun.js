'use strict';

const arrUtil = require('../../../util/array');
const { getDMByUsername } = require('../../../util/channel');
const { getMentionString } = require('../../../util/mention');

const isBetterResponses = require('../../../config/responses/is_better.json');
const roasts = require('../../../config/responses/roasts.json');
const arshTrolls = require('../../../config/responses/arsh_trolls.json');

const arshTrollResponses = [...roasts, ...arshTrolls];

let lastIsBetter;
let messagesSinceLastArshTroll = 0;
let lastArshTroll;

let lastRoast;

const getArshTrollCounter = () =>
    arshTrollResponses.length * 2 - (messagesSinceLastArshTroll % (arshTrollResponses.length * 2)) - 1;

const singleWordsAndResponses = { ping: 'pong', foo: 'bar', fizz: 'buzz' };

module.exports = {
    ...Object.entries(singleWordsAndResponses).reduce(
        (acc, [msg, res]) => ({ ...acc, [msg]: { match: msg, process: (client, message) => message.reply(res) } }),
        {}
    ),
    isBetter: {
        match: /(which|who) is (better|worse),?\?* (.*) or (.*?)\??$/i,
        process: (client, message, match) => {
            const possibles = [...match.slice(3).map(r => `I think ${r.trim()}`), ...isBetterResponses];

            const { el, index } = arrUtil.getRandomElement(possibles, lastIsBetter);

            lastIsBetter = index;

            return message.reply(el);
        },
    },
    roast: {
        match: /roast (.*)/i,
        process: (client, message) => {
            const mention = message.mentions?.users?.first();

            const { el, index } = arrUtil.getRandomElement(roasts, lastRoast);

            lastRoast = index;

            if (mention) {
                return message.channel.send(`${mention}, ${el}`);
            }

            return message.reply(el);
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

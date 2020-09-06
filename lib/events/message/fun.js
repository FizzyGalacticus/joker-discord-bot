'use strict';

const arrUtil = require('../../../util/array');
const { getDMByUsername } = require('../../../util/channel');
const { getMentionString } = require('../../../util/mention');

let lastIsBetter;
let messagesSinceLastArshTroll = 0;
let lastArshTroll;

const arshTrollMessages = [
    'do you talk to your mother like that?',
    'what are you getting at?',
    'how much have you had to drink today?',
    'how much wood could a wood chuck chuck if a wood chuck could chuck wood?',
];

const getArshTrollCounter = () =>
    arshTrollMessages.length * 2 - (messagesSinceLastArshTroll % (arshTrollMessages.length * 2)) - 1;

const singleWordsAndResponses = { ping: 'pong', foo: 'bar', fizz: 'buzz' };

module.exports = {
    ...Object.entries(singleWordsAndResponses).reduce(
        (acc, [msg, res]) => ({ ...acc, [msg]: { match: msg, process: (client, message) => message.reply(res) } }),
        {}
    ),
    isBetter: {
        match: /(which|who) is (better|worse),?\?* (.*) or (.*?)\??$/i,
        process: (client, message, match) => {
            const possibles = [
                ...match.slice(3).map(r => `I think ${r.trim()}`),
                `I could tell you, but then I'd have to kill you`,
                'Answering that would be a matter of national security',
                `You can't possibly compare them!`,
                'Both hold a special place in my heart',
            ];

            const { el, index } = arrUtil.getRandomElement(possibles, lastIsBetter);

            lastIsBetter = index;

            return message.reply(el);
        },
    },
    ban: {
        match: /ban (.*)/i,
        process: (client, message) => {
            const mention = message.mentions?.users?.first();

            if (mention) {
                return message.channel.send(`${getMentionString(mention)} has been banned`);
            }
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
                        const { el, index } = arrUtil.getRandomElement(arshTrollMessages, lastArshTroll);
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

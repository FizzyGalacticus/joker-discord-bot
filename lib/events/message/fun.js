'use strict';

const arrUtil = require('../../../util/array');

let lastIsBetter;
let messagesSinceLastArshTroll = 0;
let lastArshTroll;

const arshTrollMessages = [
    'do you talk to your mother like that?',
    'what are you getting at?',
    'how much have you had to drink today?',
    'how much wood could a wood chuck chunk if a wood chuck could chuck wood?',
];

const singleWordsAndResponses = { ping: 'pong', foo: 'bar', fizz: 'buzz' };

const getMentionStr = user => `<@${user.id}>`;

module.exports = {
    ...Object.entries(singleWordsAndResponses).reduce(
        (acc, [msg, res]) => ({ ...acc, [msg]: { match: msg, process: (client, message) => message.reply(res) } }),
        {}
    ),
    isBetter: {
        match: /(which|who) is (better|worse),?\?* (.*) or (.*?)\??$/i,
        process: (client, message, match) => {
            const possibles = [
                ...match.slice(3).map(r => `I think ${r}`),
                `I could tell you, but then I'd have to kill you`,
                'Answering that would be a matter of national security',
                `You can't possibly compare them!`,
                'Both hold a special place in my heart',
            ];

            const { el, index } = arrUtil.getRandomElement(possibles, lastIsBetter);

            lastIsBetter = index;

            message.reply(el);
        },
    },
    ban: {
        match: /ban (.*)/i,
        process: (client, message) => {
            const mention = message.mentions?.users?.first();

            if (mention) {
                message.channel.send(`${getMentionStr(mention)} has been banned`);
            }
        },
    },
    trollArsh: {
        match: new RegExp('(.*)', 'igm'),
        process: (client, message) => {
            if (message.author.username === 'FizzyGalacticus') {
                if (messagesSinceLastArshTroll % (arshTrollMessages.length * 2) === 0) {
                    const mention = message.mentions?.users?.first();
                    let response;

                    if (mention) {
                        response = `leave ${mention} alone!`;
                    } else {
                        const { el, index } = arrUtil.getRandomElement(arshTrollMessages, lastArshTroll);
                        lastArshTroll = index;

                        response = el;
                    }

                    message.channel.send(`${getMentionStr(message.author)} ${response}`);
                }

                messagesSinceLastArshTroll++;
            }
        },
    },
};

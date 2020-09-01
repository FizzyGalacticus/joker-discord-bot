'use strict';

const Discord = require('discord.js');
const log = require('@fizzygalacticus/colored-fancy-log');

const topicRouter = require('./topics');

const config = require('./config');

const env = config.get('env');

const client = new Discord.Client({ fetchAllMembers: true, presence: { activity: { name: `with himself` } } });

const start = async () => {
    client.on('ready', async () => {
        if (config.get('startup.enabled')) {
            const startupMessages = config.get('startup.messages');
            const startMsg = startupMessages[Math.floor(Math.random() * startupMessages.length)];

            let channel;

            if (env === 'prod') {
                channel = await client.channels.fetch(config.get('channels.general'), true);
            } else {
                const user = await client.users.fetch(config.get('channels.general'), true);

                channel = await user.createDM();
            }

            channel.send(startMsg);
        }
    });

    client.on('message', (message) => topicRouter(message));

    try {
        await client.login(config.get('credentials.token'));
    } catch (err) {
        log.error(err);
    }
};

start();

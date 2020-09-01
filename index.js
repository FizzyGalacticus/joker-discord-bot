'use strict';

const Discord = require('discord.js');
const log = require('@fizzygalacticus/colored-fancy-log');

const eventHandlers = require('./lib/events');

const config = require('./config');

const env = config.get('env');

const start = async () => {
    const activities = config.get('startup.activities');
    const activity = activities[Math.floor(Math.random() * activities.length)];

    const client = new Discord.Client({ fetchAllMembers: true, presence: { activity: { name: activity } } });

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

    Object.entries(eventHandlers).forEach(([e, handler]) => {
        try {
            client.on(e, handler);
        } catch (err) {
            log.error(err);
        }
    });

    try {
        await client.login(config.get('credentials.token'));
    } catch (err) {
        log.error(err);
    }
};

start();

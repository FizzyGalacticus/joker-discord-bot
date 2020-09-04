'use strict';

const Discord = require('discord.js');
const log = require('@fizzygalacticus/colored-fancy-log');

const eventHandlers = require('./lib/events');

const config = require('./config');

const start = async () => {
    const activities = config.get('startup.activities');
    const activity = activities[Math.floor(Math.random() * activities.length)];

    const client = new Discord.Client({ fetchAllMembers: true, presence: { activity: { name: activity } } });

    Object.entries(eventHandlers).forEach(([e, handler]) => {
        try {
            client.on(e, handler(client));
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

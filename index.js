'use strict';

const Discord = require('discord.js');
const log = require('@fizzygalacticus/colored-fancy-log');

const eventHandlers = require('./lib/events');
const handlerUtil = require('./util/handler');

const config = require('./config');

const start = async () => {
    log.info('Starting...');
    const activities = config.get('startup.activities');
    const activity = activities[Math.floor(Math.random() * activities.length)];

    const client = new Discord.Client({ fetchAllMembers: true, presence: { activity: { name: activity } } });

    Object.entries(eventHandlers).forEach(([e, handler]) => client.on(e, handlerUtil.wrap(handler(client))));

    try {
        await client.login(config.get('credentials.token'));
        log.success(`Started.`);
    } catch (err) {
        log.error(err);
    }
};

start();

'use strict';

const Discord = require('discord.js');
const log = require('@fizzygalacticus/colored-fancy-log');

const config = require('./config');

const client = new Discord.Client();

client.on('ready', () => log.log('Bonesaw is ready!'));

client.on('message', (message) => {
    if (message.content === 'ping') {
        message.reply('pong');
    }

    log.log('Received message:', message);
});

client.login(config.get('credentials.token')).catch((e) => log.error(e));

'use strict';

const path = require('path');

const convict = require('convict');

const conf = convict({
    env: {
        doc: 'The current Node environment',
        format: 'String',
        env: 'NODE_ENV',
        default: 'dev',
        arg: 'e',
    },
    credentials: {
        clientId: {
            doc: 'The Discord Client ID',
            format: 'Number',
            env: 'CLIENT_ID',
            default: '',
            arg: 'i',
        },
        clientSecret: {
            doc: 'The Discord Client Secret',
            format: 'String',
            env: 'CLIENT_SECRET',
            default: '',
            arg: 's',
        },
        token: {
            doc: 'The Discord Bot Token',
            format: 'String',
            env: 'BOT_TOKEN',
            default: '',
            arg: 't',
        },
    },
    channels: {
        general: {
            format: 'String',
            env: 'GENERAL_CHANNEL_ID',
            default: null,
        },
    },
    startup: {
        enabled: {
            doc: 'Whether or not startup messages will display',
            format: 'Boolean',
            default: true,
            env: 'STARTUP_ENABLED',
        },
        messages: {
            doc: 'Messages that the bot will display at startup',
            format: 'Array',
            default: [
                `Hey you guys!`,
                `Freaknik is back!`,
                `I'm here to kick ass and chew bubblegum, and I'm all outta gum.`,
                `What's crackin'?`,
                `I have been reborn!`,
            ],
            env: 'STARTUP_MESSAGES',
        },
        activities: {
            doc: 'Activity status messages',
            format: 'Array',
            default: [
                `with myself`,
                `with your mom`,
                `Pornhub`,
                `at his masturbation station`,
                `mom's spaghetti`,
                `with balls of steel`,
            ],
            env: 'STARTUP_MESSAGES',
        },
    },
});

const env = conf.get('env');

const envConfigPath = path.join(__dirname, 'env', `${env}.json`);

conf.loadFile(envConfigPath);

module.exports = conf;

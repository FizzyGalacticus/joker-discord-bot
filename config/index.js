'use strict';

const convict = require('convict');

const conf = convict({
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
});

module.exports = conf;

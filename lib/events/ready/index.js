'use strict';

const config = require('../../../config');

const channelUtil = require('../../../util/channel');
const arrUtil = require('../../../util/array');

const env = config.get('env');

const startupEnabled = config.get('startup.enabled');
const startupMessages = config.get('startup.messages');

const getDefaultMessageChannel = async client => {
    let channel;

    if (env === 'prod') {
        channel = channelUtil.getChannelByName(client, 'general');
    } else {
        const user = channelUtil.getUserByUsername(client, 'FizzyGalacticus');

        channel = await user.createDM();
    }

    return channel;
};

const postStartupGreeting = async client => {
    const { el: startMsg } = arrUtil.getRandomElement(startupMessages);

    const channel = await getDefaultMessageChannel(client);

    channel.send(startMsg);
};

module.exports = client => () => {
    const promises = [];

    if (startupEnabled) {
        promises.push(postStartupGreeting(client));
    }

    return Promise.all(promises);
};

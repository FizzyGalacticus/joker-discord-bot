'use strict';

const config = require('../../../config');

const channelUtil = require('../../../util/channel');
const arrUtil = require('../../../util/array');

const startupEnabled = config.get('startup.enabled');
const startupMessages = config.get('startup.messages');

const getStartupMessageChannel = client => {
    const user = channelUtil.getUserByUsername(client, 'FizzyGalacticus');

    return user?.createDM();
};

const postStartupGreeting = async client => {
    const { el: startMsg } = arrUtil.getRandomElement(startupMessages);

    const channel = await getStartupMessageChannel(client);

    return channel?.send(startMsg);
};

module.exports = client => () => {
    const promises = [];

    if (startupEnabled) {
        promises.push(postStartupGreeting(client));
    }

    return Promise.all(promises);
};

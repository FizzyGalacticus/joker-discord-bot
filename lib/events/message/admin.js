'use strict';

const { getRoleByName, getMemberByUserId: getRoleMemberByUserId } = require('../../../util/role');
const { getMemberByUserId } = require('../../../util/channel');

const adminWall = (fn = () => {}) => (client, message, match) => {
    const guild = message.guild;
    if (guild) {
        const adminRole = getRoleByName(guild, 'Admin');
        const user = getRoleMemberByUserId(adminRole, message.author.id);

        if (!user) {
            return message.channel.send(`You must have admin privileges to do that.`);
        }
    }
    return fn(client, message, match);
};

module.exports = {
    test: {
        match: /ban (.*) for (.*) (day|days)$/i,
        process: adminWall(async (client, message, match) => {
            const { author, mentions, guild } = message;

            const userToBan = mentions?.users?.first();

            if (userToBan) {
                const member = getMemberByUserId(guild, userToBan.id);

                if (member) {
                    const [daysStr] = match.slice(2);
                    const days = parseInt(daysStr);

                    if (!isNaN(days)) {
                        await member.ban({ days, reason: `Because ${author} said so` });

                        message.channel.send(`${member} has been banned`);
                    }
                }
            }
        }),
    },
};

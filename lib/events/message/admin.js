'use strict';

const { getRoleByName, getMemberByUserId: getRoleMemberByUserId } = require('../../../util/role');
const { getMemberByUserId } = require('../../../util/channel');

const { no_power_here: noPower, nice_try: niceTry } = require('../../../config/images.json');

const isUserAlpha = (guild, checkUser) => {
    if (guild) {
        const adminRole = getRoleByName(guild, 'ALPHAS');

        if (adminRole) {
            const user = getRoleMemberByUserId(adminRole, checkUser.id);

            return !!user;
        }
    }

    return false;
};

const adminWall = (fn = () => {}, { silent = false } = {}) => (client, message, match) => {
    if (isUserAlpha(message.guild, message.author)) {
        return fn(client, message, match);
    } else if (!silent) {
        return message.channel.send({
            files: [noPower],
        });
    }
};

const betaBlocker = message => message.reply(`Nice try, Beta.`, { files: [niceTry] });

module.exports = {
    ban: {
        match: /ban (.*) for (.*) (day|days)$/i,
        process: adminWall(async (client, message, match) => {
            const { author, mentions, guild } = message;

            const userToBan = mentions?.users?.first();

            if (userToBan && guild) {
                if (isUserAlpha(guild, userToBan)) {
                    return betaBlocker(message);
                }

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
    badBehavior: {
        match: /(.*) is being bad$/i,
        process: adminWall(
            async (client, message) => {
                const { mentions, guild } = message;

                const userToCancel = mentions?.users?.first();

                if (userToCancel && guild) {
                    if (isUserAlpha(guild, userToCancel)) {
                        return betaBlocker(message);
                    }

                    if (userToCancel.id !== client.user?.id) {
                        const member = getMemberByUserId(guild, userToCancel.id);
                        const originalRoles = member.roles.cache;

                        const cancelledRole = getRoleByName(guild, 'CANCELLED');

                        if (cancelledRole && !originalRoles.has(cancelledRole.id)) {
                            for (const role of originalRoles.values()) {
                                if (role.name !== '@everyone') {
                                    await member.roles.remove(role);
                                }
                            }

                            await member.roles.add(cancelledRole);

                            client.setTimeout(async () => {
                                await member.roles.remove(cancelledRole);

                                for (const role of originalRoles.values()) {
                                    if (role.name !== '@everyone') {
                                        await member.roles.add(role);
                                    }
                                }

                                await message.channel.send(`${member} is back in play!`);
                            }, 1000 * 5);

                            return message.channel.send(`${member} has been put on a 5 minute timeout.`);
                        }
                    } else {
                        return message.channel.send({ files: [noPower] });
                    }
                }
            },
            { silent: false }
        ),
    },
};

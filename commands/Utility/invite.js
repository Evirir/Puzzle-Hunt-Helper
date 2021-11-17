const {inviteLink} = require('../../config.json');

module.exports = {
    name: 'invite',
    description: `Get the invite link of this bot.`,

    execute(message) {
        message.channel.send("Invite link: " + inviteLink);
    }
};
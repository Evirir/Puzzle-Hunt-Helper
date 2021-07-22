module.exports = {
    name: 'unsolved',
    description: `Mark the current puzzle/meta as unsolved.`,
    aliases: ['u'],

    execute (message) {
        let channelName = message.channel.name;
        if (channelName[0] === "✅") {
            channelName = channelName.slice(1);
        }
        message.react("✅");
        message.channel.edit({name: channelName});
    }
};
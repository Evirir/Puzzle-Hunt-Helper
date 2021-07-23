module.exports = {
    name: 'solved',
    description: `Mark the current puzzle/meta as solved and pin the answer.`,
    aliases: ['s'],
    usage: '[answer]',

    async execute (message, args) {
        if (!args.length) {
            await message.reply("please specify the answer.");
            return;
        }

        // send answer and pin
        const answer = args.join(' ').toUpperCase();
        const msg = await message.channel.send(`🎊 Answer: ${answer}`);
        await msg.pin();

        // rename text channel
        let channelName = message.channel.name;
        if (channelName[0] !== "✅") {
            channelName = "✅" + channelName;
        }
        await message.channel.edit({name: channelName});
    }
};
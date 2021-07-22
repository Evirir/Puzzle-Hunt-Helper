module.exports = {
    name: 'solved',
    description: `Mark the current puzzle/meta as solved and pin the answer.`,
    aliases: ['s'],

    async execute (message, args) {
        if (!args.length) {
            await message.reply("please specify the answer.");
            return;
        }

        const answer = args[0].toUpperCase();
        let channelName = message.channel.name;
        if (channelName[0] !== "✅") {
            channelName = "✅" + channelName;
        }

        const msg = await message.channel.send(`🎊 Answer: ${answer}`);
        await msg.pin();
        await message.delete();
        await message.channel.edit({name: channelName});
    }
};
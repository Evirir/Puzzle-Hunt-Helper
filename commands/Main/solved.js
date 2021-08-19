module.exports = {
    name: 'solved',
    description: 'Mark the current puzzle/meta as solved and pin the answer. If the solved puzzle is a meta, also mark the category as solved.',
    aliases: ['s'],
    usage: '[answer]',
    notes: 'Implementation detail: A channel whose name starts with 🏁 is treated as the meta channel.',

    async execute (message, args) {
        if (!args.length) {
            return message.reply("please specify the answer.");
        }

        // send answer and pin
        const answer = args.join(' ').toUpperCase();
        const msg = await message.channel.send(`🎊 Answer: ${answer}`).catch(e => console.log(e));
        await msg.pin();

        // rename text channel
        let channelName = message.channel.name;
        if (channelName.startsWith('🏁')) {
            let category = message.channel.parent;
            await category.edit({ name: '✅' + category.name }).catch(e => console.log(e));
        }
        if (!channelName[0].startsWith('✅')) {
            channelName = '✅' + channelName;
        }
        await message.channel.edit({name: channelName}).catch(e => console.log(e));
    }
};
const reportError = require("../../tools/reportError");

module.exports = {
    name: 'delete',
    description: `Deletes the whole category of the current message.`,

    async execute (message) {
        if (!message.channel.parent) {
            return message.channel.send("This channel does not belong to a category.");
        }

        const msg = await message.channel.send("Are you sure that you want to delete all channels in this category? You have 15 seconds.");
        await msg.react('✅');
        await msg.react('❌');

        const filter = (reaction, user) => {
            return ['✅','❌'].includes(reaction.emoji.name) && user.id === message.author.id;
        };
        const collector = msg.createReactionCollector(filter, { time: 15000, max: 1 });

        collector.on('collect', async reaction => {
            if (reaction.emoji.name === '✅') {
                const category = message.channel.parent;
                const children = category.children;
                children.forEach((ch) => ch.delete());
                await category.delete().catch(err => reportError(err));
            }
        });

        collector.on('end', () => {
            message.channel.send('Deletion cancelled.');
        });
    }
};
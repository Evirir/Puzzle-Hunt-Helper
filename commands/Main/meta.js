module.exports = {
    name: 'meta',
    description: `Create a new category with a meta channel.`,
    aliases: ['m'],
    usage: '[meta name] [link to meta]',

    async execute (message, args) {
        if (!args.length) {
            message.reply("please specify the name of the meta.");
            return;
        }

        const metaLink = args.pop();
        const metaName = args.join(' ');

        if (!args.length || !metaLink.startsWith("http")) {
            message.reply("please specify a link.");
            return;
        }

        // create category and channels
        const guildManager = message.guild.channels;
        const category = await guildManager.create(metaName, {type: 'category'});
        const textChannel = await guildManager.create("🏁" + metaName, {parent: category});
        await guildManager.create("🏁" + metaName, {parent: category, type: "voice"});

        // send link and pin
        const linkMsg = await textChannel.send(`Link: <${metaLink}>`);
        await linkMsg.pin();

        message.delete();
    }
};
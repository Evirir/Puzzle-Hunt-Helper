module.exports = {
    name: 'meta',
    description: `Create a new category with a meta channel. The last word will be taken as the link.`,
    aliases: ['m'],
    usage: '[meta name] [link to meta]',

    async execute (message, args) {
        if (!args.length) {
            return message.reply("please specify the name of the meta.");
        }

        if (args.length < 2) {
            return message.reply("please specify a link.");
        }

        const metaLink = args.pop();
        const metaName = args.join(' ');

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
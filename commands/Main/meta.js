const createSheets = require('../../google.js');

module.exports = {
    name: 'meta',
    description: `Create a new meta category with a text and a voice channel. The last word will be taken as the link.`,
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

        // create spreadsheet
        const sheetLink = await createSheets(metaName);

        // send links and pin
        const linkMsg = await textChannel.send(`Meta link: <${metaLink}>\nSheet: <${sheetLink}>`);
        await linkMsg.pin();

        message.delete();
    }
};
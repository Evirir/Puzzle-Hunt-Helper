const createSheets = require('../../tools/google.js');

module.exports = {
    name: 'meta',
    description: `Create a new round (category) with a text and a voice channel. The last word will be taken as the link.`,
    aliases: ['m','round'],
    usage: '[meta name] [link to meta]',

    async execute (message, args) {
        if (!args.length) {
            return message.reply("please specify the name of the round.");
        }

        if (args.length < 2) {
            return message.reply("please specify a link.");
        }

        const metaLink = args.pop();
        const metaName = args.join(' ');

        // create category and channels
        const guildManager = message.guild.channels;
        const category = await guildManager.create(metaName, {type: 'category'}).catch(e => console.log(e));
        const textChannel = await guildManager.create("🏁" + metaName, {parent: category}).catch(e => console.log(e));
        await guildManager.create("🏁" + metaName, {parent: category, type: "voice"});

        // create spreadsheet
        const sheetLink = await createSheets(metaName).catch(e => console.log(e));

        // send links and pin
        const linkMsg = await textChannel.send(`Meta link: <${metaLink}>\nSheet: <${sheetLink}>`).catch(e => console.log(e));
        await linkMsg.pin().catch(e => console.log(e));

        message.delete();
    }
};
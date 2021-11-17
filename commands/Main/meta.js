const createSheets = require('../../tools/google.js');
const reportError = require('../../tools/reportError.js');

module.exports = {
    name: 'meta',
    description: `Create a new round (category) with a text and a voice channel.`,
    aliases: ['m', 'round'],
    usage: '[meta name]',
    args: {
        l: {count: 1, description: 'link to meta'},
        v: {count: 0, description: 'create a voice channel for this meta'}
    },

    async execute(message, args) {
        const mainArgs = args.main;
        const addArgs = args.add;

        if (!mainArgs.length) {
            return message.reply("please specify the name of the round.");
        }

        const metaName = mainArgs.join(' ');

        const guildManager = message.guild.channels;
        const category = await guildManager.create(metaName, {type: 'category'}).catch(e => reportError(message, e));

        // create text channel
        const textChannel = await guildManager.create("🏁" + metaName, {parent: category}).catch(e => reportError(e, message));

        // create voice channel if requested
        if (addArgs.has('v')) {
            await guildManager.create("🏁" + metaName, {
                parent: category,
                type: "voice"
            }).catch(e => reportError(message, e));
        }

        // create spreadsheet
        const sheetLink = await createSheets(metaName).catch(e => reportError(e, message));

        // create message
        let sentMsg = "";
        if (addArgs.get('l')) {
            const puzzleLink = addArgs.get('l');
            sentMsg += `Meta link: <${puzzleLink}>\n`;
        }
        sentMsg += `Sheet: <${sheetLink}>`;

        // send links and pin
        const linkMsg = await textChannel.send(sentMsg).catch(e => reportError(e, message));
        await linkMsg.pin().catch(e => reportError(e, message));

        await message.delete().catch(e => reportError(message, e));
    }
};
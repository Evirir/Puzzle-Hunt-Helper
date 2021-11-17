const createSheets = require("../../tools/google.js");
const reportError = require("../../tools/reportError");

module.exports = {
    name: 'puzzle',
    description: `Create a puzzle (channel) in your current meta (category).`,
    aliases: ['p', 'problem'],
    usage: '[puzzle name]',
    args: {
        l: {count: 1, description: 'link to puzzle'},
        v: {count: 0, description: 'create a voice channel for this puzzle'}
    },

    async execute(message, args) {
        const mainArgs = args.main;
        const addArgs = args.add;

        if (!mainArgs.length) {
            return message.reply("please specify the name of the puzzle.");
        }

        const puzzleName = mainArgs.join(' ');

        const guildManager = message.guild.channels;
        const category = message.channel.parent;

        // create text channel
        const textChannel = await guildManager.create("🧩" + puzzleName, {parent: category}).catch(e => reportError(message, e));

        // create voice channel if requested
        if (addArgs.has('v')) {
            await guildManager.create("🧩" + puzzleName, {
                parent: category,
                type: "voice"
            }).catch(e => reportError(message, e));
        }

        // create spreadsheet
        const sheetLink = await createSheets(puzzleName).catch(e => reportError(message, e));

        // create message
        let sentMsg = "";
        if (addArgs.get('l')) {
            const puzzleLink = addArgs.get('l');
            sentMsg += `Puzzle link: <${puzzleLink}>\n`;
        }
        sentMsg += `Sheet: <${sheetLink}>`;

        // send link and pin
        const linkMsg = await textChannel.send(sentMsg).catch(e => reportError(message, e));
        await linkMsg.pin().catch(e => reportError(message, e));

        await message.delete().catch(e => reportError(message, e));
    }
};
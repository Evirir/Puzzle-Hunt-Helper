module.exports = {
    name: 'puzzle',
    description: `Create a puzzle (channel) in your current meta (category). The last word will be taken as the link.`,
    aliases: ['p', 'problem'],
    usage: '[puzzle name] [link to puzzle]',

    async execute (message, args) {
        if (!args.length) {
            return message.reply("please specify the name of the puzzle.");
        }

        if (args.length < 2) {
            return message.reply("please specify a link.");
        }

        const puzzleLink = args.pop();
        const puzzleName = args.join(' ');

        // create channels
        const guildManager = message.guild.channels;
        const category = message.channel.parent;
        const textChannel = await guildManager.create("🧩" + puzzleName, {parent: category});
        await guildManager.create("🧩" + puzzleName, {parent: category, type: "voice"});

        // create spreadsheet
        const sheetLink = await createSheets(puzzleName);

        // send link and pin
        const linkMsg = await textChannel.send(`Link: <${puzzleLink}>\nSheet: <${sheetLink}>`);
        await linkMsg.pin();

        message.delete();
    }
};
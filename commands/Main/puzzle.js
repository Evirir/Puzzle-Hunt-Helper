module.exports = {
    name: 'puzzle',
    description: `Create a new channel (puzzle) in the current category (meta).`,
    aliases: ['p', 'problem'],
    usage: '[puzzle name] [link to puzzle]',

    async execute (message, args) {
        if (!args.length) {
            message.reply("please specify the name of the puzzle.");
            return;
        }

        const puzzleLink = args.pop();
        const puzzleName = args.join(' ');

        if (!args.length || !puzzleLink.startsWith("http")) {
            message.reply("please specify a link.");
            return;
        }

        // create channels
        const guildManager = message.guild.channels;
        const category = message.channel.parent;
        const textChannel = await guildManager.create("🧩" + puzzleName, {parent: category});
        await guildManager.create("🧩" + puzzleName, {parent: category, type: "voice"});

        // send link and pin
        const linkMsg = await textChannel.send(`Link: <${puzzleLink}>`);
        await linkMsg.pin();

        message.delete();
    }
};
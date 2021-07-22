module.exports = {
    name: 'puzzle',
    description: `Create a new channel (puzzle) in the current category (meta).`,
    aliases: ['p'],

    async execute (message, args) {
        if (!args.length) {
            message.reply("please specify the name of the puzzle.");
            return;
        }

        const puzzleName = args.join(' ');
        const guildManager = message.guild.channels;

        await guildManager.create("🧩" + puzzleName, {parent: message.channel.parent});

        await message.delete();
    }
};
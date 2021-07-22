module.exports = {
    name: 'meta',
    description: `Create a new category with a meta channel.`,
    aliases: ['m'],

    async execute (message, args) {
        if (!args.length) {
            message.reply("pleae specify the name of the meta.");
            return;
        }

        const metaName = args[0];
        const guildManager = message.guild.channels;

        const category = await guildManager.create(metaName, {type: 'category'});
        await guildManager.create("🏁" + metaName, {parent: category});
        await guildManager.create("🏁" + metaName, {parent: category, type: "voice"});

        await message.delete();
    }
};
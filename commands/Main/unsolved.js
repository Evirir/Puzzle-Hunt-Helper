module.exports = {
    name: 'unsolved',
    description: `Mark the current puzzle/meta as unsolved.`,
    aliases: ['u'],

    execute (message) {
        let channelName = message.channel.name;
        if (channelName.startsWith("✅")) {
            channelName = channelName.slice(1);
            message.channel.edit({name: channelName});
        }
        let category = message.channel.parent;
        let categoryName = category.name;
        if (categoryName.startsWith("✅")) {
            categoryName = categoryName.slice(1);
            category.edit({name: categoryName});
        }
        message.react("✅").catch(e => console.log(e));
    }
};
const Discord = require('discord.js');

module.exports = {
    name: 'ping',
    description: `Reports the API latency.`,

    execute(message) {
        const embed = new Discord.MessageEmbed()
            .setDescription(`Pong!`)
            .setTimestamp()
            .setColor('RED');

        message.channel.send(embed);
    }
};
const Discord = require('discord.js');

module.exports = {
    name: 'ping',
    description: `Reports the API latency.`,

    execute (message) {
        const embed = new Discord.MessageEmbed()
            .setTitle(`Pong!`)
            .setDescription(`API Latency: ${Math.round(message.client.ping)}ms.`)
            .setTimestamp()
            .setColor('RED');

        message.channel.send(embed);
    }
};
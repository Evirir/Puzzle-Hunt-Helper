import Discord, {Message} from 'discord.js';
import {Command} from "../../types";

const command: Command = {
    name: 'ping',
    description: `Reports the API latency.`,

    execute(message: Message) {
        const embed = new Discord.MessageEmbed()
            .setDescription(`Pong!`)
            .setTimestamp()
            .setColor('RED');

        message.channel.send({embeds: [embed]});
    }
};

module.exports = command;
import {Command} from "../../types";
import Discord from 'discord.js';

const command: Command = {
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

export default command;
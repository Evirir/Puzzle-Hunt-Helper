import {inviteLink} from '../../data.json';
import {Message, MessageEmbed} from "discord.js";
import {Command} from "../../types";
import {hyperlink} from "@discordjs/builders";

const command: Command = {
    name: 'invite',
    description: "Get the invite link of this bot.",

    execute(message: Message) {
        const embed = new MessageEmbed().setColor("GREEN").setDescription(hyperlink("Summon me to your server!", inviteLink));
        message.channel.send({embeds: [embed]});
    }
}

    module.exports = command;
import {inviteLink} from '../../data.json';
import {Message} from "discord.js";
import {Command} from "../../types";

const command: Command = {
    name: 'invite',
    description: `Get the invite link of this bot.`,

    execute(message: Message) {
        message.channel.send("Invite link: " + inviteLink);
    }
};

module.exports = command;
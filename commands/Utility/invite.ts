import {Command} from "../../types";
import {inviteLink} from '../../data.json';

const command: Command = {
    name: 'invite',
    description: `Get the invite link of this bot.`,

    execute(message) {
        message.channel.send("Invite link: " + inviteLink);
    }
};

export default command;
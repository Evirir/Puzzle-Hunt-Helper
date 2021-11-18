import {Message, TextChannel} from "discord.js";
import {Command} from "../../types";

const reportError = require("../../tools/reportError");

const command: Command = {
    name: 'unsolved',
    description: `Mark the current puzzle/meta as unsolved.`,
    aliases: ['u'],

    async execute(message: Message) {
        if (!(message.channel instanceof TextChannel)) {
            return reportError(message, "solved.ts: not in text channel.");
        }
        if (!message.channel.parent) {
            return message.reply("This channel is not in a category.");
        }

        let channelName = message.channel.name;
        if (channelName.startsWith("✅")) {
            channelName = channelName.slice(1);
            await message.channel.edit({name: channelName});
        }
        let category = message.channel.parent;
        let categoryName = category.name;
        if (categoryName.startsWith("✅")) {
            categoryName = categoryName.slice(1);
            await category.edit({name: categoryName});
        }
        message.react("✅").catch(e => reportError(message, e));
    }
};

module.exports = command;
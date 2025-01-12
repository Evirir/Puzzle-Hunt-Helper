import reportError from "../../tools/reportError";
import {Command, CommandArguments} from "../../types";
import {Message, TextChannel} from "discord.js";

const command: Command = {
    name: 'solved',
    description: 'Mark the current puzzle/meta as solved and pin the answer. If the solved puzzle is a meta, also mark the category as solved.',
    aliases: ['s'],
    usage: '[answer]',
    notes: 'Implementation detail: A channel whose name starts with 🏁 is treated as the meta channel.',

    async execute(message: Message, args: CommandArguments) {
        const mainArgs = args.main;

        if (!mainArgs.length) {
            return message.reply("Please specify the answer.");
        }
        if (!(message.channel instanceof TextChannel)) {
            return reportError(message, "solved.ts: not in text channel.");
        }
        if (!message.channel.parent) {
            return message.reply("This channel is not in a category.");
        }

        // send answer and pin
        const answer = mainArgs.join(' ').toUpperCase();
        const msg = await message.channel.send(`🎊 Answer: ${answer}`).catch(e => reportError(message, e));
        await msg?.pin();

        // rename text channel
        let channelName = message.channel.name;
        if (channelName.startsWith('🏁')) {
            let category = message.channel.parent;
            await category.edit({name: '✅' + category.name}).catch(e => reportError(message, e));
        }
        if (!channelName[0].startsWith('✅')) {
            channelName = '✅' + channelName;
        }
        await message.channel.edit({name: channelName}).catch(e => reportError(message, e));
    }
};

export default command;

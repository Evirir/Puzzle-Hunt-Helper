import { ChannelType, Message, TextChannel } from "discord.js";
import createSheets from "../../tools/google";
import reportError from "../../tools/reportError";
import { Command, CommandArguments } from "../../types";

const command: Command = {
    name: 'puzzle',
    description: `Create a puzzle (channel) in your current meta (category).`,
    aliases: ['p', 'problem'],
    usage: '[puzzle name]',
    args: {
        l: { count: 1, description: 'link to puzzle' },
        v: { count: 0, description: 'create a voice channel for this puzzle' }
    },

    async execute(message: Message, args: CommandArguments) {
        const mainArgs = args.main;
        const addArgs = args.add;
        if (!mainArgs.length) {
            return message.reply("Please specify the name of the puzzle.");
        }

        const channel = message.channel as TextChannel;
        if (!channel.parent) {
            return message.reply('This channel is not in a category.');
        }

        const puzzleName = mainArgs.join(' ');

        const guildManager = await message.guild!.channels;
        const category = channel.parent;

        // create text channel
        const textChannel = await guildManager.create({ name: '🧩' + puzzleName, parent: category })
            .catch(e => reportError(message, e)) as TextChannel;

        // create voice channel if requested
        if (addArgs.has('v')) {
            await guildManager.create({ name: "🧩" + puzzleName, parent: category, type: ChannelType.GuildVoice })
                .catch(e => reportError(message, e));
        }

        // create spreadsheet
        const sheetLink = await createSheets(puzzleName).catch(e => reportError(message, e));

        // create message
        let sentMsg = "";
        if (addArgs.get('l')) {
            const puzzleLink = addArgs.get('l');
            sentMsg += `Puzzle link: <${puzzleLink}>\n`;
        }
        sentMsg += `Sheet: <${sheetLink}>`;

        // send link and pin
        const linkMsg = await textChannel.send(sentMsg).catch((e: any) => reportError(message, e)) as Message;
        await linkMsg.pin().catch((e: any) => reportError(message, e));

        await message.delete().catch(e => reportError(message, e));
    }
};

export default command;

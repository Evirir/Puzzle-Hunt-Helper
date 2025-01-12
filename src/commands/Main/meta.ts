import createSheets from '../../tools/google';
import reportError from '../../tools/reportError';
import { Command, CommandArguments } from "../../types";
import { CategoryChannel, GuildChannelCreateOptions, ChannelType, Message, TextChannel } from "discord.js";

const command: Command = {
    name: 'meta',
    description: `Create a new round (category) with a text and a voice channel.`,
    aliases: ['m', 'round', 'r'],
    usage: '[meta name]',
    args: {
        l: { count: 1, description: 'link to meta' },
        v: { count: 0, description: 'create a voice channel for this meta' },
        i: { count: 0, description: 'create the meta in the same category instead of a new one' }
    },

    async execute(message: Message, args: CommandArguments) {
        const mainArgs = args.main;
        const addArgs = args.add;
        if (!mainArgs.length) {
            return message.reply("Please specify the name of the round.");
        }

        const channel = message.channel as TextChannel;
        if (!channel.parent) {
            return message.reply("This channel is not in a category.");
        }

        const metaName = mainArgs.join(' ');

        // create category or assign it to the current category
        const guildChannelManager = message.guild!.channels;
        let category: CategoryChannel;
        if (addArgs.has('i')) {
            category = channel.parent;
        } else {
            category = await guildChannelManager.create({ name: metaName, type: ChannelType.GuildCategory })
                .catch(e => reportError(message, e)) as CategoryChannel;
        }

        // create text channel
        const textChannel = await guildChannelManager.create(
            { name: "🏁" + metaName, parent: category }
        ).catch(e => reportError(e, message)) as TextChannel;

        // create voice channel if requested
        if (addArgs.has('v')) {
            await guildChannelManager.create({
                name: '🏁' + metaName,
                parent: category,
                type: ChannelType.GuildVoice
            } as GuildChannelCreateOptions)
                .catch(e => reportError(message, e));
        }

        // create spreadsheet
        const sheetLink = await createSheets(metaName).catch(e => reportError(e, message));

        // create message
        let sentMsg = "";
        if (addArgs.get('l')) {
            const puzzleLink = addArgs.get('l');
            sentMsg += `Meta link: <${puzzleLink}>\n`;
        }
        sentMsg += `Sheet: <${sheetLink}>`;

        // send links and pin
        const linkMsg = await textChannel.send(sentMsg).catch(e => reportError(e, message));
        await linkMsg?.pin().catch(e => reportError(e, message));

        // delete message
        await message.delete().catch(e => reportError(message, e));
    }
};

export default command;

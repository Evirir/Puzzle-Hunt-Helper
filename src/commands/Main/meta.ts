import createSheets from '../../tools/google';
import reportError from '../../tools/reportError';
import {Command} from "../../types";
import {GuildCreateChannelOptions, TextChannel} from "discord.js";

const command: Command = {
    name: 'meta',
    description: `Create a new round (category) with a text and a voice channel.`,
    aliases: ['m', 'round'],
    usage: '[meta name]',
    args: {
        l: {count: 1, description: 'link to meta'},
        v: {count: 0, description: 'create a voice channel for this meta'}
    },

    async execute(message, args) {
        const mainArgs = args.main;
        const addArgs = args.add;

        if (!mainArgs.length) {
            return message.reply("please specify the name of the round.");
        }

        const metaName = mainArgs.join(' ');

        const guildManager = message.guild!.channels;
        const category = await guildManager.create(metaName, {type: 'category'}).catch(e => reportError(message, e));

        // create text channel
        const textChannel: TextChannel = await guildManager.create(
            "🏁" + metaName,
            {parent: category} as GuildCreateChannelOptions
        ).catch(e => reportError(e, message)) as TextChannel;

        // create voice channel if requested
        if (addArgs.has('v')) {
            await guildManager.create(
                "🏁" + metaName,
                {parent: category, type: "voice"} as GuildCreateChannelOptions
            ).catch(e => reportError(message, e));
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
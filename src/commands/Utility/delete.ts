import assert from "assert";
import { Channel, Message, TextChannel } from "discord.js";
import reportError from "../../tools/reportError";
import { Command } from "../../types";

const command: Command = {
    name: 'delete',
    description: `Deletes the whole category of the current message.`,

    async execute(message: Message) {
        assert(message.channel instanceof TextChannel);
        const msg = await message.channel.send("Are you sure that you want to delete all channels in this category? You have 15 seconds.");
        await msg.react('✅');
        await msg.react('❌');

        const filter = (reaction: any, user: any) => {
            return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
        };
        const collector = msg.createReactionCollector({filter, time: 15000, max: 1});

        collector.on('collect', async reaction => {
            assert(message.channel instanceof TextChannel);
            if (reaction.emoji.name === '✅') {
                const category = message.channel.parent;
                if (!category) {
                    return message.reply("This channel is not in a category!");
                }
                const children = category.children;
                children.cache.forEach((ch: Channel) => ch.delete().catch(err => reportError(message, err)));
                await category.delete().catch(err => reportError(message, err));
            } else {
                message.channel.send('Deletion cancelled.');
            }
        });
    }
};

export default command;

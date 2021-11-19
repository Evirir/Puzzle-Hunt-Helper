import reportError from "../../tools/reportError";
import {Channel, Message, TextChannel} from "discord.js";
import {Command} from "../../types";

const command: Command = {
    name: 'delete',
    description: `Deletes the whole category of the current message.`,

    async execute(message: Message) {
        if (!(message.channel as TextChannel).parent) {
            return message.channel.send("This channel does not belong to a category.");
        }

        const msg = await message.channel.send("Are you sure that you want to delete all channels in this category? You have 15 seconds.");
        await msg.react('✅');
        await msg.react('❌');

        const filter = (reaction: any, user: any) => {
            return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
        };
        const collector = msg.createReactionCollector({filter, time: 15000, max: 1});

        collector.on('collect', async reaction => {
            if (reaction.emoji.name === '✅') {
                const category = (message.channel as TextChannel).parent;
                if (!category) {
                    return message.reply("This channel is not in a category!");
                }
                const children = category.children;
                children.forEach( (ch: Channel) => ch.delete().catch(err => reportError(message, err)));
                await category.delete().catch(err => reportError(message, err));
            } else {
                message.channel.send('Deletion cancelled.');
            }
        });
    }
};

module.exports = command;
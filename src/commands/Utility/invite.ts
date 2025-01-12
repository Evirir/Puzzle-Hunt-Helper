import { inviteLink } from '../../data.json';
import { hyperlink, Message, EmbedBuilder, TextChannel } from 'discord.js';
import { Command } from '../../types';
import assert from 'assert';

const command: Command = {
    name: 'invite',
    description: 'Get the invite link of this bot.',

    execute(message: Message) {
        assert(message.channel instanceof TextChannel);
        const embed = new EmbedBuilder().setColor('Green').setDescription(hyperlink('Summon me to your server!', inviteLink));
        message.channel.send({ embeds: [embed] });
    }
};

module.exports = command;

import {ActivityType} from 'discord.js';
import {Event} from '../types';

const event: Event = {
    name: 'ready',
    once: true,
    async execute(client) {
        const startMessage = `It's currently **${client.readyAt}**\n`;
        console.log(startMessage);
        await client.user!.setActivity(`for !help`, {type: ActivityType.Watching});
    }
};

module.exports = event;
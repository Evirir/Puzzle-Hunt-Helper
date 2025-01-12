import {ActivityType} from 'discord.js';
import {Event} from '../types';

const event: Event = {
    name: 'ready',
    once: true,
    async execute(client) {
        const startMessage = `It's currently **${client.readyAt}**\n`;
        console.log(startMessage);
        client.user!.setActivity(`for !help`, { type: ActivityType.Watching });
    }
};

export default event;

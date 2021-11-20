import {Message} from 'discord.js';
import {Command} from "../../types";

const command: Command = {
    name: 'ping',
    description: `Reports the API latency.`,

    async execute(message: Message) {
        const sentText = `Websocket heartbeat: ${message.client.ws.ping}ms\nRound-trip latency: `;
        const sent = await message.channel.send(sentText);
        sent.edit(sentText + (sent.createdTimestamp - message.createdTimestamp).toString() + "ms");
    }
};

module.exports = command;
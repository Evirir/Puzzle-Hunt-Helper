import {TextChannel, Message} from "discord.js";
import {consoleID} from '../data.json';

/**
 * Prints the error to the console and the console channel.
 * @param message the triggering Discord message
 * @param err the error message
 */
const reportError = async (message: Message, err: any) => {
    const consoleChannel: TextChannel | undefined = message.client.channels.cache.get(consoleID) as TextChannel | undefined;
    if (consoleChannel) {
        let errMsg = `Message: ${message.id}, channel: ${(message.channel as TextChannel).name}, server: ${message.guild!.name}\nError: `;
        errMsg += err;
        consoleChannel.send(errMsg).catch((e: any) => console.log(e));
    }
    console.log(err);
};

export default reportError;
import {TextChannel, Message} from "discord.js";
import {consoleID} from '../data.json';

/**
 * Prints the error to the console and the console channel.
 * @param message
 * @param err
 */
const reportError = async (message: Message, err: any) => {
    const consoleChannel = message.client.channels.cache.get(consoleID) as TextChannel;
    if (consoleChannel) {
        let errMsg = `Message: ${message.id}, channel: ${message.channel.id}, server: ${message.guild!.id}\nError: `;
        errMsg += err;
        consoleChannel.send(errMsg).catch(e => console.log(e));
    }
    console.log(err);
};

export default reportError;
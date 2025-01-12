import {TextChannel, ThreadChannel} from "discord.js";
import {defaultPrefix, dragID} from "../data.json";
import {Command, Event} from "../types";
import parseArgs from "../tools/argumentParser";
import reportError from "../tools/reportError";

const event: Event = {
    name: 'messageCreate',
    async execute(client, message) {
        const prefix: string = defaultPrefix;

        // allow TextChannel's only
        if (!(message.channel instanceof TextChannel)) return;

        // ignore messages not starting with prefix
        if (!message.content.startsWith(prefix)) return;

        // ignore bots
        if (message.author.bot) return;

        // parse input
        const regex = /([^\s"]+)|"((?:\\"|[^"])*)"/g; // treat strings in double quotes as one; allow escaped quotes
        const args: string[] = [...await message.content.slice(prefix.length).matchAll(regex)].map(match => match[1] ?? match[2]);

        // ignore prefix-only messages
        if (args.length === 0) return;

        const commandName: string = args.shift()!.toLowerCase();
        const command = client.commands.get(commandName) || client.commands.find((cmd: Command) => !!cmd.aliases && cmd.aliases.includes(commandName));

        // ignore invalid commands
        if (!command) return;

        // only allow the dev to use dev commands
        if (command.dev && message.author.id !== dragID) {
            return message.channel.send('This command is only available to the developer.');
        }

        // parse arguments
        const parsedArgs = parseArgs(args, command.args);
        if (parsedArgs === null) {
            return message.reply('Invalid arguments.');
        }

        try {
            command.execute(message, parsedArgs, prefix);
        } catch (err: any) {
            console.log(err);
            await reportError(message, `Error at ${message.guild!.name}/${(message.channel as TextChannel | ThreadChannel).name}/${message.id} (${message.guild!.id}/${message.channel.id}):\n\`${err.message}\``);
            if (message.author.id === dragID)
                return message.reply(`I have some issues here, go check the log ó.=.ò"\nError: \`${err.message}\``);
            else
                return message.reply(`Error encountered: please notify Evirir#5662 and blame him for that.\nError: \`${err.message}\``);
        }
    }
};

export default event;

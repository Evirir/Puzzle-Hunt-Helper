import Discord, {DMChannel, TextChannel} from "discord.js";
import fs from "fs";
import dotenv from "dotenv";
import {defaultPrefix, dragID, consoleID} from "./data.json";
import parseArgs from "./tools/argumentParser";
import {BotClient, Command} from "./types";

dotenv.config();

// create the client
const discordClient: any = new Discord.Client();
discordClient.commands = new Discord.Collection();
const client: BotClient = discordClient;

const consoleChannel: TextChannel | undefined = client.channels.cache.get(consoleID) as TextChannel | undefined;

// command to log in console channel
const discordLog = async (message: any) => {
    if (!consoleChannel) {
        console.log("WARNING: Cannot find console channel.");
    } else {
        await consoleChannel.send(message).catch(e => console.log(e));
    }
};

// load commands
const categories = fs.readdirSync('./src/commands');
categories.forEach(category => {
    const commandFiles = fs.readdirSync(`./src/commands/${category}`).filter(file => file.endsWith('.js') || file.endsWith('.ts'));
    commandFiles.forEach(async file => {
        const command = await import(`./commands/${category}/${file}`);
        client.commands.set(command.name, command);
    });
});

client.once('ready', async () => {
    let startMessage = `It's currently **${client.readyAt}**\n`;
    console.log(startMessage);
    await client.user!.setActivity(`for !help`, {type: "WATCHING"});
});

client.on("guildCreate", async (guild: Discord.Guild) => {
    const msg = `I discovered a new server: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members.`;
    console.log(msg);
    await discordLog(msg);
});

client.on("guildDelete", async (guild: Discord.Guild) => {
    const msg = `I have been removed from ${guild.name} (id: ${guild.id})`;
    console.log(msg);
    await discordLog(msg);
});

client.on('messageCreate', async (message: Discord.Message) => {
    const prefix: string = defaultPrefix;

    // ignore DMs
    if (message.channel instanceof DMChannel)
        return;

    // ignore messages not starting with prefix
    if (!message.content.startsWith(prefix))
        return;

    // ignore bots
    if (message.author.bot)
        return;

    // parse input
    const regex = /([^\s"]+)|"((?:\\"|[^"])*)"/g; // treat strings in double quotes as one; allow escaped quotes
    const args: string[] = [...await message.content.slice(prefix.length).matchAll(regex)].map(match => match[1] ?? match[2]);

    // ignore prefix-only messages
    if (args.length === 0) {
        return;
    }

    const commandName: string = args.shift()!.toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find((cmd: Command) => !!cmd.aliases && cmd.aliases.includes(commandName));

    // ignore invalid commands
    if (!command)
        return;

    // only allow the dev to use dev commands
    if (command.dev && message.author.id !== dragID) {
        return message.channel.send(`This command is only available to the developer.`);
    }

    // parse arguments
    const parsedArgs = parseArgs(args, command.args);
    if (parsedArgs === null) {
        return message.reply(`invalid arguments.`);
    }

    try {
        command.execute(message, parsedArgs, prefix);
    } catch (err: any) {
        console.log(err);
        await discordLog(`Error at ${message.guild!.name}/${message.channel.name}/${message.id} (${message.guild!.id}/${message.channel.id}):\n\`${err.message}\``);
        if (message.author.id === dragID)
            return message.reply(`I have some issues here, go check the log ó.=.ò"\nError: \`${err.message}\``);
        else
            return message.reply(`Error encountered: please notify Evirir#5662 and blame him for that.\nError: \`${err.message}\``);
    }
});

client.login(process.env.TOKEN).catch((e: any) => console.log(e));

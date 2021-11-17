const Discord = require('discord.js');
const fs = require('fs');
const dotenv = require('dotenv');
const {defaultPrefix, dragID, consoleID} = require('./config.json');
const reportError = require("./tools/reportError");
const parseArgs = require("./tools/argument_parser");

dotenv.config();

const client = new Discord.Client();
client.commands = new Discord.Collection();

// load commands
const categories = fs.readdirSync('./commands');
categories.forEach(category => {
    const commandFiles = fs.readdirSync(`./commands/${category}`).filter(file => file.endsWith('.js'));
    commandFiles.forEach(file => {
        const command = require(`./commands/${category}/${file}`);
        client.commands.set(command.name, command);
    });
});

client.once('ready', async () => {
    let startMessage = `It's currently **${client.readyAt}**\n`;
    console.log(startMessage);
    await client.user.setActivity(`for !help`, {type: "WATCHING"});
});

client.on("guildCreate", guild => {
    const msg = `I discovered a new server: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members.`;
    console.log(msg);
    client.channels.cache.get(consoleID).send(msg);
});

client.on("guildDelete", guild => {
    const msg = `I have been removed from ${guild.name} (id: ${guild.id})`;
    console.log(msg);
    client.channels.cache.get(consoleID).send(msg);
});

client.on('message', async message => {
    const prefix = defaultPrefix;

    // ignore DMs
    if (!message.guild)
        return;

    // ignore messages not starting with prefix
    if (!message.content.startsWith(prefix))
        return;

    // ignore bots
    if (message.author.bot)
        return;

    // parse input
    const regex = /([^\s"]+)|"((?:\\"|[^"])*)"/g; // treat strings in double quotes as one; allow escaped quotes
    const args = [...message.content.slice(prefix.length).matchAll(regex)].map(match => match[1] || match[2]);

    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

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
    } catch (err) {
        console.log(err);
        client.channels.cache.get(consoleID).send(`Error at ${message.guild.name}/${message.channel.name}/${message.id} (${message.guild.id}/${message.channel.id}):\n\`${err.message}\``);
        if (message.author.id === dragID)
            return message.reply(`I have some issues here, go check the log ó.=.ò"\nError: \`${err.message}\``);
        else
            return message.reply(`Error encountered: please notify Evirir#5662 and blame him for that.\nError: \`${err.message}\``);
    }
});

client.login(process.env.TOKEN).catch(e => reportError(message, e));

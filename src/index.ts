import {Client, Collection, Intents} from "discord.js";
import fs from "fs";
import dotenv from "dotenv";
import {BotClient} from "./types";

dotenv.config();

// intents
const intents = new Intents();
intents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS);

// create the client
const discordClient: any = new Client({intents: intents});
discordClient.commands = new Collection();
const client: BotClient = discordClient;

// load commands
const categories = fs.readdirSync('./src/commands');
for (const category of categories) {
    const commandFiles = fs.readdirSync(`./src/commands/${category}`).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${category}/${file}`);
        client.commands.set(command.name, command);
    }
}

// load events
const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.ts') || file.endsWith('.js'));
for (const file of eventFiles) {
    const event: any = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(client, ...args));
    } else {
        client.on(event.name, (...args) => event.execute(client, ...args));
    }
}

client.login(process.env.TOKEN).catch((e: any) => console.log(e));

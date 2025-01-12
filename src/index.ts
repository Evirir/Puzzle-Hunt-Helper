import {GatewayIntentBits} from 'discord.js';
import fs from "node:fs";
import path from 'path';
import dotenv from 'dotenv';
import {BotClient} from './types';

dotenv.config();

const intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions
];

// create the client
const client: BotClient = new BotClient({intents: intents});

// load commands
const categories = fs.readdirSync(path.resolve(__dirname, './commands'));
for (const category of categories) {
    const commandFiles = fs.readdirSync(path.resolve(__dirname, `./commands/${category}`))
        .filter((file: string) => file.endsWith('.ts') || file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${category}/${file}`).default;
        client.commands.set(command.name, command);
    }
}

// load events
const eventFiles = fs.readdirSync(path.resolve(__dirname, './events'))
    .filter((file: string) => file.endsWith('.ts') || file.endsWith('.js'));
for (const file of eventFiles) {
    const event: any = require(`./events/${file}`).default;
    console.log(JSON.stringify(event))
    if (event.once) {
        client.once(event.name, (...args: any) => event.execute(client, ...args));
    } else {
        client.on(event.name, (...args: any) => event.execute(client, ...args));
    }
}

process.on("SIGINT", async () => {
    console.log("Bot is sleeping (shutting down)...");
    try {
        await client.destroy();
        console.log("Bot has been logged out successfully.");
    } catch (error) {
        console.error("Error during shutdown:", error);
    } finally {
        process.exit(0);
    }
});

client.login(process.env.TOKEN).catch((e: any) => console.log(e));

import fs from "fs";
import path from "path";
import {Message, MessageEmbed} from "discord.js";
import {bold, hyperlink, inlineCode} from "@discordjs/builders";
import {defaultPrefix, sourceLink} from "../../data.json";
import {BotClient, Command, CommandArguments} from "../../types";

const command: Command = {
    name: "help",
    description: "Show list of commands if used without arguments. Use " + inlineCode(`${defaultPrefix}help [command]`) + " for more info on the command.",
    aliases: ["commands", 'command', 'cmd'],
    usage: "(command-name)",

    async execute(message: Message, args: CommandArguments, prefix: string) {
        const mainArgs = args.main;

        if (!mainArgs.length) {
            const embed = new MessageEmbed()
                .setColor("BLUE")
                .setDescription("My prefix is " + inlineCode(prefix) + ".\n" +
                    inlineCode("!m [meta] -l [link]") + " to create a new meta (category).\n" +
                    inlineCode("!p [puzzle] -l [link]") + " to create a puzzle (channel) in your current category.\n" +
                    inlineCode("!s [answer]") + " to mark a puzzle as solved.\n\n" +
                    "Source code: " + hyperlink("GitHub link", sourceLink) + "\n\n" +
                    bold("List of commands:"))
                .setFooter(`Type ${prefix}help [command] for more info on the command.`);

            const categories = fs.readdirSync(path.resolve(__dirname, ".."));
            categories.forEach(category => {
                const commandFiles = fs.readdirSync(path.resolve(__dirname, `../${category}`))
                    .filter(file => file.endsWith(".ts") || file.endsWith(".js"));
                let commandArray: string[] = [];
                commandFiles.forEach(file => {
                    const command: Command = require(`../${category}/${file}`);
                    commandArray.push(inlineCode(command.name));
                });
                embed.addField(category, commandArray.join(" "));
            });

            await message.channel.send({embeds: [embed]});
        } else {
            const {commands} = message.client as BotClient;
            const name = mainArgs[0].toLowerCase();
            const command = commands.get(name) || commands.find(c => !!c.aliases && c.aliases.includes(name));

            if (!command)
                return message.reply("Unknown command.");

            const embed = new MessageEmbed()
                .setTitle(inlineCode(command.name))
                .setColor("BLUE");

            if (command.aliases)
                embed.addField("Aliases", command.aliases.map(alias => inlineCode(alias)).join(" "));
            if (command.description)
                embed.addField("Description", command.description);
            if (command.usage)
                embed.addField("Usage", inlineCode(prefix + command.name + " " + command.usage));
            if (command.notes)
                embed.addField("Notes", command.notes);
            if (command.args) {
                let argsDescription: string = "";
                for (const [key, value] of Object.entries(command.args)) {
                    argsDescription += inlineCode("-" + key) + ": " + value.description + "\n";
                }
                embed.addField("Additional arguments", argsDescription);
            }

            await message.channel.send({embeds: [embed]});
        }
    }
};

module.exports = command;
const Discord = require('discord.js');
const fs = require('fs');
const {defaultPrefix} = require('../../config.json');

module.exports = {
    name: 'help',
    description: `Shows list of commands. Use \`${defaultPrefix}help [command]\` for more info on the command.`,
    aliases: ['commands','command','cmd'],
    usage: '[command-name]',

    execute(message, args, prefix) {
        if (!args.length) {
            let embed = new Discord.MessageEmbed()
                .setColor('BLUE')
                .setDescription('My prefix is \`' + prefix + '\`\n' +
                    'Type \`!m [category]\` to create a new category (meta).\n' +
                    '\`!p [puzzle]\` in a channel to create a channel in the same category.\n' +
                    '\`!s [answer]\` to mark a puzzle as solved.\n' +
                    'List of commands:')
                .setFooter(`Send ${prefix}help [command] for more info on the command.`);

            const categories = fs.readdirSync('./commands');
            categories.forEach(category => {
                const commandFiles = fs.readdirSync(`./commands/${category}`).filter(file => file.endsWith('.js'));
                let commandArray = [];
                commandFiles.forEach(file => {
                    const command = require(`../${category}/${file}`);
                    commandArray.push(command.name);
                });
                embed.addField(`${category}`, `\`${commandArray.join('\` \`')}\``)
            });

            message.channel.send(embed);
        } else {
            const {commands} = message.client;
            const name = args[0].toLowerCase();
            const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

            if (!command)
                return message.reply("unknown command.");

            let embed = new Discord.MessageEmbed()
                .setTitle(`\`${command.name}\``)
                .setColor('BLUE');

            if (command.aliases)
                embed.addField(`Aliases`, `\`${command.aliases.join('\` \`')}\``);
            if (command.description)
                embed.addField(`Description`, command.description);
            if (command.usage)
                embed.addField(`Usage`, `\`${prefix}${command.name} ${command.usage}\``);
            if (command.notes)
                embed.addField(`Notes`, command.notes);

            message.channel.send(embed);
        }
    }
};
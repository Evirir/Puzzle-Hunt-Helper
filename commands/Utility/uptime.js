module.exports = {
    name: 'uptime',
    description: `Reports the uptime.`,
    aliases: [`awake`],

    execute(message) {
        let totalSeconds = (message.client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds) % 60;

        let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;

        message.channel.send(`I woke up since ${uptime} ago...and I don't see a reason to sleep yet! \\o.=.o/`);
    }
};
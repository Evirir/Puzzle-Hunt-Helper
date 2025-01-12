import {Event} from "../types";

const event: Event = {
    name: "guildDelete",
    execute(_client, guild) {
        const msg = `I have been removed from ${guild.name} (id: ${guild.id})`;
        console.log(msg);
    }
};

module.exports = event;
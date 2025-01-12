import {Event} from "../types";

const event: Event = {
    name: "guildCreate",
    execute(_client, guild) {
        const msg = `I discovered a new server: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members.`;
        console.log(msg);
    }
};

module.exports = event;
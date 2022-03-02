const fs = require('fs');
let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

var blacklist = []; //TODO: Move blacklist to database collumn

exports.run = (deletedMessage, sql, client, guild) => {

    //Global log channel, ID is in config.json
    const logChannel = client.channels.cache.get(config.logChannel);

    //Guild blacklist autoleave
    if (blacklist.includes(guild.id)) {
        logChannel.send("```diff\n>>>Guild Joined: " + guild.name + " - ID: " + guild.id + "\n+>>>" + client.guilds.cache.size + " Servers\n->>>Guild blacklisted, leaving```");
        guild.leave();
    } else {
        logChannel.send("```diff\n>>>Guild Joined: " + guild.name + " - ID: " + guild.id + "\n+>>>" + client.guilds.cache.size + " Servers\n```");
    }

}

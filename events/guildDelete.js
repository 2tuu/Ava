const fs = require('fs');
let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

exports.run = (deletedMessage, sql, client, guild) => {

    //Log channel variable
    const logChannel = client.channels.cache.get(config.logChannel);

    console.log(">>>Guild Left: " + guild.name + " (" + guild.id + ")");
    logChannel.send("```diff\n>>>Guild Left: " + guild.name + " (" + guild.id + ")\n->>>" + client.guilds.cache.size + " Servers\n```");

}
const Discord = require("discord.js");
const config = require('./../../config.json');

exports.run = async (client, message) => {
    var label = args.join(' ');
    console.log(`============================\n${label.toUpperCase()}\n============================`);
};

exports.conf = {
    name: "N/A (dev command)",
    help: "N/A",
    format: "N/A",
    DM: true,
    ownerOnly: true,
    alias: ['log']
}
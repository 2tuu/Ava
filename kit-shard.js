/*

    WIP Junk for later, haven't gotten this working properly yet

*/

const Discord = require('discord.js');
const Manager = new Discord.ShardingManager('./app.js');
Manager.spawn(6);
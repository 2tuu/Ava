const api = require("./../plugins/api.js");
const config = require('./../config.json');
const axios = require('axios');
const Discord = require('discord.js');

exports.run = async (client, message, args) => {

var timeStart = Math.floor(Date.now() / 1000); 
  
  await axios.get(`https://api.kitk.us/v3/hug`, {
    headers: {
        "Authorization" : `${args.join(' ')}`
      }
  }).then(() => {
      var timeEnd = Math.floor(Date.now() / 1000);
  });
 
  message.channel.send('```' + `Response time: ${timeEnd - timeStart}ms` +'```');
  console.log(request);

}

exports.conf = {
    DM: true,
    OwnerOnly: false
}
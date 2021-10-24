const Discord = require("discord.js");
const Canvas = require("canvas");
const fs = require("fs");
const neko = require('nekocurl');

const { createCanvas, loadImage } = require('canvas');

const config = require("./../config.json");

const imgur = require('imgur');
imgur.setClientId(config.imgur);
imgur.setAPIUrl('https://api.imgur.com/3/');

let Image = Canvas.Image;
let canvas = Canvas.createCanvas(500, 500);
let ctx = canvas.getContext('2d');

const slowMode = new Set();

let img = new Image();

//Temporary staff and contributor list, will eventually be in the database
var staff = ["600119803528609863"];
var conts = ["600119803528609863"];

exports.run = async (client, message, args, deletedMessage, sql) => {

  //Profile generator
  async function profileGen(id, color, icon, cmds, quarters, desc){

    let canvas = Canvas.createCanvas(500, 500);
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    loadImage('https://cdn.discordapp.com/avatars/378769654942007299/fb4889fdc62a0833a1ee7840add8dd2b.png').then((image) => {
      ctx.drawImage(image, 177, 36, 147, 147);
    })
    
    //profile image attached to message
    var timeToFinish = Date.now() - message.createdTimestamp + "ms";
  
    message.channel.send(`Profile`, {
      files: [{
        attachment: Buffer.from(canvas.toDataURL().split(",")[1], "base64"),
        name: 'profile.jpg'
      }]
    });
  }
// end of profile generator

      //var avatarUrl = client.users.get(message.author.id).avatar;
      //avatarUrl = "https://cdn.discordapp.com/avatars/" + message.author.id + "/" + avatarUrl + ".png";
      profileGen(message.author.id, 'row.color', message.author.avatarURL(), 'row.cmds', 'row.quarters', 'row.desc');


}

exports.conf = {
  name: "N/A (dev command)",
  help: "N/A",
  format: "Under Construction",
  DM: true,
  OwnerOnly: true,
  alias: []
}

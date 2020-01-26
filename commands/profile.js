const Discord = require("discord.js");
const Canvas = require("canvas");
const fs = require("fs");
const neko = require('nekocurl');

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


/*
  Profile Database Structure

  ID,Quart,Badge,Desc,Color,Comms,Coin Time

*/

/*
  Templates

  Text Writing:


  Image Writing

  img.src = fs.readFileSync(`./../images/image.png`);
  ctx.drawImage(img, 0, 0, 500, 500);
  
*/

exports.run = async (client, message, args, deletedMessage, sql) => {





  //Profile generator
  async function profileGen(id, color, icon, cmds, quarters, desc){
    message.channel.startTyping();

    let canvas = Canvas.createCanvas(500, 500);
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    //Description line splitter
    let lines = desc.replace(new RegExp(`''`, `g`), `"`).replace(/(.{31})/g,'$1\n').split('\n');
    if (!lines[lines.length-1]) lines = lines.slice(0,-1);
  
    //user object from id arg
    var member = await client.fetchUser(id);
  
    //background
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 500, 500);
  
    //default font
    ctx.font = `80px "Gadugi"`;
    ctx.fillStyle = '#000';


    //first layer (boxes behind badge holes)
    img.src = fs.readFileSync(`./images/profile-1.png`);
    ctx.drawImage(img, 0, 0, 500, 500);


    //second layer, put profile image, badges here
    //profile picture
    img.src = await neko.get(icon, { autoString: false });
    ctx.drawImage(img, 177, 36, 147, 147);
    //badges (Staff and contributor only)
    if(conts.includes(id)){
      img.src = fs.readFileSync(`./images/cont.png`);
      ctx.drawImage(img, 346, 17, 69, 69);
    }
    if(staff.includes(id)){
      img.src = fs.readFileSync(`./images/staff.png`);
      ctx.drawImage(img, 85, 17, 69, 69);
    }


    //third layer (card face)
    img.src = fs.readFileSync(`./images/profile-2.png`);
    ctx.drawImage(img, 0, 0, 500, 500);


    //fourth layer (text)
    //level number
    ctx.font = `55px "Gadugi"`;
    ctx.fillStyle = '#000';
    ctx.textAlign="center";
    ctx.fillText(`${Math.floor(0.1 * Math.sqrt(cmds + quarters + 1))}` , 70,280); //weird curve equation to calculate level based on commands used
    //username
    ctx.font = `25px "Gadugi"`;
    ctx.fillStyle = '#000';
    ctx.textAlign="start";
    ctx.fillText(client.users.get(id).tag , 145,240);
    //commands
    ctx.font = `25px "Gadugi"`;
    ctx.fillStyle = '#000';
    ctx.textAlign="start"; 
    ctx.fillText(cmds , 145,295); //rounding
    //quarters
    ctx.font = `25px "Gadugi"`;
    ctx.fillStyle = '#000';
    ctx.textAlign="start";
    var dispQ = "$" + (parseInt(quarters)*0.25);
    ctx.fillText(dispQ , 313,295);
    //description
    ctx.font = `25px "Gadugi"`;
    ctx.fillStyle = '#000';
    ctx.textAlign="start";
    var x = 353;
    var it = 1;

    while(lines.length >= it){
      ctx.fillText(lines[it-1].trim() , 18, x);
      it = it+1;
      x = x + 20;
    }

    //ctx.fillText(desc , 18,353);

    //profile image attached to message
    var timeToFinish = Date.now() - message.createdTimestamp + "ms";
  
    message.channel.send(`Profile for **${member.tag}** (${timeToFinish})`, {
      files: [{
        attachment: Buffer.from(canvas.toDataURL().split(",")[1], "base64"),
        name: 'profile.jpg'
      }]
    });
  message.channel.stopTyping();
  }
// end of profile generator






  //Profile database junk
  sql.get(`SELECT * FROM profile WHERE userId ="${message.author.id}"`).then(row => {

    //Create a profile if one doesn't exist
    if(!row){
      sql.run("INSERT INTO profile (userId, quarters, badge, desc, color, cmds, qTime) VALUES (?, ?, ?, ?, ?, ?, ?)", [message.author.id, "4", "490747106278244353", "Not set", "#ffffff", 0, 0]);
      const embed = new Discord.RichEmbed()
        .setDescription("Profile created")
      return message.channel.send({embed});
    }

  });


  //No arguments, display the sender's profile
  if(!args[0]){

    sql.get(`SELECT * FROM profile WHERE userId ="${message.author.id}"`).then(row => {
      var avatarUrl = message.author.avatar;
      avatarUrl = "https://cdn.discordapp.com/avatars/" + message.author.id + "/" + avatarUrl + ".png";
      profileGen(message.author.id, row.color, avatarUrl, row.cmds, row.quarters, row.desc);
    });

  //Update profile description
  } else if(args[0] === "desc" || args[0] === "description"){

    sql.get(`SELECT * FROM profile WHERE userId ="${message.author.id}"`).then(row => {
      var charLimit = 217;
      var charLength = args.slice(1).join(' ').length;

      if(charLength > charLimit) {return message.channel.send("Too many characters, please use 217 or less");}
      
      sql.run(`UPDATE profile SET desc ="${args.slice(1).join(' ')}" WHERE userId ="${message.author.id}"`);
      message.channel.send("Updated Description");//TODO: Replace with embed
    });
  
  //Update ridge color
  } else if(args[0] === "color"){
    const hex = /^#?[0-9A-F]{6}$/i;//Valid hexidecimal checker
    if(!args[1]){
      return message.channel.send("Supply a hex color code `usage: k?profile color #<code>`");
    } else if(!hex.test(args[1]) || !args[1].startsWith("#")){
      return message.channel.send(`Invalid hex code. Get a new one here: https://www.w3schools.com/colors/colors_picker.asp`);
    }

    sql.run(`UPDATE profile SET color ="${args[1]}" WHERE userId ="${message.author.id}"`);
    message.channel.send("Profile background color changed to `" + args[1] + "`");

  } else {
    var withoutMention = args[0].replace("<@","");
        withoutMention = withoutMention.replace(">","");

    sql.get(`SELECT * FROM profile WHERE userId ="${withoutMention}"`).then(row => {

      if(!row){
        return message.channel.send("I can't find a profile for that user");
      }

      var avatarUrl = client.users.get(row.userId).avatar;
      avatarUrl = "https://cdn.discordapp.com/avatars/" + row.userId + "/" + avatarUrl + ".png";
      profileGen(row.userId, row.color, avatarUrl, row.cmds, row.quarters, row.desc);
    });
  }

}

exports.conf = {
  DM: true,
  OwnerOnly: false,
  alias: []
}

const Discord = require("discord.js");
const Canvas = require("canvas");
const fs = require("fs");
const neko = require('nekocurl');

const config = require("./../config.json");

const imgur = require('imgur');
imgur.setClientId(config.imgur);
imgur.setAPIUrl('https://api.imgur.com/3/');

//const config = require("./../config.json");

let Image = Canvas.Image;
let canvas = Canvas.createCanvas(500, 306);
let ctx = canvas.getContext('2d');

const slowMode = new Set();

let img = new Image();

//TO DO: Move this to config
var staff = [
  "378769654942007299",
  "454461184792461312"
];

var boat = [
  "204890104349589504",
  "435855803363360779",
  "166365757561634816"
];


var games = [
  "476445588418723841" ,"476445588951400480" ,"476445589031092235" ,"476445589488271362" , "491419851886428170",
  "476445589568225291" ,"476445589572419584" ,"476445589580677143" ,"476445589593260053" ,
  "476445589635072010" ,"476445589710700545" ,"476445589845049375" ,"476445620131987456" ,
  "476445620207616009" ,"476445620689960981" ,"476445620975042579" ,"476445621616902154" ,
  "476445621969223681" ,"476445621973286922" ,"476445622078275599" ,"476445649139793931" ,
  "476445649496309822" ,"476446147544875018" ,"476446147741745175" ,"476505925281251350" ,
  "476506134157459496" ,"476506134203727872" ,"476506134367174667" ,"476506134690398209" ,
  "476506134753181706" ,"476506134812033024" ,"476506134946250752" ,"476506176985628673" ,
  "476506178185330688" ,"476506179523313664" ,"476506180014047262" ,"476506180550918154" ,
  "476506180613701633" ,"476506180714233876" ,"476506180890394643" ,"476506180928143360" ,
  "476510622121459723" ,"476510621806886913", "476961723912421376" ,"476510621790371852" , "476510621949493273" , "493094743941840926", "493094742251274241",
  "476510622020796427" ,"476510622247419917", "478273923763535873" ,"476510622352408576" , "476514178031681556" , 
  "476514177742143530" ,"476514177641611266" ,"476514177918304288" ,"476514178098528256" ,
  "476514178132344832" ,"476514177712652289" ,"476514178010578964" ,"476514177872035872" ,
  "476514178224488460" ,"476516801761771530" ,"476516801765703681" ,"476516801446936592" ,
  "476516801648394241" ,"476516801774354442" ,"476516801770160140" ,"476516801858240522" ,
  "476516801929543730" ,"476516801610514435" ,"314349923044687872" ,"476281476384555008" , "476961723979661332", "476962929569169438", "476963250592940055", "477280600751865857",
  "477681496216567810" ,"477681493888598016" ,"477681493775351833" ,"477681494198845462" , 
  "478274648048664577" ,"478274647779966978", "478274649856147457" ,"478274649365413898" , "478274647893213185", "478274647981555743", "478274648107122698",
  "123456" //<<---- DO NOT REMOVE
];

var Egames = [
  "<:bulb:476445588418723841>" ,"<:kip:476445588951400480>" ,"<:calamus:476445589031092235>" ,"<:rue:476445589488271362>" , "<:watcher:491419851886428170>",
  "<:prophet:476445589568225291>" ,"<:proto:476445589572419584>" ,"<:plight:476445589580677143>" ,"<:rowbot:476445589593260053>" ,
  "<:silver:476445589635072010>" ,"<:niko:476445589710700545>" ,"<:alula:476445589845049375>" ,"<:casual:476445620131987456>" ,
  "<:icon:476445620207616009>" ,"<:godess:476445620689960981>" ,"<:fishbunjin:476445620975042579>" ,"<:ruby:476445621616902154>" ,
  "<:jenny:476445621969223681>" ,"<:ittle_dew:476445621973286922>" ,"<:remedy:476445622078275599>" ,"<:gmod:476445649139793931>" ,
  "<:tf2:476445649496309822>" ,"<:magpie:476446147544875018>" ,"<:cedric:476446147741745175>" ,"<:neko_atsume:476505925281251350>" ,
  "<:cultist:476506134157459496>" ,"<:convict:476506134203727872>" ,"<:hunter:476506134367174667>" ,"<:marine:476506134690398209>" ,
  "<:icon:476506134753181706>" ,"<:robot:476506134812033024>" ,"<:pilot:476506134946250752>" ,"<:icon:476506176985628673>" ,
  "<:dva:476506178185330688>" ,"<:reaper:476506179523313664>" ,"<:tracer:476506180014047262>" ,"<:mccree:476506180550918154>" ,
  "<:mercy:476506180613701633>" ,"<:mei:476506180714233876>" ,"<:sombra:476506180890394643>" ,"<:reinhardt:476506180928143360>" ,
  "<:arceus:476510622121459723>" ,"<:rayquaza:476510621806886913>", "<:lucario:476961723912421376>" ,"<:greninja:476510621790371852>" ,"<:pikachu:476510621949493273>" , "<:zeraora:493094743941840926>", "<:garchomp:493094742251274241>",
  "<:sylveon:476510622020796427>" ,"<:mew:476510622247419917>", "<:mimikyu:478273923763535873>" ,"<:icon:476510622352408576>","<:icon:476514178031681556>" ,
  "<:emily:476514177742143530>" ,"<:grandpa:476514177641611266>" ,"<:hench:476514177918304288>" ,"<:krobus:476514178098528256>" ,
  "<:shane:476514178132344832>" ,"<:abigail:476514177712652289>" ,"<:alex:476514178010578964>" ,"<:dwarf:476514177872035872>" ,
  "<:vincent:476514178224488460>" ,"<:doggo:476516801761771530>" ,"<:napstablook:476516801765703681>" ,"<:papyrus:476516801446936592>" ,
  "<:temmie:476516801648394241>" ,"<:ice_cap:476516801774354442>" ,"<:toriel:476516801770160140>" ,"<:dog:476516801858240522>" ,
  "<:undyne:476516801929543730>" ,"<:woshua:476516801610514435>" ,"<:steam:314349923044687872>" ,"<:devil:476281476384555008>", "<:sadcat:476961723979661332>", "<:berd:476962929569169438>", "<:rover:476963250592940055>", "<:trash:477280600751865857>",
  "<:icon:477681496216567810>" ,  "<:excalibur:477681493888598016>" ,  "<:mag:477681493775351833>" , "<:volt:477681494198845462>", 
  "<:icon:478274648048664577>", "<:baby:478274647779966978>", "<:darksamussuit:478274649856147457>", "<:samussuit:478274649365413898>", "<:zerosamus:478274647893213185>", "<:kraid:478274647981555743>", "<:Ridley:478274648107122698>",
  "<:placeholder:123456>" //<<---- DO NOT REMOVE
];


exports.run = (client, message, args, deletedMessage, sql) => {
try{
  //Donor array constructor
  var kitSupport = client.guilds.find('id', '449263514436239360');
var donorArray = kitSupport.roles.find('id', '479013774880276502').members.array();
var donorIDArray = [];

var i = 0;
while((i+1) <= donorArray.length){
  donorIDArray[i] = donorArray[i].user.id;
  i = i+1;
}

var IDarray = donorIDArray;


  try{

    //Standard profile card
    async function profiler(id, color, quarters, desc, badge1, badge2, cmds, bg){
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let lines = desc.replace(new RegExp(`''`, `g`), `"`).replace(/(.{93})/g,'$1\n').split('\n');
      if (!lines[lines.length-1]) lines = lines.slice(0,-1);
      console.log(bg);
      
      message.channel.startTyping();
      var member = await client.fetchUser(id);
      //console.log(member.avatar);

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 500, 306);

      ctx.font = `80px "Gadugi"`;
      ctx.fillStyle = '#000';

      if(bg){

        try{
          img.src = await neko.get(bg, { autoString: false })
          console.log(img);
          ctx.drawImage(img, 0, 0, img.width,    img.height,     // source rectangle
          0, 0, canvas.width, canvas.height); // destination rectangle
        }
        catch(err){
          message.channel.send("Background URL incorrect, try uploading it to imgur and try that link")
          message.channel.stopTyping();
        }
        
      }
        
      img.src = fs.readFileSync('./backgrounds/v2/bg.png');
      ctx.drawImage(img, 0, 0);
      img.src = fs.readFileSync('./backgrounds/v2/frame.png');
      ctx.drawImage(img, 0, 0);
      img.src = fs.readFileSync('./backgrounds/v2/frame2.png');
      ctx.drawImage(img, 0, 0);

      img.src = await neko.get(member.avatarURL, { autoString: false });
      /*
      ctx.save();

      ctx.beginPath();
      ctx.arc(35 + (161 / 2), 34 + (161 / 2), 161 / 2, 0, Math.PI * 2, false);

      ctx.clip();
      */
      ctx.drawImage(img, 35, 34, 161, 161);
      /*
      ctx.restore();
      */
     img.src = fs.readFileSync('./backgrounds/v2/block.png');
     ctx.drawImage(img, 0, 0);


      img.src = await neko.get(badge1, { autoString: false });
      ctx.save();

      ctx.beginPath();
      ctx.arc(183 + (34 / 2), 162 + (44 / 2), 92 / 2, 0, Math.PI * 2, false);

      ctx.clip();
      ctx.drawImage(img, 183, 162, 34, 33);
      ctx.restore();

      //img.src = fs.readFileSync('./backgrounds/bg3.png');
      //ctx.drawImage(img, 36, 515, 97, 97);
      img.src = await neko.get(badge2, { autoString: false });
      ctx.save();

      ctx.beginPath();
      ctx.arc(183 + (33 / 2), 34+ (34 / 2), 92 / 2, 0, Math.PI * 2, false);

      ctx.clip();
      ctx.drawImage(img, 183, 34, 34, 33);
      ctx.restore();


      img.src = fs.readFileSync('./backgrounds/v2/front.png');
      ctx.drawImage(img, 0, 0);



      ctx.globalAlpha = 1;
      ctx.fillStyle = '#fff';
      ctx.font = `18px "Gadugi"`;
      ctx.fillText(member.tag, 225, 55);
      ctx.font = `18px "Gadugi"`;
      ctx.fillText(`Quarters: ${quarters} ($${quarters / 4})`, 225, 83);
      //ctx.fillText(`test: 0`, 60, 320);
      
      ctx.font = `12px "Gadugi"`;
      ctx.fillStyle = '#fff';
      //ctx.fillText(desc , 670, 270); //set max chars to 42
      var x = 245;
      var it = 1;

      while(lines.length >= it){
        ctx.fillText(lines[it-1].trim() , 23, x);
        it = it+1;
        x = x + 15;
      }

      ctx.fillStyle = '#fff';

      ctx.font = `26px "Gadugi"`;
      ctx.textAlign="center";
      ctx.fillText(`${Math.floor(0.1 * Math.sqrt(cmds + 1))}` , 445,196);
      ctx.textAlign="start";
      ctx.fillText(Math.floor(cmds) , 301,196);
      ctx.textAlign="start";

      var timeToFinish = Date.now() - message.createdTimestamp + "ms";

message.channel.send(`Profile for **${member.tag}** (${timeToFinish})`, {
  files: [{
    attachment: Buffer.from(canvas.toDataURL().split(",")[1], "base64"),
    name: 'profile.jpg'
  }]
})
  .then().catch(console.error);

  message.channel.stopTyping();
}

//Summary card, points only, TO DO
async function sumProfiler(id, points){

}

//profiler(id, hex-code, fun-badge, auto-badge)
//profiler(message.author.id, '#fa6969', 'https://cdn.discordapp.com/emojis/476445620975042579.png?v=1', message.author.avatarURL);





/*
    const embed = new Discord.RichEmbed()
    .setColor(0xF46242)
    .setDescription("This command is in beta")
    .setFooter("Use k?betareport to report any bugs or typos, be specific")
    message.channel.send({embed});
*/





if(args[0] === "create"){
//sql.run("INSERT INTO profile (userId, username, avatar, desc, title, row.quarters, torow.quarters) VALUES (?, ?, ?, ?, ?, ?, ?)", [message.author.id, message.author.username, message.author.avatarURL, "Description not set", "User", 4, 0]);

sql.get(`SELECT * FROM profile WHERE userId ="${message.author.id}"`).then(row => {
  if(!row){

    sql.run("INSERT INTO profile (userId, quarters, badge, desc, color, cmds, qTime) VALUES (?, ?, ?, ?, ?, ?, ?)", [message.author.id, "4", "490747106278244353", "Not set", "#fa6969", 0, 0]);
    const embed = new Discord.RichEmbed()
      .setDescription("Profile created")
    return message.channel.send({embed});

  } else {

    const embed = new Discord.RichEmbed()
      .setColor(0xF46242)
      .setDescription("You already have a profile")
      .setFooter("Use k?profile")
    return message.channel.send({embed});
    
  }
});

} else if(args[0] === "size"){

  if(!message.author.id === "378769654942007299") return;
				
  sql.all(`SELECT userID FROM profile`).then(row => {

    const embed = new Discord.RichEmbed()
      .setTimestamp() //Write to JSON
      .setTitle("There are " + (row.length) + " profiles stored")
    message.channel.send({embed});
  });

} else if(args[0] === "edit"){

  sql.get(`SELECT * FROM profile WHERE userId ="${message.author.id}"`).then(row => {
    if(!row){
      const embed = new Discord.RichEmbed()
        .setColor(0xF46242)
        .setDescription("You don't have a profile")
        .setFooter("Use k?profile create")
      return message.channel.send({embed});
    } else {

      if(!args[1]){

        const embed = new Discord.RichEmbed()
          .setColor(0xF46242)
          .setTimestamp() //Write to JSON
          .setTitle("Invalid argument: Use [color, desc]")
          message.channel.send({embed});

      } else if(args[1] === "color"){
        sql.run(`UPDATE profile SET color = "${args[2]}" WHERE userId = "${message.author.id}"`);
        sql.run(`UPDATE profile SET bg = null WHERE userId = "${message.author.id}"`);
        const embed = new Discord.RichEmbed()
          .setTimestamp() //Write to JSON
          .setTitle("Color updated")
        message.channel.send({embed});

      } else if(args[1] === "background" || args[1] === "bg"){

        var Attachment = (message.attachments).array();

          if(IDarray.includes(message.author.id)){

            if(args[2] === "remove"){

              sql.run(`UPDATE profile SET bg = null WHERE userId = "${message.author.id}"`);

              const embed = new Discord.RichEmbed()
                .setTimestamp()
                .setTitle("Background updated")
              message.channel.send({embed});
            } else {
      
              if(!Attachment[0]){
                  if(!args[2]) return message.channel.send("No link or image was given");
                var imgUrl = args[2];
              } else {
                var imgUrl = Attachment[0].url;
              }


        message.channel.startTyping();
          imgur.uploadUrl(imgUrl)
            .then(function (json) {

              if(!json.data.link) return message.channel.send("There was an error");
              sql.run(`UPDATE profile SET bg = "${json.data.link}" WHERE userId = "${message.author.id}"`);

              const embed = new Discord.RichEmbed()
                .setTimestamp() //Write to JSON
                .setTitle("Background updated")
              message.channel.send({embed});

            }).catch((err) => {

              const embed = new Discord.RichEmbed()
                .setColor(0xF46242)
                .setTitle("An Error Occured while uploading this image")
                .setFooter(err);
              return message.channel.send({embed});

              console.error(err);
            })
          message.channel.stopTyping();


      }

      //If not in donors
    } else {

      if(!row){

        const embed = new Discord.RichEmbed()
          .setColor(0xF46242)
          .setTimestamp()
          .setDescription("Create a profile first")
          .setFooter("Use `k?profile create`")
        message.channel.send({embed});

      } else {

        if(parseInt(row.quarters) < 20){

          const embed = new Discord.RichEmbed()
            .setColor(0xF46242)
            .setTimestamp() //Write to JSON
            .setTitle("You don't have enough coins (20 required)")
          message.channel.send({embed});

        } else {

          var Attachment = (message.attachments).array();



          if(args[2] === "remove"){

            sql.run(`UPDATE profile SET bg = null WHERE userId = "${message.author.id}"`);

            const embed = new Discord.RichEmbed()
              .setTimestamp()
              .setTitle("Background updated")
            message.channel.send({embed});
          } else {

            //Begin collector
            message.channel.send("This costs 20 coins, image will be stretched to fit area (1625x625)\nAre you sure you want to continue? `(Answer Yes/No)`")
            const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
      
            collector.on('collect', message => {
              if (message.content.toLocaleLowerCase() == "yes") {
                  //finish

                  if(!Attachment[0]){
                    if(!args[2]) return message.channel.send("No link or image was given");
                    var imgUrl = args[2];
                  } else {
                    var imgUrl = Attachment[0].url;
                  }

                  message.channel.startTyping();
                  imgur.uploadUrl(imgUrl)
                    .then(function (json) {
                    
                      if(!json.data.link) return message.channel.send("There was an error");
                      sql.run(`UPDATE profile SET bg = "${json.data.link}" WHERE userId = "${message.author.id}"`);
                      sql.run(`UPDATE profile SET quarters = "${row.quarters - 20}" WHERE userId = "${message.author.id}"`)
      
                      const embed = new Discord.RichEmbed()
                        .setTimestamp() //Write to JSON
                        .setTitle("Background updated")
                      message.channel.send({embed});
                      collector.stop();
      
                    }).catch((err) => {
      
                      const embed = new Discord.RichEmbed()
                        .setColor(0xF46242)
                        .setTitle("An Error Occured while uploading this image")
                        .setFooter(err);
                      return message.channel.send({embed});
                      collector.stop();
                      //console.error(err);
                      })
                  message.channel.stopTyping();

              } else if (message.content.toLocaleLowerCase() == "no") {

                  return message.channel.send("Transaction canceled.");
                  collector.stop();

              } else {

                return message.channel.send("Invalid input, type yes or no.");

              }
          });


      }


      
    
    }

    }

      //NON-DONATOR

  }

    } else if(args[1] === "desc"){

      let lines = args.join(' ').replace(new RegExp(`''`, `g`), `"`).replace(/(.{93})/g,'$1\n').split('\n');
      if (!lines[lines.length-1]) lines = lines.slice(0,-1);

        if(lines.length > 3){
          const embed = new Discord.RichEmbed()
            .setColor(0xF46242)
            .setTimestamp()
            .setTitle("Too many characters")
          message.channel.send({embed});
        } else {
          sql.run(`UPDATE profile SET desc = "${args.slice(2).join(' ').replace(new RegExp(`"`, 'g'), "''")}" WHERE userId = "${message.author.id}"`)
          const embed = new Discord.RichEmbed()
            .setTimestamp()
            .setTitle("Description updated")
          message.channel.send({embed});
      }

    }

  }
  });

} else if(args[0] === "badges"){

  if(args[1] === "equip"){


    sql.get(`SELECT * FROM profile WHERE userId ="${message.author.id}"`).then(row => {

      if(!row){
        const embed = new Discord.RichEmbed()
          .setColor(0xF46242)
          .setTimestamp()
          .setDescription("Create a profile first")
          .setFooter("Use `k?profile create`")
        message.channel.send({embed});

  
      } else {

        if(!args[2] || !games[parseInt(args[2]) - 1]) return message.channel.send("Badge number invalid or not given, use `profile badges remove` to remove your badges");

        if(parseInt(row.quarters) < 4){

          const embed = new Discord.RichEmbed()
            .setColor(0xF46242)
            .setTimestamp() //Write to JSON
            .setTitle("You don't have enough coins (4 required)")
          message.channel.send({embed});

        } else {

          sql.run(`UPDATE profile SET badge = "${games[parseInt(args[2]) - 1]}" WHERE userId = "${message.author.id}"`).then(()=>{
          
            const embed = new Discord.RichEmbed()
              .setTimestamp() //Write to JSON
              .setTitle("Title Updated")
            message.channel.send({embed});
          }).catch(() => {

            const embed = new Discord.RichEmbed()
              .setColor(0xF46242)
              .setTimestamp()
              .setTitle("Profile does not exist (Invalid ID or not yet created)")
            message.channel.send({embed});
          });

          sql.run(`UPDATE profile SET quarters = "${row.quarters - 4}" WHERE userId = "${message.author.id}"`)
        }

    }
  });

  }else if(args[1] === "customequip"){
    //Disabled for now
  }else if(args[1] === "remove"){

    sql.get(`SELECT * FROM profile WHERE userId ="${message.author.id}"`).then(row => {

      if(!row){
        const embed = new Discord.RichEmbed()
          .setColor(0xF46242)
          .setTimestamp()
          .setDescription("Create a profile first")
          .setFooter("Use `profile`")
        message.channel.send({embed});

    
      } else {


        sql.run(`UPDATE profile SET badge = "490747106278244353" WHERE userId = "${message.author.id}"`).then(()=>{
        
          const embed = new Discord.RichEmbed()
            .setTimestamp() //Write to JSON
            .setTitle("Title Updated")
          message.channel.send({embed});

        }).catch(() => {

          const embed = new Discord.RichEmbed()
            .setColor(0xF46242)
            .setTimestamp() //Write to JSON
            .setTitle("Profile does not exist (Invalid ID or not yet created)")
          message.channel.send({embed});
        });

      }
      });
      
  } else if (!isNaN(args[1])){
      var it = 0;
      var list = [];

      while((it + 1) < Egames.length){
        list[it] = " **" + (it+1) + "**: " + Egames[it];
        it = it + 1;
      }

      function chunkArray(myArray, chunk_size){
        var index = 0;
        var arrayLength = myArray.length;
        var tempArray = [];
      
        for (index = 0; index < arrayLength; index += chunk_size) {
          myChunk = myArray.slice(index, index+chunk_size);
          // Do something if you want with the group
          tempArray.push(myChunk);
        }
    
        return tempArray;
      }

    // Split in group of 3 items
    list = chunkArray(list, 4);

    var lists = chunkArray(list, 5);

    var pagenum = parseInt(args[1]);

    if(!lists[pagenum - 1]){
      const embed = new Discord.RichEmbed()
  .setColor(0xF46242)
  .setTimestamp() //Write to JSON
  .setTitle("Invalid page number")
  .setDescription("There are " + (lists.length) + " pages");
  message.channel.send({embed});
    } else {
      const embed = new Discord.RichEmbed()
  
  .setTitle("Badges (4 coins) - Page " + pagenum + "/" + lists.length)
  .setDescription(lists[pagenum - 1])
  .setFooter("Use `profile badges equip #` to recieve a badge")
  message.channel.send({embed});
    }

    /*
      const embed = new Discord.RichEmbed()
  
  .setTitle("Badges")
  .setDescription(lists[0])
  .setFooter("Use `profile badges equip #` to recieve a badge")
  message.channel.send({embed});

  const embed2 = new Discord.RichEmbed()
  
  .setDescription(lists[1])
  .setFooter("Use `profile badges equip #` to recieve a badge")
  message.channel.send({embed: embed2});
*/
    } else {
      //invalid command
      const embed = new Discord.RichEmbed()
  .setColor(0xF46242)
  .setTimestamp() //Write to JSON
  .setTitle("Usage")
  .setDescription("`profile badges <page number>`");
  message.channel.send({embed});
    }

    /*
  }).catch(() => {
  //console.error;
  const embed = new Discord.RichEmbed()
.setColor(0xF46242)
.setTimestamp() //Write to JSON
.setTitle("Profile does not exist (Invalid ID or not yet created)")
message.channel.send({embed});
  });
  */
} else if(!args[0]){ //own profile

	if (slowMode.has(message.author.id)) {
		return message.reply("please wait 20 seconds before using that command again");
	} else {
	slowMode.add(message.author.id);
	setTimeout(() => {
	  slowMode.delete(message.author.id);
	}, 20000);
    }

  sql.get(`SELECT * FROM profile WHERE userId ="${message.author.id}"`).then(row => {
  
    if(!row){
      const embed = new Discord.RichEmbed()
      .setColor(0xF46242)
      .setDescription("You don't have a profile")
      .setFooter("Use k?profile create")
      return message.channel.send({embed});
    } else {
      var argsVar = message.author.id;
      if(staff.includes(argsVar)){
        profiler(argsVar, row.color, row.quarters, row.desc, `https://cdn.discordapp.com/emojis/${row.badge}.png?v=1`, `https://cdn.discordapp.com/emojis/314068430787706880.png?v=1`, row.cmds, row.bg); //staff
      } else if(boat.includes(argsVar)){
        profiler(argsVar, row.color, row.quarters, row.desc, `https://cdn.discordapp.com/emojis/${row.badge}.png?v=1`, `https://cdn.discordapp.com/emojis/478057319989510173.png?v=1`, row.cmds, row.bg); //boat
      } else if(IDarray.includes(argsVar)){
        profiler(argsVar, row.color, row.quarters, row.desc, `https://cdn.discordapp.com/emojis/${row.badge}.png?v=1`, `https://cdn.discordapp.com/emojis/479757981949493268.png?v=1`, row.cmds, row.bg); //donor
      } else {
        profiler(argsVar, row.color, row.quarters, row.desc, `https://cdn.discordapp.com/emojis/${row.badge}.png?v=1`, `https://cdn.discordapp.com/emojis/490744262594396170.png?v=1`, row.cmds, row.bg); //blank
      }
    }
    });
  
} else {

  var argsVar = args.join(' ');
				argsVar = argsVar.replace("<@!", "");
				argsVar = argsVar.replace("<@", "");
        argsVar = argsVar.replace(">", "");
        
        sql.get(`SELECT * FROM profile WHERE userId ="${argsVar}"`).then(row => {

          if(!row){
            const embed = new Discord.RichEmbed()
            .setColor(0xF46242)
            .setTimestamp()
            .setDescription("No profile found with that ID");
            message.channel.send({embed});
          } else {

            if (slowMode.has(message.author.id)) {
              return message.reply("please wait 20 seconds before using that command again");
            } else {
            slowMode.add(message.author.id);
            setTimeout(() => {
              slowMode.delete(message.author.id);
            }, 20000);
              }

            if(staff.includes(argsVar)){
              profiler(argsVar, row.color, row.quarters, row.desc, `https://cdn.discordapp.com/emojis/${row.badge}.png?v=1`, `https://cdn.discordapp.com/emojis/314068430787706880.png?v=1`, row.cmds, row.bg); //staff
            } else if(boat.includes(argsVar)){
              profiler(argsVar, row.color, row.quarters, row.desc, `https://cdn.discordapp.com/emojis/${row.badge}.png?v=1`, `https://cdn.discordapp.com/emojis/478057319989510173.png?v=1`, row.cmds, row.bg); //boat
            } else if(IDarray.includes(argsVar)){
              profiler(argsVar, row.color, row.quarters, row.desc, `https://cdn.discordapp.com/emojis/${row.badge}.png?v=1`, `https://cdn.discordapp.com/emojis/479757981949493268.png?v=1`, row.cmds, row.bg); //donor
            } else {
              profiler(argsVar, row.color, row.quarters, row.desc, `https://cdn.discordapp.com/emojis/${row.badge}.png?v=1`, `https://cdn.discordapp.com/emojis/490744262594396170.png?v=1`, row.cmds, row.bg); //blank
            }
          }

        });

}

}
catch(err){
console.log("ERR: " + err);
client.channels.find('id', config.logChannel).send(`\`\`\`js\nERR: ${err} \n\`\`\``);
}

}catch (err){ //Full command catcher
console.log(err);
}

}

exports.conf = {
    DM: true,
    OwnerOnly: false
}

const Discord = require("discord.js");
const e = require("express");
const request = require('request').defaults({ encoding: null });
const imgurUploader = require('imgur-uploader');

exports.run = async (client, message, args, deletedMessage) => {
    var url;
    var attachments = message.attachments.map(e=>e.url);

    if(attachments[0]){
        if(attachments[1] || args[0]){
            return message.reply('Please only attach 1 image');
        }

        if(attachments[0].match(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g)){
            url = attachments[0];
        } else {
            return message.reply('This is not a valid image');
        }
    } else {
        if(!args[0]){
                const embed = new Discord.MessageEmbed()
                    .addField("Description", client.help['imgur'].help)
                    .addField("Usage", '```' + client.help['imgur'].format + '```')
                return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
        } else {
            if(args[1]){
                return message.reply('Please only attach 1 image');
            } else {
                if(args[0].match(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g)){
                    url = args[0];
                } else {
                    return message.reply('This is not a valid image');
                }
            }
        }
    }

    request.get(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            data = Buffer.from(body).toString('base64');
            imgurUploader(data, {title: 'Kit Upload'}).then(data => {
                message.reply(`<${data.link}>`)
            }).catch(err=>{
                message.reply('An error has occured')
            });

        }
    });
}

exports.conf = {
  name: "Imgur",
  help: "Uploads an image to Imgur",
  format: "k?imgur [url]\nk?imgur [image attachment]\n\n1 image only, no album uploading",
  DM: false,
  ownerOnly: false,
  alias: ['upload'],
  slashCommand: false
}
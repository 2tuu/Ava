const Discord = require(`discord.js`);
const Canvas = require("canvas");
const neko = require('nekocurl');
const fs = require("fs");
const config = require('./../../config.json');
const usedRecently = new Set();

exports.run = async (client, message, args, deletedMessage, sql) => {

    if(!args[0] && !message.attachments.map(e=>e.url)[0]){
		const embed = new Discord.MessageEmbed()
			.addField("Description", client.help['colorpreview'].help)
			.addField("Usage", '```' + client.help['colorpreview'].format + '```')
		return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
	}

    let canvas = Canvas.createCanvas(543, 112);
    let Image = Canvas.Image;
    let ctx = canvas.getContext('2d');
        ctx.imageSmoothingQuality = "high"
    let img = new Image();

    var user = client.users.resolve(message.author.id)

    var avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;

    if(message.attachments.map(e=>e.url)[0]){
        avatarUrl = message.attachments.map(e=>e.url)[0];
    }

    img.src = await neko.get(avatarUrl, { autoString: false });
    ctx.drawImage(img, 15, 17, 79, 79);

    img.src = fs.readFileSync(`./images/preview-frame.png`);
    ctx.drawImage(img, 0, 0);

    ctx.fillStyle = message.member.displayHexColor;
    ctx.font = `24px Open Sans`;

    const hex = /^#?[0-9A-F]{6}$/i;
    if(args[0]){
        if(hex.test(args[0])){
            ctx.fillStyle = '#' + args[0].replace('#','');
        } else {
            const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.bad}`)
                .setTitle("Invalid hex code")
            return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
        }
    }

    var tex = message.member.displayName.split("").join('');
    ctx.fillText(tex, 123, 45);

    ctx.fillStyle = '#A4A6A9';
    ctx.font = `20px Open Sans`;
    var texDate = 'Today at 12:00 AM'
    ctx.fillText(texDate, (123+(tex.length*14.5)), 46);

    ctx.fillStyle = '#DCDDDE';
    ctx.font = `21px Open Sans`;
    var tex = 'This is a placeholder message'
    ctx.fillText(tex, 123, 90);

    message.channel.send((`Profile for **${user.tag}**`, {
        files: [{
            attachment: canvas.toBuffer('image/png', { quality: 1 }),
            name: 'preview.png'
        }]
    }));
}

exports.conf = {
    name: "[BETA] Color Preview",
    help: "Preview a role color or avatar",
    format: `k?colorpreview <#hex code>\nSupports avatar preview too, just attach an image`,
    DM: false,
    ownerOnly: false,
    alias: ['avypreview', 'avatarpreview', 'colourpreview'],
    slashCommand: false
}
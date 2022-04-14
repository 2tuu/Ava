const Discord = require(`discord.js`);
const Canvas = require("canvas");
const neko = require('nekocurl');
const fs = require("fs");
const config = require('./../../config.json');

exports.run = async (client, message, args, deletedMessage, sql) => {

    //todo: move this to db or config
    var staff = config.staff;

    async function profileGenerator(row) {
        try {
            //check for profile before even generating the image
            let canvas = Canvas.createCanvas(1000, 750);
            let Image = Canvas.Image;
            let ctx = canvas.getContext('2d');
                ctx.imageSmoothingQuality = "high"
            let img = new Image();

            //bg color
            ctx.fillStyle = '#' + row.background;
            ctx.fillRect(0, 0, 1000, 750);

            //card color is dark
            function hexBright(color) {
                var rgb = parseInt(color, 16);
                var r = (rgb >> 16) & 0xff;
                var g = (rgb >>  8) & 0xff;
                var b = (rgb >>  0) & 0xff;
                var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                return luma > 50;
            }

            var isBright = false;

            if(!row.brightness || row.brightness === 'default'){
                isBright = hexBright(row.background);
            } else {
                if(row.brightness === 'dark'){
                    isBright = true;
                }
            }

            //avatar
            var user = client.users.resolve(row.userid)
            var avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;

            img.src = await neko.get(avatarUrl, { autoString: false });
            ctx.drawImage(img, 75, 75, 310, 310);

            //badge back part
            img.src = fs.readFileSync(`./images/badge-back.png`);
            if(isBright){
                img.src = fs.readFileSync(`./images/badge-back-dark.png`);
            }
            ctx.drawImage(img, 0, 0);

            //staff marker
            if (staff.includes(user.id)) {
                img.src = fs.readFileSync(`./images/staff.jpg`);
                if(isBright){
                    img.src = fs.readFileSync(`./images/staff-dark.jpg`);
                }
                ctx.drawImage(img, 828, 77);
            }

            //profile card
            img.src = fs.readFileSync(`./images/card.png`);
            if(isBright){
                img.src = fs.readFileSync(`./images/card-dark.png`);
            }
            ctx.drawImage(img, 0, 0);

            //badges
            var emojis = client.guilds.cache.get('913526839702589452').emojis.cache.map(e => e);
            var badges = row.badges.split(',');

            var badgeUrls = [];

            emojis.forEach(e => {
                badgeUrls.push({
                    id: `https://cdn.discordapp.com/emojis/${e.id}.png?size=160`,
                    name: e.name.toLowerCase()
                });
            })

            var url;
            if (badges[0] !== 'null') {
                url = badgeUrls.filter(e => e.name === badges[0]);
                if (url[0]) {
                    url = url[0].id;
                } else {
                    url = 'https://cdn.discordapp.com/emojis/913581298222788668.png?size=128'
                }

                img.src = await neko.get(url, { autoString: false });
                ctx.drawImage(img, 369, 313, 87, 87);
            }
            if (badges[1] !== 'null') {
                url = badgeUrls.filter(e => e.name === badges[1]);
                if (url[0]) {
                    url = url[0].id;
                } else {
                    url = 'https://cdn.discordapp.com/emojis/913581298222788668.png?size=128'
                }

                img.src = await neko.get(url, { autoString: false });
                ctx.drawImage(img, 369, 62, 87, 87);
            }

            //badge back part
            img.src = fs.readFileSync(`./images/card-badge-face.png`);
            if(isBright){
                img.src = fs.readFileSync(`./images/card-badge-face-dark.png`);
            }
            ctx.drawImage(img, 0, 0);


            ctx.font = `bold 53px Ubuntu`;
            //username
            ctx.fillStyle = '#494949';
            if(isBright){
                ctx.fillStyle = '#EEEEEE';
            }
            ctx.textAlign = "start";
            ctx.fillText(user.username, 511, 146);

            //subtitle
            ctx.fillStyle = '#494949';
            if(isBright){
                ctx.fillStyle = '#EEEEEE';
            }
            ctx.textAlign = "start";
            ctx.fillText(row.subtitle, 511, 250);

            //coins
            ctx.fillStyle = '#494949';
            if(isBright){
                ctx.fillStyle = '#EEEEEE';
            }
            ctx.textAlign = "start";

            var coins = row.coins;
            coins = parseInt(coins) * 0.25;
            coins = coins.toString().split('.');

            if (!coins[1]) {
                coins[1] = '00';
            } else if (coins[1].length < 2) {
                coins[1] = coins[1] + '0';
            }

            if (coins[0].length === 0) {
                coins[0] = '0';
            }

            coins = '$' + coins.join('.');

            ctx.fillText(coins, 511, 367);

            //level
            var lvl = (Math.round(parseInt(row.cmds) / 1000)) + 1;
            if (lvl > 99) {
                lvl = 99;
            }
            ctx.font = `bold 48px Ubuntu`;
            ctx.fillStyle = '#494949';
            if(isBright){
                ctx.fillStyle = '#EEEEEE';
            }
            ctx.textAlign = "center";
            ctx.fillText(lvl, 440, 255);

            //bio
            var combinedBio = []
            var bio = row.bio.split(' ');
            var temp = '';

            var iter = 0;

            while (iter <= bio.length) {
                if ((temp + ' ' + bio[iter]).length > 48) {
                    combinedBio.push(temp);
                    temp = bio[iter];
                } else {
                    if (bio[iter]) {
                        temp = temp + ' ' + bio[iter];
                    }
                }
                if (iter === bio.length) {
                    combinedBio.push(temp);
                }
                iter = iter + 1;
            }


            if (!combinedBio.includes(temp)) {
                combinedBio.push(bio[bio.length]);
            }

            ctx.font = `35px Ubuntu`;
            ctx.fillStyle = '#494949';
            if(isBright){
                ctx.fillStyle = '#EEEEEE';
            }
            ctx.textAlign = "start";
            ctx.fillText(combinedBio.join('\n'), 90, 465);

            ctx.textAlign = "center";
            ctx.font = `bold 34px Ubuntu`;
            //timezone
            if (!row.time || row.time === "Not Set") {
                ctx.fillStyle = '#494949';
                if(isBright){
                    ctx.fillStyle = '#EEEEEE';
                }
                ctx.fillText('Not Set', 785, 670);
            } else {
                //console.log(row.time);
                var tz = client.timezones[row.time.toString().toUpperCase()];
                var offset = tz.offset;
                if (offset > 0) {
                    offset = '+' + offset;
                }
                var tex = `${tz.abbr} (UTC${offset})`
                ctx.fillText(tex, 785, 670);
            }

            //print profile card
            message.channel.send((`Profile for **${user.tag}**`, {
                files: [{
                    attachment: canvas.toBuffer(),
                    name: 'profile.jpg'
                }]
            }));
        } catch (err) {
            const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.bad}`)
                .setTitle('ERR:\n```js\n' + err + '\n```')
            return message.channel.send({ embeds: [embed] });
        }

    }

    var existingCommands = ['bio', 'timezone', 'subtitle', 'badge', 'color', 'mode'];

    if (!args[0]) {
        //show author's profile here
        var dbResult = await sql.query(`SELECT * FROM profile WHERE userid ='${message.author.id}'`);
        dbResult = dbResult.rows[0];

        if (!dbResult) {
            //create profile
            sql.query(`INSERT INTO profile (userid, subtitle, bio, badges, background, color, cmds, coins, time, brightness) VALUES ('${message.author.id}', 'Not Set', 'No bio yet', 'null,null', 'FCBA03', 'null', '0', '0', 'Not Set', 'default')`);
            const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.good}`)
                .setTitle('Profile created')
            return message.channel.send({ embeds: [embed] });
        }

        try {
            profileGenerator(dbResult);
        } catch (err) {
            console.log(err);
        }
        return;
    } else if (!existingCommands.includes(args[0].toLowerCase())) {
        //convert search to ID
        var res = args[0].replace('<@', '').replace('>', '').replace('!', '');

        var row = await sql.query(`SELECT * FROM profile WHERE userid ='${res}'`);
        row = row.rows[0];

        if (!row) {
            const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.bad}`)
                .setTitle('No profile found')
            return message.channel.send({ embeds: [embed] });
        }

        try {
            profileGenerator(row);
        } catch (err) {
            console.log(err);
        }
        return;
    }

    //sub-commands
    var bio;
    var dbResult = await sql.query(`SELECT * FROM profile WHERE userid ='${message.author.id}'`);

    switch (args[0].toLowerCase()) {
        case 'bio':
            try {
                bio = args.slice(1).join(' ');

                if (bio.length < 1) {
                    const embed = new Discord.MessageEmbed()
                        .setColor(`0x${client.colors.bad}`)
                        .setTitle('I need more information than that')
                    return message.channel.send({ embeds: [embed] });
                } else if (bio.length > 231) {
                    const embed = new Discord.MessageEmbed()
                        .setColor(`0x${client.colors.bad}`)
                        .setTitle('Use 230 characters or less (' + bio.length + ' characters)')
                    return message.channel.send({ embeds: [embed] });
                }
                sql.query(`UPDATE profile SET bio = '${bio}' WHERE userid = '${message.author.id}'`);
                const embed = new Discord.MessageEmbed()
                    .setColor(`0x${client.colors.good}`)
                    .setTitle('Bio updated')
                message.channel.send({ embeds: [embed] });
            } catch (err) {
                const embed = new Discord.MessageEmbed()
                    .setColor(`0x${client.colors.bad}`)
                    .setTitle('An error occured, please try again')
                message.channel.send({ embeds: [embed] });
            }
            break;



        case 'timezone':
            try {
                if (client.timezones[args[1].toUpperCase()]) {
                    sql.query(`UPDATE profile SET time = '${args[1].toUpperCase()}' WHERE userid = '${message.author.id}'`);
                    const embed = new Discord.MessageEmbed()
                        .setColor(`0x${client.colors.good}`)
                        .setTitle('Timezone Updated')
                    message.channel.send({ embeds: [embed] });
                } else {
                    const embed = new Discord.MessageEmbed()
                        .setColor(`0x${client.colors.bad}`)
                        .setTitle('Please use a valid abbreviation (ie. PST or ET)')
                    message.channel.send({ embeds: [embed] });
                }
            } catch (err) {
                const embed = new Discord.MessageEmbed()
                    .setColor(`0x${client.colors.bad}`)
                    .setTitle('An error occured, please try again')
                message.channel.send({ embeds: [embed] });
            }
            break;



        case 'subtitle':
            try {
                //set bio paragraph here
                bio = args.slice(1).join(' ');

                if (bio.length < 1) {
                    const embed = new Discord.MessageEmbed()
                        .setColor(`0x${client.colors.bad}`)
                        .setTitle('I need more information than that')
                    return message.channel.send({ embeds: [embed] });
                } else if (bio.length > 14) {
                    const embed = new Discord.MessageEmbed()
                        .setColor(`0x${client.colors.bad}`)
                        .setTitle('Use 13 characters or less')
                    return message.channel.send({ embeds: [embed] });
                }
                sql.query(`UPDATE profile SET subtitle = '${bio}' WHERE userid = '${message.author.id}'`);
                const embed = new Discord.MessageEmbed()
                    .setColor(`0x${client.colors.good}`)
                    .setTitle('Subtitle updated')
                message.channel.send({ embeds: [embed] });
            } catch (err) {
                const embed = new Discord.MessageEmbed()
                    .setColor(`0x${client.colors.bad}`)
                    .setTitle('An error occured, please try again')
                message.channel.send({ embeds: [embed] });
            }
            break;



        case 'mode':
            if(!args[1]){
                const embed = new Discord.MessageEmbed()
                    .setColor(`0x${client.colors.bad}`)
                    .setTitle("Use 'dark' or 'light'")
                return message.channel.send({ embeds: [embed] });
            } else {
                option = args[1].toLowerCase();
                if(option === 'dark'){
                    sql.query(`UPDATE profile SET brightness = 'dark' WHERE userid = '${message.author.id}'`);
                    const embed = new Discord.MessageEmbed()
                        .setColor(`0x${client.colors.good}`)
                        .setTitle("Set profile to dark mode")
                    return message.channel.send({ embeds: [embed] });
                } else if (option === 'light'){
                    sql.query(`UPDATE profile SET brightness = 'light' WHERE userid = '${message.author.id}'`);
                    const embed = new Discord.MessageEmbed()
                        .setColor(`0x${client.colors.good}`)
                        .setTitle("Set profile to light mode")
                    return message.channel.send({ embeds: [embed] });
                } else {
                    const embed = new Discord.MessageEmbed()
                        .setColor(`0x${client.colors.bad}`)
                        .setTitle("Use 'dark' or 'light'")
                    return message.channel.send({ embeds: [embed] });
                }
            }
            break;



        case 'badge':
            var dbResult = await sql.query(`SELECT * FROM profile WHERE userid ='${message.author.id}'`);
            dbResult = dbResult.rows[0];

            var choices = ['set', 'list', 'delete'];
            if (!args[1]) {
                const embed = new Discord.MessageEmbed()
                    .setColor(`0x${client.colors.bad}`)
                    .setTitle('I need more information')
                return message.channel.send({ embeds: [embed] });
            }
            if (!choices.includes(args[1].toLowerCase())) {
                const embed = new Discord.MessageEmbed()
                    .setColor(`0x${client.colors.bad}`)
                    .setTitle('Please refer to k?help profile')
                return message.channel.send({ embeds: [embed] });
            }

            if (args[1].toLowerCase() === 'list') {
                var badgeUrls = client.guilds.cache.get('913526839702589452').emojis.cache.map(e => `${e.name} - <:badge:${e.id}>`);
                var middleIndex = Math.ceil(badgeUrls.length / 2);

                var firstHalf = badgeUrls.splice(0, middleIndex);   
                var secondHalf = badgeUrls.splice(-middleIndex);
                
                try {
                    const embed = new Discord.MessageEmbed()
                        .addField('Badges 1', firstHalf.join('\n'), true)
                        .addField('Badges 2', secondHalf.join('\n'), true)
                    return message.channel.send({ embeds: [embed] });
                } catch (err) {
                    const embed = new Discord.MessageEmbed()
                        .setColor(`0x${client.colors.bad}`)
                        .setTitle(`err: \`${err}\``)
                    return message.channel.send({ embeds: [embed] });
                }
            } else if (args[1].toLowerCase() === 'delete') {
                if (!dbResult) {
                    const embed = new Discord.MessageEmbed()
                        .setColor(`0x${client.colors.bad}`)
                        .setTitle('Please create a profile first')
                    return message.channel.send({ embeds: [embed] });
                }

                if (args[2].toLowerCase() === '1') {
                    var res = dbResult.badges.split(',');
                    res[0] = 'null';
                    sql.query(`UPDATE profile SET badges = '${res.join(',')}' WHERE userid = '${message.author.id}'`);

                    const embed = new Discord.MessageEmbed()
                        .setColor(`0x${client.colors.neutral}`)
                        .setTitle('Badge removed')
                    return message.channel.send({ embeds: [embed] });
                } else if (args[2].toLowerCase() === '2') {
                    var res = dbResult.badges.split(',');
                    res[1] = 'null';
                    sql.query(`UPDATE profile SET badges = '${res.join(',')}' WHERE userid = '${message.author.id}'`);

                    const embed = new Discord.MessageEmbed()
                        .setColor(`0x${client.colors.neutral}`)
                        .setTitle('Badge removed')
                    return message.channel.send({ embeds: [embed] });
                } else {
                    const embed = new Discord.MessageEmbed()
                        .setColor(`0x${client.colors.bad}`)
                        .setTitle('Please refer to k?help profile')
                    return message.channel.send({ embeds: [embed] });
                }
            } else if (args[1].toLowerCase() === 'set') {
                var firstOptions = ['1', '2'];
                var secondOptions = [];

                var emojis = client.guilds.cache.get('913526839702589452').emojis.cache.map(e => e).map(e => e.name);
                emojis.forEach(e => secondOptions.push(e.toLowerCase()))
                var badgeUrls = [];

                if (!args[2] || !args[3]) {
                    const embed = new Discord.MessageEmbed()
                        .setColor(`0x${client.colors.bad}`)
                        .setTitle('Please refer to k?help profile')
                    return message.channel.send({ embeds: [embed] });
                }
                if (!firstOptions.includes(args[2]) || !secondOptions.includes(args[3].toLowerCase())) {
                    const embed = new Discord.MessageEmbed()
                        .setColor(`0x${client.colors.bad}`)
                        .setTitle('Please refer to k?help profile')
                    return message.channel.send({ embeds: [embed] });
                }

                if (args[2].toLowerCase() === '1') {
                    var res = dbResult.badges.split(',');
                    res[0] = args[3].toLowerCase();
                    sql.query(`UPDATE profile SET badges = '${res.join(',')}' WHERE userid = '${message.author.id}'`);

                    const embed = new Discord.MessageEmbed()
                        .setColor(`0x${client.colors.neutral}`)
                        .setTitle('Badge updated')
                    return message.channel.send({ embeds: [embed] });
                } else if (args[2].toLowerCase() === '2') {
                    var res = dbResult.badges.split(',');
                    res[1] = args[3].toLowerCase();
                    sql.query(`UPDATE profile SET badges = '${res.join(',')}' WHERE userid = '${message.author.id}'`);

                    const embed = new Discord.MessageEmbed()
                        .setColor(`0x${client.colors.neutral}`)
                        .setTitle('Badge updated')
                    return message.channel.send({ embeds: [embed] });
                }
            }
            break;



        case 'color':
            var hex = /^#?[0-9A-F]{6}$/i;

            if (!args[1]) {
                const embed = new Discord.MessageEmbed()
                    .setColor(`0x${client.colors.bad}`)
                    .setTitle('Please enter a valid hex code')
                return message.channel.send({ embeds: [embed] });
            }

            var color = args[1].replace('#', '');

            if (hex.test(color)) {
                sql.query(`UPDATE profile SET background = '${color}' WHERE userid = '${message.author.id}'`);

                const embed = new Discord.MessageEmbed()
                    .setColor(`0x${color}`)
                    .setTitle('Profile color changed')
                return message.channel.send({ embeds: [embed] });
            } else {
                const embed = new Discord.MessageEmbed()
                    .setColor(`0x${client.colors.bad}`)
                    .setTitle('Please enter a valid hex code')
                return message.channel.send({ embeds: [embed] });
            }
        default:
        //wrong argument error
    }
}

exports.conf = {
    name: "[BETA] Profile",
    help: "Create, edit or view someone else's profile",
    format: `k?profile {@user/ID}
k?profile bio [bio text]
k?profile subtitle [subtitle text]
k?profile timezone [ie. PST]
k?profile badge set [1/2] [name from list]
k?profile badge list
k?profile color #hexcode`,
    DM: true,
    ownerOnly: false,
    alias: [],
    slashCommand: false
}
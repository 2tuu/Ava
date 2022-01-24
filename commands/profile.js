const Discord = require(`discord.js`);
const Canvas = require("canvas");
const neko = require('nekocurl');
const fs = require("fs");

exports.run = async (client, message, args, deletedMessage, sql) => {
    var staff = ['378769654942007299'];

    async function profileGenerator(row){
        try{
            //check for profile before even generating the image
            let canvas = Canvas.createCanvas(1000, 750);
            let Image = Canvas.Image;
            let ctx = canvas.getContext('2d');
            let img = new Image();

            //bg color
            ctx.fillStyle = '#'+ row.background;
            ctx.fillRect(0, 0, 1000, 750);

            //avatar
            var user = client.users.resolve(row.userid)
            var avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpg`;
            img.src = await neko.get(avatarUrl, { autoString: false });
            ctx.drawImage(img, 75, 75, 310, 310);

            //badge back part
            img.src = fs.readFileSync(`./images/badge-back.png`);
            ctx.drawImage(img, 0, 0);

            //staff marker
                if(staff.includes(user.id)){
                img.src = fs.readFileSync(`./images/staff.jpg`);
                ctx.drawImage(img, 828, 77);
            }

            //profile card
            img.src = fs.readFileSync(`./images/card.png`);
            ctx.drawImage(img, 0, 0);

            //badges
            var emojis = client.emojis.cache.map(e=>e).filter(e=>e.guild.id==='913526839702589452');
            var badges = row.badges.split(',');

            var badgeUrls = [];

            emojis.forEach(e=>{
                badgeUrls.push({
                    id: `https://cdn.discordapp.com/emojis/${e.id}.png?size=160`,
                    name: e.name.toLowerCase()
                });
            })

            var url;
            if(badges[0] !== 'null'){
                url = badgeUrls.filter(e=>e.name===badges[0]);
                if(url[0]){
                    url = url[0].id;
                } else {
                    url = 'https://cdn.discordapp.com/emojis/913581298222788668.png?size=128'
                }

                img.src = await neko.get(url, { autoString: false });
                ctx.drawImage(img, 369, 313, 87, 87);
            }
            if(badges[1] !== 'null'){
                url = badgeUrls.filter(e=>e.name===badges[1]);
                if(url[0]){
                    url = url[0].id;
                } else {
                    url = 'https://cdn.discordapp.com/emojis/913581298222788668.png?size=128'
                }

                img.src = await neko.get(url, { autoString: false });
                ctx.drawImage(img, 369, 62, 87, 87);
            }

            //badge back part
            img.src = fs.readFileSync(`./images/card-badge-face.png`);
            ctx.drawImage(img, 0, 0);


            ctx.font = `bold 53px Ubuntu`;
            //username
            ctx.fillStyle = '#494949';
            ctx.textAlign="start"; 
            ctx.fillText(user.username, 511,146);

            //subtitle
            ctx.fillStyle = '#494949';
            ctx.textAlign="start"; 
            ctx.fillText(row.subtitle, 511,250);

            //coins
            ctx.fillStyle = '#494949';
            ctx.textAlign="start"; 

            var coins = row.coins;
                coins = parseInt(coins)*0.25;
                coins = coins.toString().split('.');
            
            if(!coins[1]){
                coins[1]='00';
            } else if(coins[1].length<2){
                coins[1]=coins[1]+'0';
            }

            if(coins[0].length === 0){
                coins[0]='0';
            }

            coins = '$'+coins.join('.');

            ctx.fillText(coins, 585,367);

            //level
            var lvl = (Math.round(parseInt(row.cmds)/1000))+1;
            if(lvl > 99){
                lvl = 99;
            }
            ctx.font = `bold 48px Ubuntu`;
            ctx.fillStyle = '#494949';
            ctx.textAlign="center"; 
            ctx.fillText(lvl, 440,255);

            //bio
            var combinedBio = []
            var bio = row.bio.split(' ');
            var temp = '';

            var iter = 0;

            while(iter <= bio.length){
                if((temp + ' ' + bio[iter]).length > 48){
                    combinedBio.push(temp);
                    temp = bio[iter];
                } else {
                    if(bio[iter]){
                        temp = temp + ' ' + bio[iter];
                    }
                }
                if(iter === bio.length){
                    combinedBio.push(temp);
                }
                iter = iter+1;
            }


            if(!combinedBio.includes(temp)){
                combinedBio.push(bio[bio.length]);
            }

            ctx.font = `35px Ubuntu`;
            ctx.fillStyle = '#494949';
            ctx.textAlign="start"; 
            ctx.fillText(combinedBio.join('\n'), 90,465);

            //birthday
            if(row.dob === "Not Set"){
                ctx.font = `bold 30px Ubuntu`;
                ctx.fillStyle = '#494949';
                ctx.textAlign="center"; 
                ctx.fillText('Not Set', 798,670);
            } else {
                var bd = new Date(parseInt(row.dob));
                var day = bd.getDate();
                var mon = bd.getMonth();

                var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                mon = months[mon];
                bd = mon + ' ' + day;

                ctx.font = `bold 30px Ubuntu`;
                ctx.fillStyle = '#494949';
                ctx.textAlign="center"; 
                ctx.fillText(bd, 798,670);
            }

            //print profile card
            message.channel.send(`Profile for **${user.tag}**`, {
                files: [{
                    attachment: canvas.toBuffer(),
                    name: 'profile.jpg'
                }]
            });
        } catch(err){
            const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.bad}`)
                .setDescription('ERR:\n```js\n' + err.stack + '\n```')
            return message.channel.send({embed});
        }

    }

    var existingCommands = ['bio','birthday','subtitle','badge','color'];

    if(!args[0]){
        //show author's profile here
        var dbResult = await sql.query(`SELECT * FROM profile WHERE userid ='${message.author.id}'`);
        dbResult = dbResult.rows[0];

        if(!dbResult){
            //create profile
            sql.query(`INSERT INTO profile (userid, dob, subtitle, bio, badges, background, color, cmds, coins) VALUES ('${message.author.id}', 'Not Set', 'Not Set', 'No bio yet', 'null,null', 'FCBA03', 'null', '0', '0')`);
            const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.good}`)
                .setDescription('Profile created')
            return message.channel.send({embed});
        }

        try{
            profileGenerator(dbResult);
        } catch (err){
            console.log(err);
        }
        /* debug block
        const embed = new Discord.MessageEmbed()
            .setColor(dbResult.background)
            .setDescription(`ID: ${dbResult.userid}\nDOB: ${dbResult.dob}\nSubtitle: ${dbResult.subtitle}\nBio: ${dbResult.bio}\nBadges: ${dbResult.badges}\nColor: ${dbResult.background}`)
        return message.channel.send({embed});
        */
       return;
    } else if(!existingCommands.includes(args[0].toLowerCase())){
        //convert search to ID
        var res = args[0].replace('<@','').replace('>','').replace('!','');

        var row = await sql.query(`SELECT * FROM profile WHERE userid ='${res}'`);
        row = row.rows[0];

        if(!row){
            const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.bad}`)
                .setDescription('No profile found')
            return message.channel.send({embed});
        }

        try{
            profileGenerator(row);
        } catch (err){
            console.log(err);
        }
        return;
    }

    //sub-commands
    var bio;
    var dbResult = await sql.query(`SELECT * FROM profile WHERE userid ='${message.author.id}'`);

    switch (args[0].toLowerCase()) {
        case 'bio':
        try{
            bio = args.slice(1).join(' ');

            if(bio.length < 1){
                const embed = new Discord.MessageEmbed()
                    .setColor(`0x${client.colors.bad}`)
                    .setDescription('I need more information than that')
                return message.channel.send({embed});
            } else if(bio.length > 231){
                const embed = new Discord.MessageEmbed()
                    .setColor(`0x${client.colors.bad}`)
                    .setDescription('Use 230 characters or less (' + bio.length + ' characters)')
                return message.channel.send({embed});
            }
            sql.query(`UPDATE profile SET bio = '${bio}' WHERE userid = '${message.author.id}'`);
            const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.good}`)
                .setDescription('Bio updated')
            message.channel.send({embed});
        } catch(err){ 
            const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.bad}`)
                .setDescription('An error occured, please try again')
            message.channel.send({embed});
         }
        break;



        case 'birthday':
        var dbResult = await sql.query(`SELECT * FROM profile WHERE userid ='${message.author.id}'`);
        dbResult = dbResult.rows[0];
        if(!args[1]){
            const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.bad}`)
                .setDescription('Please try again with a valid format (try mm-dd-yyyy)')
            return message.channel.send({embed});
        }

        if(dbResult.dob !== 'Not Set'){
            const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.bad}`)
                .setDescription('Your birthdate has already been set')
            return message.channel.send({embed});
        }

        var bd = args.slice(1).join(' ');
        bd = Date.parse(bd);

        if(isNaN(bd)){
            const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.bad}`)
                .setDescription('Please try again with a valid format (try mm-dd-yyyy)')
            return message.channel.send({embed});
        }

        var formattedDate = new Date(bd).toString().split('GMT')[0];
        var maxYear = parseInt(new Date().getFullYear()) - 70;
        var minYear = parseInt(new Date().getFullYear()) - 12;
        var setYear = parseInt(new Date(bd).getFullYear());

        if(setYear > maxYear && setYear < minYear){
            //ignore
        } else {
            const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.bad}`)
                .setDescription('Please enter a valid date')
            return message.channel.send({embed});
        }

        try{
            let filter = m => m.author.id === message.author.id;

            const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.neutral}`)
                .setDescription(`Are you sure you want to set your birthday to:\n\`\`\`${formattedDate}\`\`\`\n**This cannot be edited**\n(yes/no)`)
            message.channel.send({embed}).then(() => {
                message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 15000,
                    errors: ['time']
                })
                .then(message => {
                    message = message.first()
                    if (message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y') {
                        //edit birthday
                        sql.query(`UPDATE profile SET dob = '${bd}' WHERE userid = '${message.author.id}'`);

                        const embed = new Discord.MessageEmbed()
                            .setColor(`0x${client.colors.good}`)
                            .setDescription('Your birthday has been set to ' + new Date(bd).toLocaleDateString('en-us'))
                        message.channel.send({embed});
                    } else if (message.content.toUpperCase() == 'NO' || message.content.toUpperCase() == 'N') {
                        //cancel
                        const embed = new Discord.MessageEmbed()
                            .setColor(`0x${client.colors.bad}`)
                            .setDescription('Canceled')
                        message.channel.send({embed});
                    } else {
                        const embed = new Discord.MessageEmbed()
                            .setColor(`0x${client.colors.bad}`)
                            .setDescription('Canceled, invalid respose')
                        message.channel.send({embed});
                    }
                })
                .catch(err => {
                    const embed = new Discord.MessageEmbed()
                        .setColor(`0x${client.colors.bad}`)
                        .setDescription('Canceled, no respose')
                    message.channel.send({embed});
                });
            })
        } catch(err){
            const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.bad}`)
                .setDescription('An error occured, please try again')
            message.channel.send({embed});
        }
        break;



        case 'subtitle':
        try{
            //set bio paragraph here
            bio = args.slice(1).join(' ');

            if(bio.length < 1){
                const embed = new Discord.MessageEmbed()
                    .setColor(`0x${client.colors.bad}`)
                    .setDescription('I need more information than that')
                return message.channel.send({embed});
            } else if(bio.length > 14){
                const embed = new Discord.MessageEmbed()
                    .setColor(`0x${client.colors.bad}`)
                    .setDescription('Use 13 characters or less')
                return message.channel.send({embed});
            }
            sql.query(`UPDATE profile SET subtitle = '${bio}' WHERE userid = '${message.author.id}'`);
            const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.good}`)
                .setDescription('Subtitle updated')
            message.channel.send({embed});
        } catch(err){
            const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.bad}`)
                .setDescription('An error occured, please try again')
            message.channel.send({embed});
        }
        break;



        case 'badge':
        var dbResult = await sql.query(`SELECT * FROM profile WHERE userid ='${message.author.id}'`);
        dbResult = dbResult.rows[0];

        var choices = ['set','list','delete'];
        if(!args[1]){
            const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.bad}`)
                .setDescription('I need more information')
            return message.channel.send({embed});
        }
        if(!choices.includes(args[1].toLowerCase())){
            const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.bad}`)
                .setDescription('Please refer to k?help profile')
            return message.channel.send({embed});
        }

        if(args[1].toLowerCase() === 'list'){
            var emojis = client.emojis.cache.map(e=>e).filter(e=>e.guild.id==='913526839702589452');
            var badgeUrls = [];

            emojis.forEach(e=>{
                badgeUrls.push(`${e.id}`);
            })

            const embed = new Discord.MessageEmbed()
                .setDescription(`<:badge:${badgeUrls.join('> <:badge:')}>`)
            return message.channel.send({embed});
        } else if(args[1].toLowerCase() === 'delete'){
            if(!dbResult){
                const embed = new Discord.MessageEmbed()
                    .setColor(`0x${client.colors.bad}`)
                    .setDescription('Please create a profile first')
                return message.channel.send({embed});
            }

            if(args[2].toLowerCase() === '1'){
                var res = dbResult.badges.split(',');
                res[0] = 'null';
                sql.query(`UPDATE profile SET badges = '${res.join(',')}' WHERE userid = '${message.author.id}'`);

                const embed = new Discord.MessageEmbed()
                    .setColor(`0x${client.colors.neutral}`)
                    .setDescription('Badge removed')
                return message.channel.send({embed});
            } else if(args[2].toLowerCase() === '2'){
                var res = dbResult.badges.split(',');
                res[1] = 'null';
                sql.query(`UPDATE profile SET badges = '${res.join(',')}' WHERE userid = '${message.author.id}'`);

                const embed = new Discord.MessageEmbed()
                    .setColor(`0x${client.colors.neutral}`)
                    .setDescription('Badge removed')
                return message.channel.send({embed});
            } else {
                const embed = new Discord.MessageEmbed()
                    .setColor(`0x${client.colors.bad}`)
                    .setDescription('Please refer to k?help profile')
                return message.channel.send({embed});
            }
        } else if(args[1].toLowerCase() === 'set'){
            var firstOptions = ['1','2'];
            var secondOptions = [];

            var emojis = client.emojis.cache.map(e=>e).filter(e=>e.guild.id==='913526839702589452');
            emojis.forEach(e=>secondOptions.push(e.name.toLowerCase()))
            var badgeUrls = [];

            if(!args[2] || !args[3]){
                const embed = new Discord.MessageEmbed()
                    .setColor(`0x${client.colors.bad}`)
                    .setDescription('Please refer to k?help profile')
                return message.channel.send({embed});
            }
            if(!firstOptions.includes(args[2]) || !secondOptions.includes(args[3].toLowerCase())){
                const embed = new Discord.MessageEmbed()
                    .setColor(`0x${client.colors.bad}`)
                    .setDescription('Please refer to k?help profile')
                return message.channel.send({embed});
            }

            if(args[2].toLowerCase() === '1'){
                var res = dbResult.badges.split(',');
                res[0] = args[3].toLowerCase();
                sql.query(`UPDATE profile SET badges = '${res.join(',')}' WHERE userid = '${message.author.id}'`);

                const embed = new Discord.MessageEmbed()
                    .setColor(`0x${client.colors.neutral}`)
                    .setDescription('Badge updated')
                return message.channel.send({embed});
            } else if(args[2].toLowerCase() === '2'){
                var res = dbResult.badges.split(',');
                res[1] = args[3].toLowerCase();
                sql.query(`UPDATE profile SET badges = '${res.join(',')}' WHERE userid = '${message.author.id}'`);

                const embed = new Discord.MessageEmbed()
                    .setColor(`0x${client.colors.neutral}`)
                    .setDescription('Badge updated')
                return message.channel.send({embed});
            }
        }
        break;



        case 'color':
        var hex = /^#?[0-9A-F]{6}$/i;

        if(!args[1]){
            const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.bad}`)
                .setDescription('Please enter a valid hex code')
            return message.channel.send({embed});
        }

        var color = args[1].replace('#','');

        if(hex.test(color)){
            sql.query(`UPDATE profile SET background = '${color}' WHERE userid = '${message.author.id}'`);

            const embed = new Discord.MessageEmbed()
                .setColor(`0x${color}`)
                .setDescription('Profile color changed')
            return message.channel.send({embed});
        } else {
            const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.bad}`)
                .setDescription('Please enter a valid hex code')
            return message.channel.send({embed});
        }
        break;
        default:
        //wrong argument error
    }
}

exports.conf = {
    category: "Fun",
    name: "[BETA] Profile",
    help: "Create, edit or view someone else's profile",
    format: "k?profile {@user/ID}\nk?profile bio [bio text]\nk?profile subtitle [subtitle text]\nk?profile birthday [ie. m-d-yyyy]\nk?profile badge set [1/2] [name from list]\nk?profile badge list",
    DM: true,
    OwnerOnly: false,
    /*
        Birthday setting has not been reworked, as full DOB is not
        defined as personally identifying information, and is
        necessary for calculating the date

        But as NSFW commands are only available in NSFW channels,
        birthdays set in profile command will not be used to age
        gate the commands, as the Discord client already does

        It will remain purely cosmetic, maybe at some point being
        used to send people birthday messages automatically
    */
    alias: []
}
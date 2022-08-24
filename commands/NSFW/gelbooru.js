const Discord = require("discord.js");
var axios = require("axios");
const cooldown = new Set();
const config = require("./../../config.json");

const booru = require('booru');

const taglimit = 10;

exports.run = (client, message, args) => {

    try {

        if (message.channel.nsfw === false) {
            if (client.isInteraction) {
                message.reply('NSFW channels only.')
            }
            return;
        } else {

            if (args.length > taglimit) {
                const embed = new Discord.MessageEmbed()
                    .setTitle("This site has a limit of " + taglimit + " tags.")
                return message.channel.send({ embeds: [embed] });
            }

            async function grab(tags) {

                var result = await booru.search('gelbooru', tags, { limit: 10, random: true })
                //found commonly disturbing, morally aprehensible, against discord's content rules, or all three!
                var blacklist = [
                    "scat",
                    "watersports",
                    "gore",
                    "flash",
                    "video",
                    "loli",
                    "shota"
                ];

                result.posts = result.posts.filter(r => !r.tags.some(e => blacklist.indexOf(e) >= 0)); //Tag blacklist handler

                if (result.posts[0]) {
                    var url = result.posts[0].fileUrl;
                    var source = result.posts[0].source;

                    if (!source) {
                        source = 'No Source Supplied • ' + ' [Post](' + result.posts[0].postView + ')';
                    } else {
                        source = '[Source](' + source.join(') [Source](') + ') • [Post](' + result.posts[0].postView + ')';
                    }

                    const embed = new Discord.MessageEmbed()
                        .setImage(url)
                        .setDescription(`${source}`)
                    message.channel.send({ embeds: [embed] });

                    //console.log(result.posts[0]);
                } else {
                    message.channel.send('No results.');
                }
            }

            var tags = [];

            if (args[0]) {
                tags = args;
            }

            grab(tags);

        }

    } catch (err) {
        console.error(err);
    }

}

exports.conf = {
    name: "gelbooru",
    help: "Search Gelbooru",
    format: "k?gelbooru [terms]",
    DM: false,
    ownerOnly: false,
    alias: [],
    slashCommand: false
}
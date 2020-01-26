const Discord = require('discord.js');
const axios = require('axios');

exports.get = async (args, blacklist) => {

    var request = await axios.get(`https://e621.net/post/index.json?tags=-${blacklist.join(',')},${args.join(",")}`);

    try{
			var result = request.data[Math.floor(Math.random() * request.data.length)];
            
            return {
                success: true,
                artist: result.artist.join(', '),
                image: result.file_url
            };

    }
    catch(err){
        return `error`;
    }    
            
}
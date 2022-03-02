const Discord = require(`discord.js`);
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"], partials: ["CHANNEL"] });

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');
async function run(){
    var data = await new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with pong')
    .addStringOption(option =>
        option.setName('category')
            .setDescription('The gif category')
            .setRequired(true)
            .addChoice('Funny', 'gif_funny')
            .addChoice('Meme', 'gif_meme')
            .addChoice('Movie', 'gif_movie'));

    var final = data.toJSON().options[0].choices;

    console.log(final)
}

run()



/*

{
    name: 'ping',
    description: 'Replies with pong',
    options: [
        {
            choices: [
                { name: 'Funny', value: 'gif_funny' },
                { name: 'Meme', value: 'gif_meme' },
                { name: 'Movie', value: 'gif_movie' }
            ],
            autocomplete: undefined,
            type: 3,
            name: 'category',
            description: 'The gif category',
            required: true
        }
    ],
    default_permission: undefined
}

*/

        /*
        .addStringOption(option =>
		option.setName('category')
			.setDescription('The gif category')
			.setRequired(true)
			.addChoice('Funny', 'gif_funny')
			.addChoice('Meme', 'gif_meme')
			.addChoice('Movie', 'gif_movie'));


        .addStringOption(option =>
		option.setName('input')
			.setDescription('The input to echo back')
			.setRequired(true));
            */
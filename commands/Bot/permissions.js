const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    var perms = await message.guild.members.fetch(client.user.id);
    perms = perms.permissions;

    //some aren't used right now, but will be in the future
    var need = [
        'KICK_MEMBERS',
        'BAN_MEMBERS',
        'ADD_REACTIONS',
        'VIEW_AUDIT_LOG',
        'VIEW_CHANNEL',
        'SEND_MESSAGES',
        'MANAGE_MESSAGES',
        'EMBED_LINKS',
        'ATTACH_FILES',
        'READ_MESSAGE_HISTORY',
        'USE_EXTERNAL_EMOJIS',
        'MANAGE_NICKNAMES',
        'MANAGE_ROLES',
        'USE_APPLICATION_COMMANDS',
        'USE_EXTERNAL_STICKERS',
        'SEND_MESSAGES_IN_THREADS',
        'MODERATE_MEMBERS'
    ];

    //don't need these
    var dontNeed = [
        'CREATE_INSTANT_INVITE',
        'MANAGE_CHANNELS',
        'MANAGE_GUILD',
        'PRIORITY_SPEAKER',
        'STREAM',
        'SEND_TTS_MESSAGES',
        'VIEW_GUILD_INSIGHTS',
        'CONNECT',
        'SPEAK',
        'MUTE_MEMBERS',
        'DEAFEN_MEMBERS',
        'MOVE_MEMBERS',
        'USE_VAD',
        'CHANGE_NICKNAME',
        'MANAGE_WEBHOOKS',
        'MANAGE_EMOJIS_AND_STICKERS',
        'REQUEST_TO_SPEAK',
        'MANAGE_EVENTS',
        'MANAGE_THREADS',
        'CREATE_PUBLIC_THREADS',
        'CREATE_PRIVATE_THREADS'
    ];

    //will never need these, can and will cause problems
    var neverNeed = [
        'ADMINISTRATOR',
        'MENTION_EVERYONE'
    ]

    var needsGive = [];
    var needsRemove = [];
    var removeNow = [];

    need.forEach(perm => {
        if (!perms.has(perm)) {
            needsGive.push(perm);
        }
    })

    dontNeed.forEach(perm => {
        if (perms.has(perm)) {
            needsRemove.push(perm);
        }
    })

    neverNeed.forEach(perm => {
        if (perms.has(perm)) {
            removeNow.push(perm);
        }
    })

    if (!needsGive[0] && !needsRemove[0] && !removeNow[0]) {
        const embed = new Discord.MessageEmbed()
            .setColor(`0x${client.colors.good}`)
            .setTitle("My permissions are correct")
        client.messageHandler(message, client.isInteraction, { embeds: [embed] })
    } else {
        if(needsGive.length === 0){ needsGive[0] = 'none' }
        if(needsRemove.length === 0){ needsRemove[0] = 'none' }
        if(removeNow.length === 0){ removeNow[0] = 'none' }

        const embed = new Discord.MessageEmbed()
            .setColor(`0x${client.colors.bad}`)
            .setTitle("My permissions are incorrect")
            .addField('Need', needsGive.join('\n'))
            .addField('Don\'t Need', needsRemove.join('\n'))
            .addField('Remove Immediately', removeNow.join('\n'))

        try {
            client.messageHandler(message, client.isInteraction, { embeds: [embed] })
        } catch (err) {
            message.channel.send('An error occured, make sure I have permission to send embedded messages:\n```\n' + err + '\n```')
        }
    }

}

exports.conf = {
    name: "Permissions",
    help: "Check if my permissions are correct",
    format: "k?permissions",
    DM: false,
    ownerOnly: false,
    alias: ['perms'],
    slashCommand: false
}
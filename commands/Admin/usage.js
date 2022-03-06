var os = require('os');
var cpuStat = require('cpu-stat');
const Discord = require(`discord.js`);

exports.run = async (client, message) => {
    var totalSeconds = await process.uptime();
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let uptimeVar = `${hours} Hours, and ${minutes} Minutes`;

    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    const total = process.memoryUsage().heapTotal / 1024 / 1024;

    var memPercent = (os.totalmem - os.freemem)/os.totalmem;
        memPercent = memPercent*100;
    var lumpPercent = used/total;
        lumpPercent = lumpPercent*100;

    if (memPercent < 1) {
        memPercent = '<1';
    } else {
        memPercent = Math.round(memPercent);
    }

    if (lumpPercent < 1) {
        lumpPercent = '<1';
    } else {
        lumpPercent = Math.round(lumpPercent);
    }

    async function usageMeter() {
        var m = await client.messageHandler(message, client.isInteraction, 'Loading metrics...');
        cpuStat.usagePercent(function (err, percent, seconds) {
            const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.bad}`)
                .setDescription('```diff\n' +
                    `CPU(s): x${os.cpus().length}\n` +
                    `OS: ${os.platform()} ${os.release()}\n\n` +

                    `Node: ${process.version}\n` +
                    `App: v${client.version}\n\n` +

                    `CPU USAGE: ${Math.round(percent)}%\n` +
                    `+Load: ${os.loadavg()}\n\n` +

                    `MEM (G): ${Math.round((os.totalmem - os.freemem) / 1000000000)}gb/ ${Math.round(os.totalmem / 1000000000)}gb (${memPercent}%)\n` +
                    `MEM (P): ${(Math.round(used * 100) / 100)}/${(Math.round(total * 100) / 100)}mb (${lumpPercent}%)\n\n` +

                    `-Reaction times:\n` +
                    `Bot: ${m.createdTimestamp - message.createdTimestamp}ms\n` +
                    `API: ${client.ws.ping}ms\n` +
                    `+Adjusted: ${(m.createdTimestamp - message.createdTimestamp) - client.ws.ping}ms\n\n` +

                    `PROCESS UPTIME: ${uptimeVar}\n` +
                    `+(~${Math.round(hours / 24)}d)\n\n` +

                    `-Completed in ${Math.round(seconds * 1000)}ms` +
                    '\n```')
            m.edit({content:'Statistics:', embeds: [embed] });
        });
    }
    usageMeter();
}

exports.conf = {
    name: 'N/A (dev command)',
    help: 'N/A',
    format: 'N/A',
    DM: true,
    ownerOnly: true,
    alias: []
}
const { jsonfy } = require("booru/dist/Utils");

exports.run = async (client, message, args, deletedMessage, sql) => {

    function msToTime(ms) {
        let minutes = (ms / (1000 * 60)).toFixed(1);
        let hours = (ms / (1000 * 60 * 60)).toFixed(1);
        let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
        if (minutes < 60) return minutes + "m";
        else if (hours < 24) return hours + "h";
        else return days + "d"
      }

    var user = message.author.id;
    var channel = message.channel.id;


    if(args.join(' ').match(/-t (.*)/g)){

        function getSeconds(str) {
            var days = str.match(/(\d+)\s*d/);
            var hours = str.match(/(\d+)\s*h/);
            var minutes = str.match(/(\d+)\s*m/);

            if(!hours) hours = ['0h'];
            if(!minutes) minutes = ['0m'];
            if(!days) days = ['0d'];

            return {
                m: minutes[0].replace('m',''),
                h: hours[0].replace('h',''),
                d: days[0].replace('d','')
            }
          }

        var num = args.join(' ').match(/-t (.*)/g)[0].replace('-t ', '');
        num = getSeconds(num.toString());
    } else {
        return message.channel.send("The time wasn't set correctly, please refer to `k?help remind` for proper format")
    }




        var minutes = num.m * 60000;
        var hours = num.h * 3600000;
        var days = num.d * 86400000;

        var time = minutes+hours+days;

        if(time < 59999 || time > 604800001){
            return message.channel.send("Please enter a time between 1 minute and 7 days");
        }

        var endtime = Date.now() + time;
        var timerMessage;

        timerMessage = args.join(' ').split('-t')[0];
        timerMessage = timerMessage.substring(0, timerMessage.length - 1);

        if(timerMessage.length > 1921){
            return message.channel.send("Please give me a message below 1,920 characters");
        }

        if(timerMessage.length < 1){
            timerMessage = '[No Label]';
            message.channel.send(`I will remind you <t:${Math.round(endtime/1000)}:R>`);
        } else {
            message.channel.send(`I will tell you: \`${timerMessage}\` <t:${Math.round(endtime/1000)}:R>`);
        }



        //sql
        var row = await sql.query(`SELECT * FROM timer WHERE "user" ='${user}'`);
            row = row.rows;

            if(row.length > 14){
                return message.channel.send('Sorry, you have too many reminders (Limit 15)');
            }

            sql.query(`INSERT INTO timer (endtime, "user", channelcreated, message) VALUES ('${endtime}', '${user}', '${channel}', '${timerMessage}')`);

}

exports.conf = {
    category: "Utility",
    name: "Remind",
    help: "Remind yourself of something in the future",
    format: "k?remind <message> -t #h #m",
    DM: true,
    OwnerOnly: true,
    alias: []
}
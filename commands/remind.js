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

    if(args[0] === "cancel" && !args[1]){
        var row = await sql.query(`SELECT * FROM timer WHERE "user" ='${message.author.id}'`);
            row = row.rows[0];
        if(!row){ //no timers exist
            return message.channel.send("You have no timers running");
        } else { //timer already exists (limit 1 per user)
            sql.query(`DELETE FROM timer WHERE "user" ='${message.author.id}'`);
            return message.channel.send("Your timer has been deleted");
        }
    } else if(args[0] === "check"){
        //sql
        var row = await sql.query(`SELECT * FROM timer WHERE "user" ='${user}'`);
        row = row.rows[0];
        if(!row){ //no timers exist
            return message.channel.send("You don't have any timers running");
        } else { //timer already exists (limit 1 per user)
            return message.channel.send(`You have a timer expiring <t:${Math.round(row.endtime/1000)}:R>`);
        }
    }


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

        message.channel.send(`I will tell you: \`${timerMessage}\` <t:${Math.round(endtime/1000)}:R>`);

        //sql
        var row = await sql.query(`SELECT * FROM timer WHERE "user" ='${user}'`);
            row = row.rows[0];
        if(!row){ //no timers exist
            sql.query(`INSERT INTO timer (endtime, "user", channelcreated, message) VALUES ('${endtime}', '${user}', '${channel}', '${timerMessage}')`);
        } else { //timer already exists (limit 1 per user)
            message.channel.send(`You already have a timer expiring <t:${Math.round(row.endtime/1000)}:R>`);
        }

}

exports.conf = {
    category: "Utility",
    name: "Remind",
    help: "Remind yourself of something in the future",
    format: "k?remind <message> -t #h #m\nk?remind cancel",
    DM: true,
    OwnerOnly: true,
    alias: []
}
    exports.run = async (client, message, args) => {

        if(isNaN(args[0])){
            return message.channel.send("Please enter a valid number of minutes");
        }

        //usage: k?remind [minutes] [hours] message

        if(isNaN(args[1])){

            var time = args[0] * 60000;

            console.log('1: ' + time);

            if(time/60000 == 1){
                var min = 'minute';
            } else {
                var min = 'minutes';
            }

            message.channel.send(`I will tell you: \`${args.slice(1).join(' ')}\` in ${time/60000} ${min}`)

            async function funct() {
                message.channel.send('<@' + message.author.id + `>, ${time/60000} ${min} ago, you told me to tell you: \`` + args.slice(1).join(' ') + '`')
            }
  
            setTimeout(funct,time);

        } else {
            

            var minutes = args[0] * 60000;
            var hours = args[1] * 3600000;

            var time = minutes+hours;

            console.log('2: ' + time);

            if(time/60000 == 1){
                var min = 'minute';
            } else if(time < 0 || time > 604800001){
                return message.channel.send("Please enter a time between 0 minutes and 7 days");
            } else {
                var min = 'minutes';
            }

            message.channel.send(`I will tell you: \`${args.slice(2).join(' ')}\` in ${time/60000} ${min}`)

            async function funct() {
                message.channel.send('<@' + message.author.id + `>, ${time/60000} ${min} ago, you told me to tell you: \`` + args.slice(2).join(' ') + '`')
            }
  
            setTimeout(funct,time);

        }

    }

    exports.conf = {
        help: "Remind yourself of something in the future",
        format: "k?remind [minutes] {optional: hours}",
        DM: true,
        OwnerOnly: true,
        alias: []
    }
exports.run = (client, message, args) => {
var v = args.join(' ');

let owoify = function (v) {
  
    //This command is the bane of my existence

    v = v.replace(/(?:r|l)/g, "w");
    v = v.replace(/(?:R|L)/g, "W");
    v = v.replace(/n([aeiou])/g, 'ny$1');
    v = v.replace(/N([aeiou])/g, 'Ny$1');
    v = v.replace(/N([AEIOU])/g, 'NY$1');
    v = v.replace(/ove/g, "uv");
    v = v.replace(/\?+/g, " owo;;?? ");

    var count = (v.match(/!/g) || []).length;
    let faces = [";;w;;","owo","uwu",">w<","=w="];
    var i;

    for(i = 0; i < count; i++){
        v = v.replace("!", " "+ faces[Math.floor(Math.random()*faces.length)]+ " ");
    }
  
    return v;
  
  }

  if(!args[0]){
      return message.channel.send("Whats this? (ERR: No arguments)")
  }

  message.channel.send(owoify(v));
}

exports.conf = {
    category: "Fun",
    name: "OWO/UWU",
    help: "What's this?",
    format: "k?owo [text]",
    DM: true,
    OwnerOnly: false,
    alias: ['uwu']
}
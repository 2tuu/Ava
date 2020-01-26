exports.run = (client, message, args) => {
var v = args.join(' ');

//if(v.length >= 700) return message.channel.send("What's this? (ERR: Too many characters, use 700 or less)");

let owoify = function (v) {

    let faces = [";;w;;","owo","uwu",">w<","=w="];
  
    v = v.replace(/(?:r|l)/g, "w");
    v = v.replace(/(?:R|L)/g, "W");
    v = v.replace(/n([aeiou])/g, 'ny$1');
    v = v.replace(/N([aeiou])/g, 'Ny$1');
    v = v.replace(/N([AEIOU])/g, 'NY$1');
    v = v.replace(/ove/g, "uv");
    v = v.replace(/\!+/g, " "+ faces[Math.floor(Math.random()*faces.length)]+ " ");
    v = v.replace(/\?+/g, " owo;;?? ");
  
    return v;
  
  }

  if(!args[0]){
      return message.channel.send("Whats this? (ERR: No arguments)")
  }

  message.channel.send(owoify(v));
}

exports.conf = {
    DM: true,
    OwnerOnly: false
}
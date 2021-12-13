const config = require('./../config.json');
//default content of config.example.json db section - DO NOT EDIT THIS
const defaults = {
  "dbuser": "database username (probably postgres/root)",
  "dbname": "the name of the database you want Kit to use",
  "dbpass": "the password for the user you want Kit to use"
};

if(config.dbuser === defaults.dbuser || config.dbname === defaults.dbname || config.dbpass === defaults.dbpass){
  return console.error('ERROR: config.json has not been filled out properly, please make sure to enter your database name, and login information before running this again.')
}

const { Pool } = require('pg')
const connection = new Pool({
  user:  config.dbuser,
  database: config.dbname,
  password: config.dbpass
});

connection.query('CREATE TABLE announce (guild TEXT, channel TEXT);').then(row=>{
  console.log('Created "announce" table successfully');
})

connection.query('CREATE TABLE blacklist (userid TEXT, reason TEXT);').then(row=>{
  console.log('Created "blacklist" table successfully');
});

connection.query('CREATE TABLE modlog (logkicks TEXT, logreactions TEXT, logchannels TEXT, logemojis TEXT, logbans TEXT, logleaves TEXT, logmembers TEXT, logmessages TEXT, logroles TEXT, serverid TEXT, enabled TEXT, channel TEXT, ignore TEXT);', function(err, rows){
  console.log('Created "modlog" table successfully');
})

connection.query('CREATE TABLE note (note TEXT, ownerid TEXT);').then(row=>{
  console.log('Created "note" table successfully');
})

connection.query('CREATE TABLE nsfw (id TEXT, birthyear TEXT);').then(row=>{
  console.log('Created "nsfw" table successfully');
})

connection.query('CREATE TABLE prefixes (prefix TEXT, welcomeMessage TEXT, welcomeChannel TEXT, shouldWelcome TEXT, serverId TEXT);').then(row=>{
  console.log('Created "prefixes" table successfully');
})

connection.query('CREATE TABLE prefix (prefix TEXT, welcomeMessage TEXT, welcomeChannel TEXT, shouldWelcome TEXT, serverId TEXT);').then(row=>{
  console.log('Created "prefixes" table successfully');
});

connection.query('CREATE TABLE settings (serverid TEXT, banid TEXT);').then(row=>{
  console.log('Created "settings" table successfully');
})

connection.query('CREATE TABLE tags (serverID TEXT, tagName TEXT, tagContent TEXT, ownerID TEXT, selfDelete TEXT);').then(row=>{
  console.log('Created "tags" table successfully');
})
                                            //user is a reserved term
connection.query('CREATE TABLE timer (endtime TEXT, "user" TEXT, channelcreated TEXT, message TEXT);').then(row=>{
  console.log('Created "time" table successfully');
})

connection.query('CREATE TABLE giverole (serverid TEXT, rolearray TEXT);').then(row=>{
  console.log('Created "giverole" table successfully');
})

connection.query('CREATE TABLE xban (serverid TEXT, userarray TEXT);').then(row=>{
  console.log('Created "xban" table successfully');
})

connection.query('CREATE TABLE profile (userid TEXT, dob TEXT, subtitle TEXT, bio TEXT, badges TEXT, background TEXT, color TEXT, cmds TEXT, coins TEXT);').then(row=>{
  console.log('Created "profile" table successfully');
})

connection.query('CREATE TABLE password (serverid TEXT, password TEXT, role TEXT, channel TEXT);').then(row=>{
  console.log('Created "password" table successfully');
})


console.log('SQL database setup successful');
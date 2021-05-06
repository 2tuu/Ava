const config = require('./../config.json').catch((err)=>{
  return console.error('ERROR:\n'+err);
});

//check login settings to make sure they've been changed

const { Pool } = require('pg')
const connection = new Pool({
  user: 'postgres',
  database: 'kit',
  password: 'toor',
  idleTimeoutMillis: 100,
  connectionTimeoutMillis: 100,
  max: 0
});

  connection.query('CREATE TABLE announce (guild TEXT, channel TEXT);', function(err, rows){
    if(err) console.error('ERROR:\n'+err);
    console.log('Created "announce" table successfully');
  });

  connection.query('CREATE TABLE blacklist (userid TEXT, reason TEXT);', function(err, rows){
    if(err) console.error('ERROR:\n'+err);
    console.log('Created "blacklist" table successfully');
  });

    connection.query('CREATE TABLE modlog (logkicks TEXT, logreactions TEXT, logchannels TEXT, logemojis TEXT, logbans TEXT, logleaves TEXT, logmembers TEXT, logmessages TEXT, logroles TEXT, serverid TEXT, enabled TEXT, channel TEXT);', function(err, rows){
      if(err) console.error('ERROR:\n'+err);
      console.log('Created "modlog" table successfully');
  });

  connection.query('CREATE TABLE note (note TEXT, ownerid TEXT);', function(err, rows){
    if(err) console.error('ERROR:\n'+err);
    console.log('Created "note" table successfully');
  });

  connection.query('CREATE TABLE nsfw (id TEXT, birthyear TEXT);', function(err, rows){
    if(err) console.error('ERROR:\n'+err);
    console.log('Created "nsfw" table successfully');
  });

  connection.query('CREATE TABLE prefixes (prefix TEXT, welcomeMessage TEXT, welcomeChannel TEXT, shouldWelcome TEXT, serverId TEXT);', function(err, rows){
    if(err) console.error('ERROR:\n'+err);
    console.log('Created "prefixes" table successfully');
  });

  connection.query('CREATE TABLE profile (prefix TEXT);', function(err, rows){
    if(err) console.error('ERROR:\n'+err);
    console.log('Created "profile" table successfully');
  });


  connection.query('CREATE TABLE prefix (prefix TEXT, welcomeMessage TEXT, welcomeChannel TEXT, shouldWelcome TEXT, serverId TEXT);', function(err, rows){
    if(err) console.error('ERROR:\n'+err);
    console.log('Created "prefixes" table successfully');
  });

  connection.query('CREATE TABLE settings (serverid TEXT, banid TEXT);', function(err, rows){
    if(err) console.error('ERROR:\n'+err);
    console.log('Created "settings" table successfully');
  });

  connection.query('CREATE TABLE tags (serverID TEXT, tagName TEXT, tagContent TEXT, ownerID TEXT, selfDelete TEXT);', function(err, rows){
    if(err) console.error('ERROR:\n'+err);
    console.log('Created "tags" table successfully');
  });
                                                //user is a reserved term
  connection.query('CREATE TABLE timer (endtime TEXT, "user" TEXT, channelcreated TEXT, message TEXT);', function(err, rows){
    if(err) console.error('ERROR:\n'+err);
    console.log('Created "time" table successfully');
  });

  connection.end();

  console.log('SQL database setup successful');
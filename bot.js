//FireBot v2
//By FireWings

//Setup some constants / Varibles

const fs = require('fs'); //Determine the Auth File to use
var authSettings;
if (fs.existsSync("./dev.config.json")) { 
  console.log("Detected a dev config, useing that!");
  authSettings = require("./dev.config.json"); //Load Dev Bot Config
} else {
  authSettings = require("./config.json"); //Load Bot Config
}

const EventHandler = {
  message: require("./Events/Message.js")
};

const hdate = require('human-date');

//Discord Stuff
const Discord = require('discord.js');
const client = new Discord.Client();

//Database Vars
var db = require('diskdb');
db.connect('./Database', ['lang', 'settings', 'error', 'test']); //"Connect to the DB"
//var lang = db.lang; //The normal language DB
var lang = {au:{eng: require("./lang/au-eng.json")}}; //The local edit DB
var settings = db.settings; //Each Guilds Settings
var test = db.test; //Test DB
var errordb = db.error; //DB of Errors

//Error Handle
function msgErrHand(err, msg, errordb){
  let time = hdate.prettyPrint(new Date, { showTime: true });
  
  let server;
  if (msg.guild == null){
    server = {id:"Na", name:"Na"};
  } else {
    server = {id: msg.guild.id, name: msg.guild.name};
  }
  
  console.log(time);
  console.log("Whoa Dude! Error!");
  console.log(err);
  
  errordb.save({
      Time: time,
      User: {
        ID: msg.author.id,
        Username: msg.author.username
      },
      Channel: {
        ID: msg.channel.id,
        Name: msg.channel.name
      },
      Guild: {
        ID: server.id,
        Name: server.name
      },
      Err: err
      /*Err: {
        Type: err.name.toString(),
        Err: err.message.toString()
      }*/
    });
}

//Do the Thing
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("guildCreate", guild => {
    console.log("Woo new server! Welcome" + guild.name); //Not needed
});

client.on("guildDelete", guild => {
    console.log(":( We lost a server. Goodbye " + guild.name);
});

client.on("guildMemberAdd", member => {
    console.log("So @" + member.id + " joined " + member.guild.name);
    // Welcome message here
});

client.on("guildMemberRemove", member => {
    let x = "So @" + member.id; 
    if (member.id === client.user.id){x += " (Me!)"}
    x += " left " + member.guild.name;
    console.log(x);
    // When someone leaves or is removed
});


client.on('message', msg => {
  
  try {
    EventHandler.message(client, db, msg);
  }
  catch(err){
    msgErrHand(err, msg, errordb);
  }
});

client.login(authSettings.bot.token);
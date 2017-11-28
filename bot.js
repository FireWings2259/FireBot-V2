//FireBot v2
//By FireWings

//Setup some constants / Varibles
var Promise = require("bluebird"); //Useing the Bluebird Promise Library

const fs = require('fs'); //Determine the Auth File to use
var authSettings;
if (fs.existsSync("./dev.config.json")) { 
  console.log("Detected a dev config, useing that!");
  authSettings = require("./dev.config.json"); //Load Dev Bot Config
} else {
  authSettings = require("./config.json"); //Load Bot Config
}

//Load and apply the default language
const LangSelector = require("./Language/LangSelector.js");
const lang = new LangSelector(authSettings.default_lang);

//load the event handlers
const EventHandler = {
  message: require("./Events/Message.js"),
  error: require("./Events/Error.js")
};

//Discord Stuff
const Discord = require('discord.js');
const client = new Discord.Client();

//Database Stuff
const Sequelize = require('sequelize');
const sqlize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: 'database.sqlite',
});

const botSet = "";

const globalUsers = "";

const guildSet = "";

const guildAdmin =  "";





/*//The old way of doing things... [NOTE] This will be removed completly... [/NOTE]
/* var db = require('diskdb');
db.connect('./Database', ['lang', 'settings', 'error', 'test']); //"Connect to the DB"
//var lang = db.lang; //The normal language DB
var lang = {au:{eng: require("./lang/au-eng.json")}}; //The local edit DB
var settings = db.settings; //Each Guilds Settings
var test = db.test; //Test DB
var errordb = db.error; //DB of Errors */


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


client.on('message', message => {
  
  try {
    EventHandler.message(client, db, message);
  }
  catch(err){
   EventHandler.error.message(err, message, db, lang);
  }
});

client.login(authSettings.bot.token);
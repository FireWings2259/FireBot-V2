//FireBot v2
//By FireWings

//Setup some constants / Varibles
/* global __dirname */

//Cross Platform Path Stuff
var path = require("path");
var jp = path.join;
var cwd = __dirname;

//Determine the Auth File to use
var fs = require('fs'); 
var authSettings;
if (fs.existsSync(jp(cwd, "dev.config.json"))) { 
  console.log("Detected a dev config, useing that!");
  authSettings = require(jp(cwd, "dev.config.json")); //Load Dev Bot Config
} else {
  authSettings = require(jp(cwd, "config.json")); //Load Bot Config
}

//Create, Load and Apply the Default Language Settings
const LangSelector = require(jp(cwd, "Language","LangSelector.js"));
const lang = new LangSelector(authSettings.default_lang);
const behl = lang.console.info.botEvents;

var Promise = require("bluebird"); //Useing the Bluebird Promise Library

//Load the Event Handlers
const EventHandler = {
  message: require(jp(cwd,"Events","Message.js")),
  error: require(jp(cwd,"Events","Error.js"))
};

//Database Stuff
var db = require(jp(cwd, "Database","Database.js"));
var botSet = db.botSet;
var globalUsers = db.globalUsers;
var guildAdmins = db.guildAdmins;
var lvlPBot = db.lvlPBot;
var lvlPG = db.lvlPG;
var guildSet = db.guildSet;
var shopItems = db.shopItems;
var userItems = db.userItems;
var errorLog = db.errorLog;

//Discord Stuff
const Discord = require('discord.js');
const client = new Discord.Client();

async function getLang(msg){ //Language wrapper
    let guildID = msg.guild.id;
    let gLangS;
    try{gLangS = await guildSet.findOne({ where: { id: guildID } });} //Get the 
    catch(e){gLangS = lang;}; //Yes I know that theres an error, but its being ignored. (Might fix this later...)
    let gLang = new LangSelector(gLangS);
    return gLang;
}

//Do the Thing
client.on('ready', async () => {
  console.log(behl.ready({client:client}));
});

client.on("guildCreate", async guild => {
    console.log(behl.guildCreate({guild:guild})); //Not needed
});

client.on("guildDelete", async guild => {
       console.log(behl.guildDelete({guild:guild})); //Not needed
});

client.on("guildMemberAdd", async member => {
       console.log(behl.guildMemberAdd({member:member})); //Not needed
    // Welcome message here
});

client.on("guildMemberRemove", async member => {
    console.log(behl.guildMemberRemove({member:member, client:client})); //Not needed
});


client.on('message', async message => {
  let cmLang = await getLang(message);
  try {
    EventHandler.message(client, db, message, cmLang);
  }
  catch(err){
   EventHandler.error.message(err, message, errorLog);
  }
});

client.login(authSettings.bot.token);
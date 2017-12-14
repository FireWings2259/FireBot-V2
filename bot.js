//FireBot v2
//By FireWings

//Setup some Constants / Varibles
/* global __dirname */

//Cross Platform Path Stuff
var path = require("path");
var jp = path.join;
var cwd = __dirname; //Current Working Directory

//Determine the Auth File to use
var fs = require('fs'); 
var configFile;
if (fs.existsSync(jp(cwd, "dev.config.json"))) { 
  console.log("Detected a dev config, useing that!");
  configFile = require(jp(cwd, "dev.config.json")); //Load Dev Bot Config
} else {
  configFile = require(jp(cwd, "config.json")); //Load Bot Config
}
//Now that the config file is loaded, We add some settings...
/* Might not want this...
configFile.afterConfigIsLoaded = {
  name:"FireBot-V2"  
};
*/

//Create, Load and Apply the Default Language Settings
const LangSelector = require(jp(cwd, "Language","LangSelector.js"));
const lang = new LangSelector(configFile.default_lang);
const behl = lang.console.info.botEvents; //Bot Event Handler Language file

var Promise = require("bluebird"); //Useing the Bluebird Promise Library

//Load the Event Handlers
const EventHandler = {
  message: require(jp(cwd,"Events","Message.js")),
  guildCreate: require(jp(cwd,"Events","guildCreate.js")),
  error: require(jp(cwd,"Events","Error.js"))
};

//Database Stuff
var db = require(jp(cwd, "Database","Database.js"));
var { botSet, globalUsers, guildAdmins, lvlPBot, lvlPG,
       guildSet, shopItems, userItems, errorLog, 
       updateDbDefaults } = db;

/* I don't think this is needed... [NOTE] This will be deleted at some point... [/NOTE]
var botSet = db.botSet;
var globalUsers = db.globalUsers;
var guildAdmins = db.guildAdmins;
var lvlPBot = db.lvlPBot;
var lvlPG = db.lvlPG;
var guildSet = db.guildSet;
var shopItems = db.shopItems;
var userItems = db.userItems;
var errorLog = db.errorLog;
*/

//This is the debug options...
if (configFile.debug !== undefined){
    if (configFile.debug.promiseCrash === true) { //Crash on failed Promise Thats not covered...
        process.on('unhandledRejection', (err) => { 
          console.error(err);
          process.exit(1);
        });
    }
}

//Discord Stuff
const Discord = require('discord.js');
const client = new Discord.Client();

async function getLang(guild){ //Language wrapper
    let gLangS;
    if (guild !== null){
        let guildID = guild.id;
        try {
            gLangS = await guildSet.findOne({ where: { id: guildID } }).get("language");
        }
        catch(e){
            console.worn(e)
            gLangS = lang;
        }; //Yes I know that theres an error, but its being ignored. (Might fix this later...)
    } else {
        gLangS = lang;
    }
    let gLang = new LangSelector(gLangS);
    return gLang;
}

//Do the Thing
client.on('ready', async () => {
    await db.updateDbDefaults();
  console.log(behl.ready({client:client}));
});

client.on("guildCreate", async guild => {
    if (!guild.available) return EventHandler.error.guildCreate(new Error("Guild Not Avaible"), guild, errorLog).catch(err => console.error(err));
    console.log(behl.guildCreate({guild:guild})); //Not needed
    EventHandler.guildCreate(client, db, guild, lang, configFile)
    .catch(err => EventHandler.error.guildCreate(err, guild, errorLog));
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
  let cmLang = await getLang(message.guild).catch(err => console.error(err));
    EventHandler.message(client, db, message, cmLang, configFile)
        .catch(err => EventHandler.error.message(err, message, errorLog));
  });

client.login(configFile.bot.token);
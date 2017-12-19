//FireBot v2
//By FireWings

//Setup some Constants / Varibles
/* global __dirname */

//Cross Platform Path Stuff
var path = require("path");
var jp = path.join;
var cwd = __dirname; //Current Working Directory

const configFile = require(jp(cwd, "configMan.js")).configFile;
const debug = configFile.debug;

//Now that the config file is loaded, We add some settings...
/* Might not want this...
configFile.afterConfigIsLoaded = {
  name:"FireBot-V2"  
};
*/

//Create, Load and Apply the Default Language Settings (From this point on the language file will be used)
const LangSelector = require(jp(cwd, "Language","LangSelector.js"));
const lang = new LangSelector(configFile.default_lang);
const behl = lang.console.info.botEvents; //Bot Event Handler Language file

const Promise = require("bluebird"); //Useing the Bluebird Promise Library (later, not now but soon)

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
       checkFirstRun } = db;

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
            if (debug.catchErrorToConsole) console.worn(e)
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
    await db.checkFirstRun()
            .catch(err => EventHandler.error.general(err, errorLog));
  console.log(behl.ready({client:client}));
});

client.on("guildCreate", async guild => {
    if (!guild.available) return EventHandler.error.guildCreate(new Error("Guild Not Avaible"), errorLog, guild)
            .catch(err => {if (debug.catchErrorToConsole) console.error(err)});
    if (debug.consoleAlerts) console.log(behl.guildCreate({guild:guild})); //Not needed
    EventHandler.guildCreate(client, db, guild, lang, configFile)
    .catch(err => EventHandler.error.guildCreate(err, errorLog, guild));
});

client.on("guildDelete", async guild => {
       if (debug.consoleAlerts) console.log(behl.guildDelete({guild:guild})); //Not needed
});

client.on("guildMemberAdd", async member => {
       if (debug.consoleAlerts) console.log(behl.guildMemberAdd({member:member})); //Not needed
    // Welcome message here
});

client.on("guildMemberRemove", async member => {
    if (debug.consoleAlerts) console.log(behl.guildMemberRemove({member:member, client:client})); //Not needed
});


client.on('message', async message => {
  let cmLang = await getLang(message.guild).catch(err => console.error(err));
    EventHandler.message(client, db, message, cmLang, configFile)
        .catch(err => EventHandler.error.message(err, errorLog, message));
  });

client.login(configFile.bot.token);
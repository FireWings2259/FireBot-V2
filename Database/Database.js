//FireBot V2
//Database Management

/* global __dirname */
const Promise = require("bluebird"); //Useing the Bluebird Promise Library
const Sequelize = require('sequelize');

//Cross Platform Path Stuff
var path = require("path");
var jp = path.join;
var cwd = __dirname;
var fs = require("fs");

const configFile = require(jp(cwd, "..", "configMan.js")).configFile;
const debug = configFile.debug;

//Load the Language File
const LangSelector = require(jp(cwd, "..", "Language","LangSelector.js"));
const lang = new LangSelector(configFile.default_lang);

const sqlize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: './Database/database.sqlite',
    operatorsAliases: false
});

const botSet = sqlize.import(jp(cwd, "Models","botSettings.js"));
const globalUsers = sqlize.import(jp(cwd, "Models","globalUsers.js"));
const guildAdmins = sqlize.import(jp(cwd, "Models","guildAdmins.js"));
const lvlPBot = sqlize.import(jp(cwd, "Models","LevelPermsGlobal.js"));
const lvlPG = sqlize.import(jp(cwd, "Models","LevelPermsGuild.js"));
const guildSet = require(jp(cwd, "Models","guildSettings.js"))(sqlize, Sequelize, lang, configFile);
const shopItems = sqlize.import(jp(cwd, "Models","shopItems.js"));
const userItems = sqlize.import(jp(cwd, "Models","userItems.js"));
const errorLog = sqlize.import(jp(cwd, "Models","error.js"));

userItems.belongsTo(globalUsers, {foreignKey: 'item_id', as: 'item' });

function checkFirstRun(){
    return new Promise(function(resolve, reject){
        if (fs.existsSync(jp(cwd, "database.sqlite")) && configFile.debug.dropDbOnStart) {
            console.log(lang.console.info.db.dropDbOnStart);
            fs.unlinkSync(jp(cwd, "database.sqlite"));
        }
        
        if (!fs.existsSync(jp(cwd, "database.sqlite"))){
        console.log("DB Not Real! First Run!");
        sqlize.sync()
          .then(async ()=>{
          await lvlPBot.create({
               level_id:0,
               name:"Maintainer",
               desc:"This is the default group. ANYONE with this role can do ANYTHING with this bot. Be careful who gets this.",
               perms:{all:true}
           });
           await botSet.create({
               admin_id: configFile.bot.maintainer_id,
               level: 0
           });})
          .then(console.log("DB Created!"))
          .then(resolve(true))
          .catch(e => { 
             reject(e); 
          });
    }else{
        console.log("Not First Run!");
        resolve(false);
    }});
};


module.exports = {botSet, globalUsers, guildAdmins, lvlPBot, lvlPG, guildSet, shopItems, userItems, errorLog, checkFirstRun};
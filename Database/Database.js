/* global __dirname */

//FireBot V2
//Database Management

const Promise = require("bluebird"); //Useing the Bluebird Promise Library
const Sequelize = require('sequelize');

//Cross Platform Path Stuff
var path = require("path");
var jp = path.join;
var cwd = __dirname;

const fs = require('fs'); //Determine the Auth File to use
var configFile;
if (fs.existsSync(jp(cwd, "..", "dev.config.json"))) { 
  configFile = require(jp(cwd, "..", "dev.config.json")); //Load Dev Bot Config
} else {
  configFile = require(jp(cwd, "..", "config.json")); //Load Bot Config
}

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
const guildSet = sqlize.import(jp(cwd, "Models","guildSettings.js"));
const shopItems = sqlize.import(jp(cwd, "Models","shopItems.js"));
const userItems = sqlize.import(jp(cwd, "Models","userItems.js"));
const errorLog = sqlize.import(jp(cwd, "Models","error.js"));

userItems.belongsTo(globalUsers, {foreignKey: 'item_id', as: 'item' });

//Look This might work, it might not, For now im gonna leave it untill I figureout a better way.
async function updateDbDefaults(){
    await checkFirstRun();
    
    await sqlize.queryInterface.changeColumn(
     'guildSettings',
     'prefix',
     {
       type: Sequelize.STRING,
       defaultValue: configFile.bot.default_prefix
    });

    await sqlize.queryInterface.changeColumn(
      'guildSettings',
      'language',
      {
        type: Sequelize.JSON,
        defaultValue: {lang: configFile.bot.default_lang[0], loc: configFile.bot.default_lang[1]}
    });
}

function checkFirstRun(){
    return new Promise(function(resolve, reject){
        if (!fs.existsSync(jp(cwd, "database.sqlite"))){
        console.log("DB Not Real! First Run!");
        sqlize.sync().then(function(){
         console.log("DB Created!");
         resolve();
        }).catch(function(e){
            reject(e);
        });
    }else{
        console.log("Not First Run!");
        resolve();
    }});
};


module.exports = {botSet, globalUsers, guildAdmins, lvlPBot, lvlPG, guildSet, shopItems, userItems, errorLog, updateDbDefaults};
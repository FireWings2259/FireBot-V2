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
var authSettings;
if (fs.existsSync(jp(cwd, "..", "dev.config.json"))) { 
  authSettings = require(jp(cwd, "..", "dev.config.json")); //Load Dev Bot Config
} else {
  authSettings = require(jp(cwd, "..", "config.json")); //Load Bot Config
}

const sqlize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: './database.sqlite'
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
function *updateDbDefaults(){
    yield sqlize.queryInterface.changeColumn(
     'guildSettings',
     'prefix',
     {
       type: Sequelize.STRING,
       defaultValue: authSettings.default_prefix
    });

    yield  sqlize.queryInterface.changeColumn(
      'guildSettings',
      'language',
      {
        type: Sequelize.JSON,
        defaultValue: {lang: authSettings.default_lang[0], loc: authSettings.default_lang[1]}
    });

    if (!fs.existsSync(jp(cwd,"database.sqlite"))){
        console.log("DB Not Real! First Run!");
        yield  sqlize.sync().then(console.log("DB Created!")).catch(console.error);
    }
}

updateDbDefaults();
module.exports = {botSet, globalUsers, guildAdmins, lvlPBot, lvlPG, guildSet, shopItems, userItems, errorLog};


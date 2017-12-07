//FireBot V2
//Database Management

const Promise = require("bluebird"); //Useing the Bluebird Promise Library
const Sequelize = require('sequelize');

const fs = require('fs'); //Determine the Auth File to use
var authSettings;
if (fs.existsSync("./dev.config.json")) { 
  authSettings = require("./dev.config.json"); //Load Dev Bot Config
} else {
  authSettings = require("./config.json"); //Load Bot Config
}

const sqlize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: './database.sqlite',
});

const botSet = sqlize.import("./Models/botSettings.js");
const globalUsers = sqlize.import("./Models/globalUsers.js");
const guildAdmins = sqlize.import("./Models/guildAdmins.js");
const lvlPBot = sqlize.import("./Models/LevelPermsGlobal.js");
const lvlPG = sqlize.import("./Models/LevelPermsGuild.js");
const guildSet = sqlize.import("./Models/guildSettings.js");
const shopItems = sqlize.import("./Models/shopItems.js");
const userItems = sqlize.import("./Models/userItems.js");
const errorLog = sqlize.import("./Models/error.js");

userItems.belongsTo(globalUsers, {foreignKey: 'item_id', as: 'item' });

await sqlize.queryInterface.changeColumn(
 'guildSettings',
 'prefix',
 {
   type: Sequelize.STRING,
   defaultValue: authSettings.default_prefix
});
 
await sqlize.queryInterface.changeColumn(
  'guildSettings',
  'language',
  {
    type: Sequelize.JSON,
    defaultValue: {lang: authSettings.default_lang[0], loc: authSettings.default_lang[1]}
});

if (!fs.existsSync("./database.sqlite")){
    console.log("DB Not Real! First Run!");
    await sqlize.sync().then(console.log("DB Created!")).catch(console.error);
}

module.exports(botSet, globalUsers, guildAdmins, lvlPBot, lvlPG, guildSet, shopItems, userItems, errorLog);
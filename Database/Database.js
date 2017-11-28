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
const LangSelector = require("./Language/LangSelector.js");
const lang = new LangSelector(authSettings.default_lang);

const sqlize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: './database.sqlite',
});

const botSet = require("./Models/botSettings.js")(sqlize, Sequelize);
const globalUsers = require("./Models/globalUsers.js")(sqlize, Sequelize);
const guildAdmins = require("./Models/guildAdmins.js")(sqlize, Sequelize);
const guildSet = require("./Models/guildSettings.js")(sqlize, Sequelize, authSettings);
const shopItems = require("./Models/shopItems.js")(sqlize, Sequelize);
const userItems = require("./Models/userItems.js")(sqlize, Sequelize);
const errorLog = require("./Models/error.js")(sqlize, Sequelize, lang)

userItems.belongsTo(globalUsers, {});




if (!fs.existsSync("./database.sqlite")){
    console.log()
}
//FireBot-V2
//config Manager/Loader

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

//This is the debug options...
if (configFile.debug !== undefined){
    if (configFile.debug.promiseCrash === true) { //Crash on failed Promise Thats not covered...
        process.on('unhandledRejection', (err) => { 
          console.error(err);
          process.exit(1);
        });
    }
} else {
    configFile.debug = {
        consoleAlerts: false,
        catchErrorToConsole: false,
        promiseCrash: false
    };
}

module.exports = {configFile};
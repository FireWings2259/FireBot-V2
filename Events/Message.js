//FireBot-V2
//Message Handler

//Cross Platform Path Stuff
/* global __dirname */
var path = require("path");
var jp = path.join;
var cwd = __dirname; //Current Working Directory
var moddir = file => jp(cwd, "..", "Modules", file);

var errorHandler = require(jp(cwd,"Error.js"));

const Modules = {
  base: require(moddir("base.js"))  
};

function getHandler(cmd, cmdList){
    let x = Object.keys(cmdList);
    for (i=0; x.length > i; i++){
        let y = Object.values(cmdList[Object.keys(cmdList)[i]]);
        //console.log(i, cmdList[Object.keys(cmdList)[i]],Object.values(cmdList[Object.keys(cmdList)[i]]));
        if (y.indexOf(cmd) !== -1){
            return Object.keys(cmdList)[i];
        };
    };
    return undefined;
};

module.exports = async (client, db, message) => {
    let lang = message.FireBot.lang;
    if (message.content === "stop" && message.author.id === client.FireBotVars.configFile.bot.maintainer_id) { //Only die on maintainer.
        return await client.destroy().then(process.exit(0)); //logout then quit
    } //else { console.log("Whoa Boy! " + message.author.tag + " just tried to kill the client!"); }
    
    var configFile = client.FireBotVars.configFile;
    let msgLang = lang.message;

    if (message.author.bot) return; //console.log(msg.author.username + " is a client! Not Touching!");
    if (message.channel.type === 'dm') return message.reply(msgLang.dm); //For now
    
    //From this point on we are in a guild.
    
    const guildSet = message.FireBot.guildSet;  //await db.guildSet.findOne({ where: { guild_id: message.guild.id }});
    let prefix, cmd, cmdList, cmdString, cmdArgs, modHandle;
    prefix = message.FireBot.prefix = guildSet.get("prefix");
    cmdList = message.FireBot.cmdList = guildSet.get("commands");
    cmdString = message.FireBot.cmdString = message.content.slice(prefix.length);
    cmd = message.FireBot.cmd = cmdString.split(" ")[0].toLowerCase();
    cmdArgs = message.FireBot.cmdArgs = cmdString.slice(cmd.length);
    
    if (!message.content.startsWith(prefix)) return;
    modHandle = message.FireBot.modHandle = getHandler(cmd, cmdList);
    if (!modHandle) return; //Not Valid command
    
    let firstArg = cmdArgs.split(" ")[1];
    if (!firstArg) { firstArg  = false; } else { firstArg = firstArg.toLowerCase() === cmdList.base.setup; }
    message.FireBot.firstArg = firstArg;
    if (guildSet.newServer && !((cmd === cmdList.base.help && firstArg) || cmd === cmdList.base.setup)) 
        return message.channel.send(lang.message.notSetup({msg:message, client:client, gSet:guildSet}));
    
    Modules[modHandle][cmd](client, db, message)
        .catch(err => {
            errorHandler.message(err, db.errorLog, message);
            if (configFile.debug.catchErrorToConsole) console.log(err);
        });
};


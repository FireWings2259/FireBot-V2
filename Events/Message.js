//Message Handler
var Promise = require("bluebird"); //Useing the Bluebird Promise Library

module.exports = async (bot, db, message, lang, configFile) => {
        let msgLang = lang.message;

        if (message.author.bot) return; //console.log(msg.author.username + " is a bot! Not Touching!");
        
        if (message.content === "stop") return process.exit(1);
        
        if (message.channel.type === 'dm'){ 
            message.reply(msgLang.dm); //for now
            throw new Error("Sup");
            //return Promise.reject(new Error("error"));
        }

    
    
};


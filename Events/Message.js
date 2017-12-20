//FireBot-V2
//Message Handler

module.exports = async (bot, db, message, lang) => {
    var configFile = bot.FireBotVars.configFile;
    let msgLang = lang.message;

    if (message.author.bot) return; //console.log(msg.author.username + " is a bot! Not Touching!");
    if (message.channel.type === 'dm'){ 
        message.reply(msgLang.dm); //for now
        throw new Error("Sup");
        //return Promise.reject(new Error("error"));
    }
        
    if (message.content === "stop") return process.exit(1);
};


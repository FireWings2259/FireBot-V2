//Message Handler

module.exports = async (bot, db, message, lang, configFile) => {
    let msgLang = lang.message;
    
    if (message.author.bot) return; //console.log(msg.author.username + " is a bot! Not Touching!");
    
    if (message.channel.type === 'dm'){ 
        message.reply(msgLang.dm); //for now
        //throw "NOPE!";
    }
    
    
};


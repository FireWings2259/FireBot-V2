//Message Handler

module.exports = (bot, db, message, lang) => {
    if (message.author.bot) return; //console.log(msg.author.username + " is a bot! Not Touching!");
    
    if (message.channel.type === 'dm'){ 
        message.reply("Sorry I can't work with DMs at the moment...");
        throw "NOPE!";
       // return console.log("Thats a DM! I can't touch that yet :("); //for now
    }
    
    
};
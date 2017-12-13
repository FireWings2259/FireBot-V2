//Error Handler
//const hdate = require("human-date");

module.exports = {
    message: async function(err, msg, db){
        try {
            const error = await db.create(new dbobj(err, msg));
        } catch(e){
            console.log(e);
        }
    }
};

/*async*/ function dbobj(err, msg){ //No longer Async...
    //this.time = hdate.prettyPrint(new Date, { showTime: true, allUnits:true }); //Not Needed...
    this.error = err.toString();
    if (msg !== null && msg !== undefined){
       this.user_id = msg.author.id;
       this.user_name = msg.author.username;
       this.channel_id = msg.channel.id;
       this.message = msg.content;
       this.channel_type = msg.channel.type;
       if (msg.channel.type === "text"){
           this.guild_id = msg.guild.id;
           this.guild_name = msg.guild.name;
           this.channel_name = msg.channel.name;
       }
       /*if (msg.author.guild !== null){ //If this can be figured out sure.
           let nick = await msg.author.guild.fetchMember(msg.author).nickname;
           if (typeof(nick) === "string"){
               this.user_nick = nick;
           }
       }*/
    }
}
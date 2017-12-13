//Error Handler

module.exports = {
    message: async function(err, msg, db){
        try {
            const error = await db.create(await new dbobj(err, msg));
        } catch(e){
            console.log(e);
        }
    }
};

async function dbobj(err, msg){
    this.error = err;
    if (msg !== null && msg !== undefined){
       this.user_id = msg.author.id;
       this.user_name = msg.author.username;
       this.channel_id = msg.channel.id;
       this.message = msg.content;
       if (msg.channel.type === "text"){
           this.guild_id = msg.guild.id;
           this.guild_name = msg.guild.name;
           this.channel_name = msg.channel.name;
       }
       if (msg.author.guild !== null){
           let nick = await msg.author.guild.fetchMember(msg.author).nickname;
           if (typeof(nick) === "string"){
               this.user_nick = nick;
           }
       }
    }
}
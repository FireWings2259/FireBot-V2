//FireBot-V2
//Error Handler

module.exports = {
    general: async function(err, db){
      try{
          let x = new dbobj(err, "general");
          console.log("NiNiNi", err);
          const error = await db.create(x)
                  .catch(console.log);
      }catch(e){
          console.log(e);
      }  
    },
    message: async function(err, db, msg){
        try {
            let x = new dbobj(err, msg);
            if (msg.guild !== undefined){ 
                let nick = await msg.guild.fetchMember(msg.member.id).nickname;
                if (typeof(nick) === "string"){
                    x.user_nick = nick;
                }
            }
            console.log("NaNaNa", err);
            const error = await db.create(x)
                    .catch(console.log);
            msg.reply(msg.FireBot.lang.message.error.msgPreTxt)
                    .then(msg.channel.send(msg.FireBot.lang.message.error.msgTxt({err:err})));
        } catch(e){
            console.log(e);
        }
    },
    guildCreateDelete: async function(err, db, guild){
        try {
            let x = new dbobj(err, "guildCreateDelete", guild);
            console.log("NeNeNe", err);
            const error = await db.create(x)
                    .catch(console.log);
        } catch(e) {
            console.log(e);
        }
    }
};

function dbobj(err, type, object){
    this.error = err.toString();
    
    if(type === "general"){
        //Noop
    }else if (type === "message") {
        let msg = object;
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
        }
    } else if (type === "guildCreateDelete"){
        let guild = object;
        this.guild_id = guild.id;
        this.guild_name = guild.name;
        
    }
};
//Australian English File
//FireBot V2

var selfObjError = function(obj) { //The self error function.
    return String("Data Not Object! It's a '" + typeof(obj) + "'.");
};

module.exports = {
    message: {
        dm: "Sorry I can't work with DMs at the moment..."
    },
    guildCreate:{
      welcome:  function(obj){ //{guild: "The Guild Object" client:"The Bot/Client Object", gSet:"The Guild Settings DB Object"}
                    if (typeof(obj) !== "object") throw new Error(selfObjError(obj));
                    let {guild, client, gSet} = obj;
                    let x;
                    x = "Hi " + guild.name + "!\nThanks for adding <@" + client.user.id + "> to your server!";
                    x+= "\nYou will need to setup your server by running the command: '" + gSet.get("prefix") + gSet.get("commands").setup + "'";
                    x+= "\nRemember only members that have the permissions of 'Administrator', 'Manage Server' or has both 'Manage Channels' and 'Manage Roles'";
                    x+= "can setup the bot. During setup you will have the option to allow other members/groups.";
                    x+= "For more help on setting up your server, run the command: '" + gSet.get("prefix") + gSet.get("commands").help + " " + gSet.get("commands").setup + "'";
                    return x;
                }
    },
    commands:{
        base:{
            help:"help",
            stop:"stop"
        }
    },
    console: {
        info:{
            botEvents: {
                ready: function(obj){ //{client: "The Bot/Client Object"}
                    if (typeof(obj) !== "object") throw new Error(selfObjError(obj)); 
                    return `Logged in as ${obj.client.user.tag}!`;
                },
                guildCreate: function(obj){ //{guild: "The Guild Object"}
                    if (typeof(obj) !== "object") throw new Error(selfObjError(obj)); 
                    return "Woo new server! Welcome " + obj.guild.name;
                },
                guildDelete: function(obj){ //{guild: "The Guild Object"}
                    if (typeof(obj) !== "object") throw new Error(selfObjError(obj)); 
                    return ":( We lost a server. Goodbye " + obj.guild.name;
                },
                guildMemberAdd: function(obj){ //{member: "The Member Object"}
                    if (typeof(obj) !== "object") throw new Error(selfObjError(obj)); 
                    return "So @" + obj.member.id + " (" + obj.member.username + ") "+" joined " + obj.member.guild.name;
                },
                guildMemberRemove: function(obj){ //{member: "The Guild Object", client: "The Bot/Client Object"}
                    if (typeof(obj) !== "object") throw new Error(selfObjError(obj)); 
                    let x = "So " + obj.member.user.tag + " (@" + obj.member.id + ")"; 
                    if (obj.member.id === obj.client.user.id){x += " (Me!)";};
                    x += " left " + obj.member.guild.name;
                    return x;
                }
            }
        },
        error:{
            msg: "Whoa Dude! Error!" //00x000a00
        }
    },
    database:{
      error:{
          user_id: "No User ID", //00x000a01
          user_name: "No User Name", //00x000a02
          user_nick: "No User Nickname", //00x000a03
          channel_id: "No Channel ID", //00x000a04
          channel_name: "No Channel Name", //00x000a04
          guild_id: "No Guild ID", //00x000a06
          guild_name: "No Guild Name", //00x000a07
          message: "No Message", //00x000a08
          time: "No Time", //00x000a09
          channel_type: "No Channel Type" //00x000a10
      }  
    },
    nope: function(obj) { //{ username: "The Users Username" }
            if (typeof(obj) !== "object") throw new Error(selfObjError(obj));  
            return "This is a nope from: " + obj.username + ". Thats a Full Stop!";
          }
};
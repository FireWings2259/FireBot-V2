//Australian English File
//FireBot V2

//NOTE: When translating please translate everything ABOVE the *console* property as thats more important.
//Thanks

var sls = function(strings) { //
  var values = Array.prototype.slice.call(arguments, 1);
  
  // Interweave the strings with the 
  // substitution vars first.
  var output = '';
  for (var i = 0; i < values.length; i++) {  
    output += strings[i] + values[i];
  }
  output += strings[values.length];

  // Split on newlines.
  var lines = output.split(/(?:\r\n|\n|\r)/);
    
  // Rip out the leading whitespace.
  return lines.map(function(line) {
    return line.replace(/^\s+/gm, '');  
  }).join(' ').trim();
};

var selfObjError = function(obj) { //The self error function.
    return String(`Data Not Object! It's a '${typeof(obj)}'.`);
};

module.exports = {
    commands:{
        base:{
            setup:"setup",
            help:"help",
            stop:"stop"
        }
    },
    message: {
      dm: "Sorry I can't work with DMs at the moment...",
      notSetup: function(obj){ //{msg: "The Message Object" client:"The Bot/Client Object", gSet:"The Guild Settings DB Object"}
                  if (typeof(obj) !== "object") throw new Error(selfObjError(obj));
                  let {msg, client, gSet} = obj;
                  let x  = `<@${msg.author.id}> you can't use this bot yet since it has not been setup!`;
                      x += ` Run the command '${gSet.get("prefix")}${gSet.get("commands").base.help} ${gSet.get("commands").base.setup}' to learn more!`;
                  return x;
      },
      setup:{
          noPerms: ()=>{
            let x  = "You don't have the permissions to setup the bot! ";
                x += "You need to have the permissions of 'Administrator', 'Manage Server' or has both 'Manage Channels' and 'Manage Roles'";
                x += "to setup the bot.";
                return x;
          },
          checkChannel:function(obj){ //{gSet:"The Guild Settings DB Object"}
              if (typeof(obj) !== "object") throw new Error(selfObjError(obj));
              let {gSet} = obj;
              let x  = "Do you want to be asked the setup questions in this channel?"
                  x += "\n:warning: API keys may be asked of you! You want to keep these private!";
                  x += "\nWe recomend useing a locked down channel for setup. You have been warned! :warning:";
                  x += "\nClick the tick reaction if this is the channel you want to use for setup, if its not click the cross reaction, move to your perfered channel ";
                  x += `and run the setup command (${gSet.get("prefix")}${gSet.get("commands").base.setup}) again.`;
              return x;
          },
        step1: function(obj){ //{msg: "The Message Object" client:"The Bot/Client Object", gSet:"The Guild Settings DB Object"}
                 if (typeof(obj) !== "object") throw new Error(selfObjError(obj));
                 let {msg, client, gSet} = obj;
                 let x = ``;
                 return x;
               },
        step2: function(obj){ //{msg: "The Message Object" client:"The Bot/Client Object", gSet:"The Guild Settings DB Object"}
                 if (typeof(obj) !== "object") throw new Error(selfObjError(obj));
                 let {msg, client, gSet} = obj;
                 let x = ``;
                 return x;
               }
      }
    },
    guildCreate:{
      welcome:  function(obj){ //{guild: "The Guild Object" client:"The Bot/Client Object", gSet:"The Guild Settings DB Object"}
                    if (typeof(obj) !== "object") throw new Error(selfObjError(obj));
                    let {guild, client, gSet} = obj;
                    let x;
                    x = "Hi " + guild.name + "!\nThanks for adding <@" + client.user.id + "> to your server!";
                    x+= "\nYou will need to setup your server by running the command: '" + gSet.get("prefix") + gSet.get("commands").base.setup + "'";
                    x+= "\nRemember only members that have the permissions of 'Administrator', 'Manage Server' or has both 'Manage Channels' and 'Manage Roles'";
                    x+= " can setup the bot. During setup you will have the option to allow other members/groups.";
                    x+= "\nFor more help on setting up your server, run the command: '" + gSet.get("prefix") + gSet.get("commands").base.help + " " + gSet.get("commands").base.setup + "'";
                    return x;
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
                    return `Woo new server! Welcome ${obj.guild.name}`;
                },
                guildDelete: function(obj){ //{guild: "The Guild Object"}
                    if (typeof(obj) !== "object") throw new Error(selfObjError(obj)); 
                    return `:( We lost a server. Goodbye ${obj.guild.name}`;
                },
                guildMemberAdd: function(obj){ //{member: "The Member Object"}
                    if (typeof(obj) !== "object") throw new Error(selfObjError(obj)); 
                    return `So @${obj.member.id}(${obj.member.username}) joined ${obj.member.guild.name}`;
                },
                guildMemberRemove: function(obj){ //{member: "The Guild Object", client: "The Bot/Client Object"}
                    if (typeof(obj) !== "object") throw new Error(selfObjError(obj)); 
                    let x = `So ${obj.member.user.tag} (@${obj.member.id})`; 
                    if (obj.member.id === obj.client.user.id){x += ` (Me!)`;};
                    x += ` left ${obj.member.guild.name}`;
                    return x;
                }
            },
            db:{
                dropDbOnStart:"Dropping Data Base!",
                deleteLostGuild: function(obj){ //{guild: "The Guild Object"}
                    if (typeof(obj) !== "object") throw new Error(selfObjError(obj)); 
                    return `All data for ${obj.guild.name} has been deleted!`;
                },
                keepLostGuild: function(obj){ //{guild: "The Guild Object"}
                    if (typeof(obj) !== "object") throw new Error(selfObjError(obj)); 
                    return `All data for ${obj.guild.name} has NOT been deleted!`;
                }
            }
        },
        error:{
            msg: "Whoa Dude! Error!", //00x000a00
            db: {
                firstrun: "Something broke... "
            }
        }
    },
   errorCodes:{
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
};
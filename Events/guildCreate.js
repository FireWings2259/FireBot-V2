//Guild Create Event

//getDefaultChannel function Stol--, Copied and revised from https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/master/frequently-asked-questions.md, Full Credit to them.
const getDefaultChannel = async (guild) => {
  if(guild.channels.has(guild.id))
    return guild.channels.get(guild.id);

  if(guild.channels.exists("name", "general"))
    return guild.channels.find("name", "general");
  
 // let channel = guild.channels
    return guild.channels
          .filter(c => c.type === "text" && c.permissionsFor(guild.client.user).has("SEND_MESSAGES"))
          .sort((a, b) => a.position - b.position).first();
  
 // return channel;
};


//The rest is mine.
module.exports = async (client, db, guild) => {
  let lang = client.FireBotVars.lang;
  let gcLang = lang.guildCreate;
  let guildSet = db.guildSet;
  let guildData;
  let guildDataB;
  let guildDataA = await guildSet.findOne({ where: { guild_id: guild.id } });
  
  if (!guildDataA){
      guildDataB = await guildSet.create({
          guild_id: guild.id,
          name: guild.name,
          guildOwner: guild.ownerID
      });
      
      await db.lvlPG.create({
               guild_id: guild.id,
               level_id:0,
               name:"Administrator",
               desc:"This is the default group. ANYONE with this role can do ANYTHING with this bot in your server. Be careful who gets this.",
               perms:{all:true}
            });
      
      await db.guildAdmins.create({
          guild_id: guild.id,
          user_id: guild.ownerID,
          level: 0
      }); 
  };
  
  if (!guildDataA) {guildData = guildDataB;}
  else {guildData = guildDataA;}
  
  let x = {
    guild: guild,
    client: client,
    gSet: guildData
  };
  
  const channel = await getDefaultChannel(guild);
  channel.send(gcLang.welcome(x));
};


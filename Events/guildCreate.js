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
module.exports = async (client, db, guild, lang, configFile) => {
  let gcLang = lang.guildCreate;
  let guildSet = db.guildSet;
  let guildData;
  let guildDataB;
  let guildDataA = await guildSet.findOne({ where: { id: guild.id } });
  
  if (!guildDataA){
      guildDataB = await guildSet.create({
          id: guild.id,
          name: guild.name,
          guildOwner: guild.ownerID
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


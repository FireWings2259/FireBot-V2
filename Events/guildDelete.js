/*
 * FireBot-V2
 * guildDelete.js
 * View the file LICENSE in the ROOT/BASE folder of the project for the License
 */

const Promise = require("bluebird");

module.exports = async (bot, db, guild) => {
  let lang = bot.FireBotVars.lang;
  let configFile = bot.FireBotVars.configFile;
  
  if (configFile.bot.delete_lost_guild) {
    let x = [db.guildAdmins.destroy({where:{guild_id: guild.id}}), 
             db.lvlPG.destroy({where:{guild_id: guild.id}}),
             db.guildSet.destroy({where:{guild_id: guild.id}}) ];
         
    Promise.all(x).then(() => {
      if (configFile.debug.consoleAlerts) console.log(lang.console.info.db.deleteLostGuild({guild: guild})); 
    });
  } else {
      if (configFile.debug.consoleAlerts) console.log(lang.console.info.db.keepLostGuild({guild: guild})); 
  }
};
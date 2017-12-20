/* FireBot-V2
 * base.js
 * View the file LICENSE in the ROOT/BASE folder of the project for the License
 */
//❌ ✅

const Promise = require("bluebird");

module.exports = {
    setup: async (client, db, message, lang) => {
       let { prefix, cmdList, cmdString, cmd, cmdArgs, modHandle, firstArg } = message.FireBot;
       let checkPerms = message.member.permissions.has(8) || message.member.permissions.has(32) || message.member.permissions.has(268435472);
       if (!checkPerms) return message.reply(lang.message.setup.noPerms());
       message.reply(lang.message.setup.checkChannel({gSet:await db.guildSet.findOne({ where: { guild_id: message.guild.id } })}))
              .then(m =>{
                  Promise.all([m.react("✅"), m.react("❌")]);
                  const yes = m.createReactionCollector(
                    (reaction, user) => reaction.emoji.name === '✅' && user.id === m.member.id,
                    { max: 1, time: 15000 });
                    
                  const no = m.createReactionCollector(
                    (reaction, user) => reaction.emoji.name === '❌' && user.id === m.member.id,
                    { max: 1, time: 15000 });
           
                  yes.on('collect', r => console.log(`Collected ${r.emoji.name}`));
                  yes.on('end', collected => {
                      no.emit('end');
                      console.log(`Collected ${collected.size} Yes items`);
                  });
                  no.on('collect', r => console.log(`Collected ${r.emoji.name}`));
                  no.on('end', collected => {
                      yes.emit('end');
                      console.log(`Collected ${collected.size} No items`);
                  });
       });
       
       
    },
    help: async (client, db, message, lang) => {
        
    }
};


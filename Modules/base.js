/* FireBot-V2
 * base.js
 * View the file LICENSE in the ROOT/BASE folder of the project for the License
 */
//❌ ✅

const Promise = require("bluebird");

/* global __dirname */
var path = require("path");
var jp = path.join;
var cwd = __dirname;
const LangSelector = require(jp(cwd, "..", "Language","LangSelector.js"));

module.exports = {
    setup: async (client, db, message) => {
       let { guildSet, lang, prefix, cmdList, cmdString, cmd, cmdArgs, modHandle, firstArg } = message.FireBot;
       let checkPerms = message.member.permissions.has(8) || message.member.permissions.has(32) || message.member.permissions.has(268435472);
       if (!checkPerms) return message.reply(lang.message.setup.noPerms());
       message.reply(lang.message.setup.checkChannel({gSet: guildSet}));
       
       const cccFilter = m => m.member.id === message.member.id
                && (m.content.toLowerCase() === lang.message.setup.yesNo[0] || m.content.toLowerCase() === lang.message.setup.yesNo[1]
                ||  m.content.toLowerCase() === lang.message.setup.yesNo[0].charAt(0) || m.content.toLowerCase() === lang.message.setup.yesNo[1].charAt(0));
    
       const channelCheckCol = message.channel.createMessageCollector(cccFilter, { maxMatches: 1, time: 15000 });
       channelCheckCol.on('end', (c, r) => {
           let m = c.first();
           if (r === "matchesLimit" || r === "limit"){
               if (m.content === lang.message.setup.yesNo[0] || m.content === lang.message.setup.yesNo[0].charAt(0)){
               setup(client, db, m, message);
           } else {
               return m.channel.send(lang.message.setup.cancelSetup);
           }
           } else if (r === "time"){
               return m.channel.send(`${lang.message.setup.noTime}\n${lang.message.setup.cancelSetup}`);
           } else {
                return m.channel.send(`${lang.message.error.msg()}\nAlso note: ${lang.message.setup.cancelSetup}`);
           }
       });
       
       
    },
    help: async (client, db, message) => {
        let { guildSet, lang, prefix, cmdList, cmdString, cmd, cmdArgs, modHandle, firstArg } = message.FireBot;
           
    },
    eval: async (client, db, message) => {
        let { guildSet, lang, prefix, cmdList, cmdString, cmd, cmdArgs, modHandle, firstArg } = message.FireBot;
        
        if (message.member.id !== client.FireBotVars.configFile.bot.maintainer_id) return message.reply("No! No Eval for you!");
        
        try {
            eval(cmdArgs);
        } catch(e){
            message.reply(lang.message.error.msg);
            message.channel.send(lang.message.error.msgText({err:e}));
        }
      }
       
};

function setup(client, db, message, originalMessage){
    let { guildSet, lang, prefix, cmdList, cmdString, cmd, cmdArgs, modHandle, firstArg } = originalMessage.FireBot;
    let yesNo  = lang.message.setup.yesNo;
    const basicFilter = m => m.member.id === message.member.id;
    const ynFilter = m => basicFilter(m)
            && (m.content.toLowerCase() === yesNo[0] || m.content.toLowerCase() === yesNo[1]
            ||  m.content.toLowerCase() === yesNo[0].charAt(0) || m.content.toLowerCase() === yesNo[1].charAt(0));
    
    let gSet = {
        prefix: guildSet.get("prefix"),
        language: guildSet.get("language"),
        devMessage: guildSet.get("devMessage"),
        deleteCmd: guildSet.get("deleteCmd")
    };
    
    message.channel.send(lang.message.setup.askPrefix({gSet:guildSet}));
    message.channel.awaitMessages(ynFilter, {maxMatches:1, time:15000, errors:['time']})
           .then(c => new Promise(function(res, rec){
             let m = c.first();
             console.log(m.content !== yesNo[0] && m.content !== yesNo[0].charAt(0));
             if (m.content !== yesNo[0] && m.content !== yesNo[0].charAt(0)){ return res(m); }
             m.channel.send("You have 15 seconds to enter a new prefix.\nRemember prefixes are CaSe SeNsItIvE. Note: If you enter more then one word (There is a/many space/s) only the first word will be used.");
             m.channel.awaitMessages(basicFilter, {maxMatches:1, time:15000, errors:['time']})
                     .then(c => {
                         let m = c.first();
                         let newPre = m.content.split(" ")[0];
                         m.channel.send(`Enter 'yes' to confirm the new prefix of '${newPre}' or 'no' to cancel and use '${gSet.prefix}' as your prefix.\nYou have 15 seconds to enter otherwise no changes are made.`);
                         m.channel.awaitMessages(ynFilter, {maxMatches:1, time:15000, errors:['time']})
                                 .then(c => new Promise((a, r) => {
                                     if (c.first().content !== yesNo[0] && c.first().content !== yesNo[0].charAt(0)){ c.first().channel.send(`Prefix is still ${gSet.prefix}`); return a(c.first()); }
                                     else {gSet.prefix = newPre; c.first().channel.send(`New prefix set to ${newPre}`); return a(c.first());} }))
                                 .catch(c => { c.first().channel.send(`Prefix is still ${gSet.prefix}`); a(c.first()); })
                                 .then(m => res(m));
                   }).catch(c => { c.first().channel.send(`No prefix entered! Prefix not changing from ${gSet.prefix}`); return res(c.first()); });
                   
           }))
           .catch(c => console.log(c))
           .then(m => {
               m.channel.send(langList());
               const numFilt = m => basicFilter(m) && typeof(parseInt(m.content)) === "number";
               m.channel.awaitMessage(numFilt, {maxMatches:1, time:15000, errors:['time']})
                       .then(c => new Promise((res, rec) => {
                               let m = c.first();
                               let num = parseInt(m.content);
                               if (typeof(num) !== "number") return rec("NaN", c);
                               //We have a number now lets check/do the thing with it.
                               let lang = langList(true, num);
                               if (lang === false) return rec("NvL", c);
                               res(m, lang);         
                              })
                           .then()
                           .catch((r, c) => {})
                      ).catch(c => console.log("Next", c));
           });    
};

function langList(makeLangSetting, num){
    let langArray = LangSelector(null, null, true);
    if (makeLangSetting !== true){
        let x = "You have 15 seconds to enter the number corresponding to the language you want to use on this server as an intiger (IE '1' not 'one') otherwise it will not change.\nThe bot is avlible in the folowing languages.";
        let names = langArray[0];
        let j = 0;
        for (i=0;i < names.length;i++){
          for (ii=0;ii < names[i].length;ii++){
              if (names[i].length === 1) {
                  j++;
                  x += `\n${j}) ${names[i][ii]}`;
              } else if (ii > 0){
                  j++;
                  x += `\n${j}) ${names[i][ii]} ${names[i][0]}`;
              }
          }  
        }
        return x;
    }else{
        let array = langArray[1];
        let j = 0;
        for (i=0;i < names.length;i++){
          for (ii=0;ii < names[i].length;ii++){
              if (names[i].length === 1) {
                  j++;
                  if (j === num) return {lang: array[i][ii], loc: "DEFAULT"};
              } else if (ii > 0){
                  j++;
                  if (j === num) return {lang: array[i][0], loc: array[i][ii]};
              }
          }  
        }
        return false;
    }
}
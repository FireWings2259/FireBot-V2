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
                && (m.content.toLowerCase() === lang.message.setup.yesNoCan[0] || m.content.toLowerCase() === lang.message.setup.yesNoCan[1]
                ||  m.content.toLowerCase() === lang.message.setup.yesNoCan[0].charAt(0) || m.content.toLowerCase() === lang.message.setup.yesNoCan[1].charAt(0));
    
       const channelCheckCol = message.channel.createMessageCollector(cccFilter, { maxMatches: 1, time: 15000 });
       channelCheckCol.on('end', (c, r) => {
           let m = c.first();
           if (r === "matchesLimit" || r === "limit"){
               if (m.content === lang.message.setup.yesNoCan[0] || m.content === lang.message.setup.yesNoCan[0].charAt(0)){
               setup(client, db, m, message);
           } else {
               return message.channel.send(lang.message.setup.cancelSetup);
           }
           } else if (r === "time"){
               return message.channel.send(`${lang.message.setup.noTime}\n${lang.message.setup.cancelSetup}`);
           } else {
                return message.channel.send(`${lang.message.error.msg()}\nAlso note: ${lang.message.setup.cancelSetup}`);
           }
       });
       
       
    },
    help: async (client, db, message) => {
        let { guildSet, lang, prefix, cmdList, cmdString, cmd, cmdArgs, modHandle, firstArg } = message.FireBot;
           
    },
    eval: async (client, db, message) => {
        let { guildSet, lang, prefix, cmdList, cmdString, cmd, cmdArgs, modHandle, firstArg } = message.FireBot;
        
        if (!client.FireBotVars.configFile.bot.enableEval) return message.reply("Eval has been disabled. See the bot owner if you think this is an error.");
        if (message.member.id !== client.FireBotVars.configFile.bot.maintainer_id) return message.reply("No! No Eval for you!");
        
        try {
            eval(cmdArgs);
        } catch(e){
            message.reply(lang.message.error.msg);
            message.channel.send(lang.message.error.msgText({err:e}));
        }
      }, //[TODO]Move text to Lang[/TODO]
    stop: async (client, db, message) => {
        if (message.member.id === client.FireBotVars.configFile.bot.maintainer_id) return process.exit(0);
    },
    debug: async (client, db, message) => {}
      
};

function setup(client, db, message, originalMessage){
    let { guildSet, lang, prefix, cmdList, cmdString, cmd, cmdArgs, modHandle, firstArg } = originalMessage.FireBot;
    let glang = lang.message.setup;
    lang = glang;
    
    let yesNoCan  = lang.yesNoCan; //Yes No Cancel Array
    const basicFilter = m => m.member.id === message.member.id; //Basic message filter
    const yFilter = m => m.content.toLowerCase() === yesNoCan[0] || m.content.toLowerCase() === yesNoCan[0].charAt(0); //Filter for yes or y
    const nFilter = m => m.content.toLowerCase() === yesNoCan[1] || m.content.toLowerCase() === yesNoCan[1].charAt(0); //Filter for no or n
    const cFilter = m => m.content.toLowerCase() === yesNoCan[2] || m.content.toLowerCase() === yesNoCan[2].charAt(0); //Filter for cancel or c
    
    const ynFilter = m => yFilter(m) || nFilter(m); //Filter for yes/y or no/n
    const yncFilter = m => yFilter(m) || nFilter(m) || cFilter(m); //Filter for yes/y or no/n or cancel/c
    
    const ynBFilter = m => basicFilter(m) && ynFilter(m); //Apply the basic filter to ynFilter
    const yncBFilter = m => basicFilter(m) && yncFilter(m); //Apply the basic filter to yncFilter
    
    let gSet = {
        prefix: guildSet.get("prefix"),
        language: guildSet.get("language"),
        devMessage: guildSet.get("devMessage"),
        deleteCmd: guildSet.get("deleteCmd")
    };
    
    //Fix Value $hit
    
    //Now I know i could do this all with promises, but since i scrapped that part like 3 times, Im useing this. (If you can make it do the thing with out braking go ahead)
    new Promise((accept, reject) => {
        message.channel.send(lang.prefix.askPrefix({gSet:guildSet}));
        const p1 = message.channel.createMessageCollector(yncBFilter, {maxMatches:1, time:15000, errors:['time']});
        p1.on('end', (c, r) => {
            let m = c.first();
            if (r === "matchesLimit" || r === "limit"){
                if (cFilter(m)) return reject(m);
                if (!yFilter(m)){ return accept(m);}
                m.channel.send(`Enter new prefix.`);
                const p2 = m.channel.createMessageCollector(basicFilter, {maxMatches:1, time:15000, errors:['time']});
                p2.on('end', (c, r) =>{
                    m = c.first();
                    if (r === "matchesLimit" || r === "limit"){
                        let newPre = m.content.split(" ")[0];
                        m.channel.send(lang.prefix.conNewPrefix({newPre: newPre, gSet: gSet}));
                        const p3 = m.channel.createMessageCollector(yncBFilter, {maxMatches:1, time:15000, errors:['time']});
                        p3.on('end', (c, r) => {
                           m = c.first();
                           if (r === "matchesLimit" || r === "limit"){
                               if (m.content === "c") return reject(m);
                               if (!yFilter(m)){ return accept(m);}
                               m.channel.send(lang.prefix.setPre({value:newPre}));
                               gSet.prefix = newPre;
                               accept(m);
                           } else if (r === "time"){
                                message.channel.send(lang.noTime.slice(0, -1) + lang.prefix.defno + lang.prefix.noChange);
                                return accept(message);
                            } else {
                                message.channel.send(lang.stepSkip);
                                accept(message);
                            }
                        });
                    } else if (r === "time"){
                        message.channel.send(lang.noTime.slice(0, -22) + lang.prefix.noChange);
                        return accept(message);
                    } else {
                        message.channel.send(lang.stepSkip);
                        accept(message);
                    }
                });
            } else if (r === "time"){
                message.channel.send(lang.noTime.slice(0, -1) + lang.prefix.defno + lang.prefix.noChange);
                return accept(message);
            } else {
                message.channel.send(lang.stepSkip);
                accept(message);
            }
        });
    }) //Prefix Management Stuff
    .then(message => new Promise((accept, reject) =>{
        message.channel.send(lang.lang.ask({value: getLangName({lang:client.FireBotVars.configFile.bot.default_lang[0], loc:client.FireBotVars.configFile.bot.default_lang[1]})}));
        const p1 = message.channel.createMessageCollector(yncBFilter, {maxMatches:1, time:15000, errors:['time']});
        p1.on('end', (c, r) => {
            let m = c.first();
            if (r === "matchesLimit" || r === "limit"){
                if (cFilter(m)) return reject(m);
                if (!yFilter(m)){ return accept(m);}
                m.channel.send(langList([lang.lang.ask]));
                const p2 = m.channel.createMessageCollector(basicFilter, {maxMatches:1, time:15000, errors:['time']});
                p2.on('end', (c, r) =>{
                    m = c.first();
                    if (r === "matchesLimit" || r === "limit"){
                        let num = parseInt(m.content.split(" ")[0]);
                        if (isNaN(num)){
                            m.channel.send(lang.lang.vNaN + lang.lang.noChange);
                            accept(m);
                        }
                        let lLang = langList(true, num);
                        if (lLang === false){
                            m.channel.send(lang.lang.vNvL + lang.lang.noChange);
                            accept(m);
                        }
                        m.channel.send(lang.lang.confLang({value: langList(true, num, true)}));
                        const p3 = m.channel.createMessageCollector(yncBFilter, {maxMatches:1, time:15000, errors:['time']});
                        p3.on('end', (c, r) => {
                           m = c.first();
                           if (r === "matchesLimit" || r === "limit"){
                               if (cFilter(m)) return reject(m);
                               if (!yFilter(m)){ return accept(m);}
                               m.channel.send(`Language set to ${langList(true, num, true)}`);
                               gSet.language = lLang;
                               accept(m);
                           } else if (r === "time"){
                                message.channel.send(lang.noTime.slice(0, -1) + lang.lang.defNo + lang.lang.noChange);
                                return accept(message);
                            } else {
                                message.channel.send(lang.stepSkip);
                                accept(message);
                            }
                        });
                    } else if (r === "time"){
                        message.channel.send(lang.noTime.slice(0, -1) + lang.lang.defNo + lang.lang.noChange);
                        return accept(message);
                    } else {
                       message.channel.send(lang.stepSkip);
                        accept(message);
                    }
                });
            } else if (r === "time"){
                message.channel.send(lang.noTime.slice(0, -1) + lang.lang.defNo + lang.lang.noChange);
                return accept(message);
            } else {
                message.channel.send(lang.stepSkip);
                accept(message);
            }
        });
    })) //Language Management Stuff
    .then(message => new Promise((accept, reject) =>{
        message.channel.send(lang.devMess.askDev({value:gSet.devMessage}));
        const p1 = message.channel.createMessageCollector(yncBFilter, {maxMatches:1, time:15000, errors:['time']});
        p1.on('end', (c, r) => {
            let m = c.first();
            if (r === "matchesLimit" || r === "limit"){
                if (cFilter(m)) return reject(m);
                if (!yFilter(m)){ return accept(m);}
                gSet.devMessage = !gSet.devMessage;
                return accept(m);
            } else if (r === "time"){
                message.channel.send(lang.noTime.slice(0, -22) + lang.devMess.cancelSetup({value: gSet.devMessage}));
                return accept(message);
            } else {
                message.channel.send(lang.stepSkip);
                accept(message);
            }
        });
    }))//Dev Message Stuff
    .then(message => new Promise((accept, reject) =>{
        message.channel.send(lang.delCMD.askDel({value: gSet.deleteCmd}));
        const p1 = message.channel.createMessageCollector(yncBFilter, {maxMatches:1, time:15000, errors:['time']});
        p1.on('end', (c, r) => {
            let m = c.first();
            if (r === "matchesLimit" || r === "limit"){
                if (cFilter(m)) return reject(m);
                if (!yFilter(m)){ return accept(m);}
                gSet.deleteCmd = !gSet.deleteCmd;
                return accept(m);
            } else if (r === "time"){
                message.channel.send(lang.message.setup.noTime.slice(0, -22) + lang.delCMD.cancelSetup({value: gSet.deleteCmd}));
                return accept(message);
            } else {
                message.channel.send(lang.stepSkip);
                accept(message);
            }
        });
    }))//Del CMD Stuff
    .then(message => new Promise((accept, reject) => {
        
    }))//Write DB Stuff
    .catch(console.log)
    .catch(message => {
        message.channel.send(lang.message.setup.cancelSetup);
    });//Cancel Setup
}

function langList(makeLangSetting, num, other){
    let langArray = LangSelector(null, null, true); //Get lang list
    if (makeLangSetting !== true && typeof(makeLangSetting === "object")){
        let x = makeLangSetting[0]; //[TODO] Move this [/TODO]
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
    } else if (makeLangSetting && other){
        let names = langArray[0];
        let j = 0;
        for (i=0;i < names.length;i++){
          for (ii=0;ii < names[i].length;ii++){
              if (names[i].length === 1) {
                  j++;
                  if (j === num) return `${names[i][ii]}`;
              } else if (ii > 0){
                  j++;
                  if (j === num) return `${names[i][ii]} ${names[i][0]}`;
              }
          }  
        }
    } else {
        let array = langArray[1];
        let names = langArray[0];
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

function getLangName(lLang){
    let lang = lLang.lang;
    let loc = lLang.loc;
    if (loc === undefined) loc = "DEFAULT";
    
    let langArray = LangSelector(null, null, true); //Get lang list
    let names = langArray[0];
    let array = langArray[1];
    
    for(i=0; i < array.length; i++){
        if (lang === array[i][0]){
            for (ii=0; ii < array[i].length; ii++){
                if (loc === array[i][ii]){
                    if (loc === "DEFAULT") return `${names[i]}`;
                    return `${names[i][ii]} ${names[i][0]}`;
                }
            }
        }
    }
    return false;
}


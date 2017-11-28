const hdate = require("human-date");

module.exports = function(sqlize, DataTypes, lang){
  return sqlize.define("errorLog", {
     time: {
       type: DataTypes.Date,
       defaultValue: hdate.prettyPrint(new Date, { showTime: true })
     },
     error: DataTypes.STRING,
     user_id: {
         type: DataTypes.STRING,
         defaultValue: lang.database.error.user_id
     },
     user_name: {
         type: DataTypes.STRING,
         defaultValue: lang.database.error.user_name
     },
     user_nick: {
         type: DataTypes.STRING,
         defaultValue: lang.database.error.user_nick
     },
     channel_id: {
         type: DataTypes.STRING,
         defaultValue: lang.database.error.channel_id
     },
     channel_name: {
         type: DataTypes.STRING,
         defaultValue: lang.database.error.channel_name
     },
     guild_id: {
         type: DataTypes.STRING,
         defaultValue: lang.database.error.guild_id
     },
     guild_name: {
         type: DataTypes.STRING,
         defaultValue: lang.database.error.guild_name
     },
     message: {
         type: DataTypes.STRING,
         defaultValue: lang.database.error.message
     },
  });  
};
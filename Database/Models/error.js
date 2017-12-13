const hdate = require("human-date");

/*So error codes are built like so..
00x0000a000
00x--_-, The first two Integers are the code type, 00 is for errors, 01 may be for notices, ect
--x--_-, The x is a marker point, this is always the same,
--x00a0, The next 2 Integers, Letter and the following Integer are the error/notice/ect
code themself, for you to lookup.
*/

module.exports = (sqlize, DataTypes) => {
  return sqlize.define("errorLog", {
     time: {
       type: DataTypes.DATE,
       defaultValue: hdate.prettyPrint(new Date, { showTime: true })
     },
     error: DataTypes.STRING,
     user_id: {
         type: DataTypes.STRING,
         defaultValue: "00x000a01"
     },
     user_name: {
         type: DataTypes.STRING,
         defaultValue: "00x000a02"
     },
     user_nick: {
         type: DataTypes.STRING,
         defaultValue: "00x000a03"
     },
     channel_id: {
         type: DataTypes.STRING,
         defaultValue: "00x000a04"
     },
     channel_name: {
         type: DataTypes.STRING,
         defaultValue: "00x000a05"
     },
     guild_id: {
         type: DataTypes.STRING,
         defaultValue: "00x000a06"
     },
     guild_name: {
         type: DataTypes.STRING,
         defaultValue: "00x000a07"
     },
     message: {
         type: DataTypes.STRING,
         defaultValue: "00x000a08"
     }
  });  
};
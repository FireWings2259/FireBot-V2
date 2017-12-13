/*So error codes are built like so..
00x0000a000
00x--_-, The first two Integers are the code type, 00 is for errors, 01 may be for notices, ect
--x--_-, The x is a marker point, this is always the same,
--x00a0, The next 2 Integers, Letter and the following Integer are the error/notice/ect
code themself, for you to lookup.
*/

module.exports = (sqlize, DataTypes) => {
  return sqlize.define("errorLog", {
    /* time: { //Don't need this becuse of the inbuilt time.
       type: DataTypes.STRING,
       defaultValue: "00x000a09"
     },*/
     error: DataTypes.STRING,
     user_id: {
         type: DataTypes.STRING,
         defaultValue: "00x000a01"
     },
     user_name: {
         type: DataTypes.STRING,
         defaultValue: "00x000a02"
     },
    /* user_nick: { //When this is figured out it will be put back in.
         type: DataTypes.STRING,
         defaultValue: "00x000a03"
     }, */
     channel_id: {
         type: DataTypes.STRING,
         defaultValue: "00x000a04"
     },
     channel_type:{
       type: DataTypes.STRING,
       defaultValue:"00x000a10"
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
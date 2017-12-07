//Australian English File
//FireBot V2

var selfObjError = function(obj) { //The self error function.
    return String("Data Not Object! It's a '" + typeof(obj) + "'.");
};

module.exports = {
    bot: {
        
    },
    console: {
        error:{
            msg: "Whoa Dude! Error!"
        }
    },
    database:{
      error:{
          user_id: "No User ID", //00x000a01
          user_name: "No User Name", //00x000a02
          user_nick: "No User Nickname", //00x000a03
          channel_id: "No Channel ID", //00x000a04
          channel_name: "No Channel Name", //00x000a04
          guild_id: "No Guild ID", //00x000a06
          guild_name: "No Guild Name", //00x000a07
          message: "No Message" //00x000a08
      }  
    },
    nope: function(obj) { //{ username: "The Useres Username" }
            if (typeof(obj) != "object") throw new Error(selfObjError(obj));  
            return "This is a nope from: " + obj.username + ". Thats a Full Stop!";
          }
};
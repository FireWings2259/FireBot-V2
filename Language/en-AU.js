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
          user_id: "No User ID",
          user_name: "No User Name",
          user_nick: "No User Nickname",
          channel_id: "No Channel ID",
          channel_name: "No Channel Name",
          guild_id: "No Guild ID",
          guild_name: "No Guild Name",
          message: "No Message"
      }  
    },
    nope: function(obj) { //{ username: "The Useres Username" }
            if (typeof(obj) != "object") throw new Error(selfObjError(obj));  
            return "This is a nope from: " + obj.username + ". Thats a Full Stop!";
          }
};
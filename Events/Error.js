const hdate = require('human-date');

module.exports = {
    message: function(err, msg, db, lang){
      let time = hdate.prettyPrint(new Date, { showTime: true });
      
      let server;
      if (msg.guild == null){
        server = {id:"Na", name:"Na"};
      } else {
        server = {id: msg.guild.id, name: msg.guild.name};
      }
      
      console.log(time);
      console.log(lang.console.error.msg);
      console.log(err);
      
      db.save({
          Time: time,
          User: {
            ID: msg.author.id,
            Username: msg.author.username
          },
          Channel: {
            ID: msg.channel.id,
            Name: msg.channel.name
          },
          Guild: {
            ID: server.id,
            Name: server.name
          },
          Message: msg.content,
          Err: err
        });
    }
    
};
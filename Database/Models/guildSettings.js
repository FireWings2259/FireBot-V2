module.exports = (sqlize, DataTypes, lang, configFile) => {
  return sqlize.define("guildSettings",{
    guild_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      primaryKey: true
    },
    name: DataTypes.STRING,
    prefix: {
      type: DataTypes.STRING,
      defaultValue: configFile.bot.default_prefix //"-"
    },
    language: {
      type: DataTypes.JSON,
      defaultValue: {lang: configFile.bot.default_lang[0], loc: configFile.bot.default_lang[1]}
    },
    devMessage: {
      type: DataTypes.BOOLEAN,
      defaultValue: configFile.bot.devMessage
    },
    deleteCmd: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    guildOwner: {
      type: DataTypes.STRING
    },
    commands: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: lang.commands
    },
    newServer:{
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    
    other: {
      type: DataTypes.JSON,
      defaultValue: {}
    }
  });  
};
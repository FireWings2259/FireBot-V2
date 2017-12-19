module.exports = (sqlize, DataTypes, lang, configFile) => {
  return sqlize.define("guildSettings",{
    id: {
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
      defaultValue: {lang: configFile.bot.default_lang[0], loc: configFile.bot.default_lang[1]} //{lang: "en", loc: "AU"}
    },
    devMessage: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
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
      defaultValue: lang.commands //{} //This is populated later
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
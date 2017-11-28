module.exports = function(sqlize, DataTypes, authSettings){
  return sqlize.define("guildSettings",{
    id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    prefix: {
      type: DataTypes.STRING,
      defaultValue: authSettings.default_prefix
    },
    language: {
      type: DataTypes.JSON,
      defaultValue: {lang: authSettings.default_lang[0], loc: authSettings.default_lang[1]}
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
      type: DataTypes.STRING,
    },
    Commands: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {}, //This is populated later
    },
    
    other: {
      type: DataTypes.JSON,
      defaultValue: {}
    }
  });  
};
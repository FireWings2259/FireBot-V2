module.exports = (sqlize, DataTypes) => {
  return sqlize.define("levelPermsGuild",{
    guildID:{
      	type: DataTypes.STRING,
		    allowNull: false,
		    primaryKey: true
    },
    id:{
		    type: DataTypes.INTEGER,
		    defaultValue: 0,
		    allowNull: false,
		    primaryKey: true
      },
    name:DataTypes.STRING,
    desc:DataTypes.STRING,
    colour:DataTypes.STRING
    });  
};
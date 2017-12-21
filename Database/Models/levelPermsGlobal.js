module.exports = (sqlize, DataTypes) => {
  return sqlize.define("levelPermsGlobal",{
    level_id:{
        type: DataTypes.INTEGER,
	allowNull: false,
	primaryKey: true
      },
    name:DataTypes.STRING,
    desc:DataTypes.STRING,
    colour:{
        type: DataTypes.STRING,
        defaultValue: "#ffffff"
    },
    perms: {
        type: DataTypes.JSON,
        defaultValue: {}
    }
    });  
};
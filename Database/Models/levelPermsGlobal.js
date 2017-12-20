module.exports = (sqlize, DataTypes) => {
  return sqlize.define("levelPermsGlobal",{
    level_id:{
        type: DataTypes.INTEGER,
	defaultValue: 0,
	allowNull: false,
	primaryKey: true
      },
    name:DataTypes.STRING,
    desc:DataTypes.STRING,
    colour:DataTypes.STRING,
    perms: {
        type: DataTypes.JSON,
        defaultValue: {}
    }
    });  
};
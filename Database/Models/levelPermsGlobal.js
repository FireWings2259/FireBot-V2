module.exports = (sqlize, DataTypes) => {
  return sqlize.define("levelPermsGlobal",{
    id:{
		    type: DataTypes.INTEGER,
		    defaultValue: 0,
		    allowNull: false,
		    primaryKey: true,
      },
    name:DataTypes.String,
    desc:DataTypes.STRING,
    colour:DataTypes.String,
    });  
};
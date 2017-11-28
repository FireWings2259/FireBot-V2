
module.exports = function(sqlize, DataTypes){
    return sqlize.define("guildAdmins", {
      guildID: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      ID: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      isGroup:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      level:{
		    type: DataTypes.INTEGER,
		    defaultValue: 0,
		    allowNull: false,
      }
    }, {timestamps: true});
};
module.exports = (sqlize, DataTypes) => {
    return sqlize.define("guildAdmins", {
      guild_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
      },
      user_ID: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
      },
      isGroup:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      level:{
		    type: DataTypes.INTEGER,
		    defaultValue: 0,
		    allowNull: false
      }
    }, {timestamps: true});
};
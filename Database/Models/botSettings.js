module.exports = (sqlize, DataTypes) => {
    return sqlize.define("botSettings",{
        admin_id:{
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        level:{
           type: DataTypes.INTEGER,
           defaultValue: 0,
	   allowNull: false 
        }
    }, {timestamps: true});
};
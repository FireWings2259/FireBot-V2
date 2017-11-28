module.exports = function(sqlize, DataTypes) {
    return sqlize.define("botSettings",{
        admin:{
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        }
    }, {timestamps: true});
};
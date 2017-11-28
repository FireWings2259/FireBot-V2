module.exports = function(sqlize, DataTypes){
    return sqlize.define("shopItems",{
        name: {
            type: DataTypes.STRING,
            unique: true,
        },
        cost: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, 
    {
      timestamps: false
    });
};
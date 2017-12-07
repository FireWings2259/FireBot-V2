module.exports = (sqlize, DataTypes) => {
    return sqlize.define("globalUsers", {
        id:{
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            primaryKey: true,
        },
        balance: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
    }, {timestamps: true});
};
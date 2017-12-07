module.exports = (sqlize, DataTypes) => {
  return sqlize.define("userItems", {
    id: DataTypes.STRING,
    item_id: DataTypes.STRING,
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        default: 0,
    },
  }, 
  {
    timestamps: false
  });  
};
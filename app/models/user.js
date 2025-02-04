const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            Users.belongsTo(models.Department, {
                foreignKey: "dept_id",
                as: "department",
            });
        }
    }
    Users.init(
        {
            username: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            dept_id: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "User",
        }
    );
    return Users;
};

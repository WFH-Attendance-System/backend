const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Department extends Model {
        static associate(models) {
            Department.hasMany(models.User, {
                foreignKey: "dept_id",
                as: "users",
            });
        }
    }
    Department.init(
        {
            name: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Department",
        }
    );
    return Department;
};

